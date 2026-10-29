import { NextResponse } from 'next/server';
import { query, queryOne, run, transaction } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

const TOTAL_VENUE_QUOTA = 500;

export async function GET(request: Request) {
  try {
    // Otorisasi ketat (Perlindungan Tiket & PII): Hanya ADMIN yang berhak melihat daftar seluruh tiket & kode booking
    const auth = requireAuth(request, ['ADMIN']);
    if (auth instanceof NextResponse) return auth;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const teamId = searchParams.get('teamId');
    const q = searchParams.get('q');

    let sql = `
      SELECT t.*, tm.name as team_name, tm.school_name as team_school_name
      FROM tickets t
      LEFT JOIN teams tm ON t.team_id = tm.id
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (status) {
      sql += ' AND t.status = ?';
      params.push(status.toUpperCase());
    }

    if (category) {
      sql += ' AND t.category = ?';
      params.push(category.toUpperCase());
    }

    if (teamId) {
      sql += ' AND t.team_id = ?';
      params.push(teamId);
    }

    if (q && q.trim()) {
      sql += ' AND (t.booking_code LIKE ? OR t.buyer_name LIKE ? OR t.buyer_phone LIKE ?)';
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY t.created_at DESC';
    const rows = query<any>(sql, params);

    // Hitung metrik kuota tiket
    const statsRow = queryOne<any>(`
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN status = 'CHECKED_IN' THEN quantity ELSE 0 END) as checked_in_qty,
        SUM(CASE WHEN status = 'ISSUED' THEN quantity ELSE 0 END) as issued_qty,
        SUM(CASE WHEN status = 'CANCELLED' THEN quantity ELSE 0 END) as cancelled_qty,
        SUM(quantity) as total_qty
      FROM tickets
    `);

    const totalUsed = (Number(statsRow?.issued_qty) || 0) + (Number(statsRow?.checked_in_qty) || 0);
    const remainingQuota = Math.max(0, TOTAL_VENUE_QUOTA - totalUsed);

    const tickets = rows.map((r) => ({
      id: r.id,
      bookingCode: r.booking_code,
      buyerName: r.buyer_name,
      buyerPhone: r.buyer_phone,
      buyerEmail: r.buyer_email || '',
      teamId: r.team_id || null,
      teamName: r.team_name || null,
      schoolName: r.team_school_name || null,
      category: r.category,
      quantity: r.quantity,
      price: r.price,
      status: r.status,
      checkedInAt: r.checked_in_at || null,
      checkedInBy: r.checked_in_by || null,
      gateName: r.gate_name || null,
      createdAt: r.created_at,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalVenueQuota: TOTAL_VENUE_QUOTA,
        remainingQuota,
        totalIssuedQuantity: statsRow?.issued_qty || 0,
        totalCheckedInQuantity: statsRow?.checked_in_qty || 0,
        totalCancelledQuantity: statsRow?.cancelled_qty || 0,
      },
      count: tickets.length,
      tickets,
    });
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data tiket stadion.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      buyerName,
      buyerPhone,
      buyerEmail = '',
      teamId = null,
      category = 'REGULAR',
      quantity = 1,
    } = body;

    if (!buyerName || !buyerPhone) {
      return NextResponse.json(
        { success: false, error: 'Nama pembeli dan nomor telepon/WhatsApp aktif wajib diisi.' },
        { status: 400 }
      );
    }

    const qty = Math.max(1, Math.min(20, Number(quantity) || 1));
    const validCategory = ['REGULAR', 'VIP', 'SUPPORTER'].includes(category.toUpperCase())
      ? category.toUpperCase()
      : 'REGULAR';

    const pricePerTicket = validCategory === 'VIP' ? 35000 : validCategory === 'SUPPORTER' ? 12000 : 15000;

    // Periksa kuota dan terbitkan tiket secara atomik (mencegah TOCTOU overbooking race condition)
    let ticketId = '';
    let bookingCode = '';

    try {
      const issued = transaction(() => {
        const statsRow = queryOne<any>(`
          SELECT SUM(CASE WHEN status != 'CANCELLED' THEN quantity ELSE 0 END) as active_qty
          FROM tickets
        `);
        const activeQty = statsRow?.active_qty || 0;
        if (activeQty + qty > TOTAL_VENUE_QUOTA) {
          throw new Error(`QUOTA_EXCEEDED:${Math.max(0, TOTAL_VENUE_QUOTA - activeQty)}`);
        }

        const tid = `tkt_${Date.now()}_${randomUUID().slice(0, 6)}`;
        const randomHex = randomUUID().slice(0, 6).toUpperCase();
        const prefix = validCategory === 'VIP' ? 'VIP' : validCategory === 'SUPPORTER' ? 'SUP' : 'REG';
        const bCode = `MMFC-${prefix}-${randomHex}`;

        run(
          `INSERT INTO tickets (
            id, booking_code, buyer_name, buyer_phone, buyer_email, team_id,
            category, quantity, price, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ISSUED')`,
          [
            tid,
            bCode,
            buyerName.trim(),
            buyerPhone.trim(),
            buyerEmail.trim(),
            teamId,
            validCategory,
            qty,
            pricePerTicket,
          ]
        );

        return { ticketId: tid, bookingCode: bCode };
      });

      ticketId = issued.ticketId;
      bookingCode = issued.bookingCode;
    } catch (err: any) {
      if (err.message && err.message.startsWith('QUOTA_EXCEEDED:')) {
        const remaining = err.message.split(':')[1];
        return NextResponse.json(
          {
            success: false,
            error: `Kuota tiket stadion telah habis atau tidak mencukupi untuk ${qty} tiket (Tersisa: ${remaining} kursi).`,
          },
          { status: 400 }
        );
      }
      throw err;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'E-Tiket resmi MMFC I berhasil diterbitkan!',
        ticket: {
          id: ticketId,
          bookingCode,
          buyerName: buyerName.trim(),
          buyerPhone: buyerPhone.trim(),
          buyerEmail: buyerEmail.trim(),
          teamId,
          category: validCategory,
          quantity: qty,
          pricePerTicket,
          totalPrice: qty * pricePerTicket,
          status: 'ISSUED',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat menerbitkan e-tiket.' },
      { status: 500 }
    );
  }
}

