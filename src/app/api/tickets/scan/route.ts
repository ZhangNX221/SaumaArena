import { NextResponse } from 'next/server';
import { queryOne, run } from '@/db/sqlite';
import { requireAuth } from '@/lib/auth';
import { randomUUID } from 'node:crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { bookingCode, gateName = 'Gate Timur 1 (Suporter)' } = body;

    if (!bookingCode || typeof bookingCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Kode booking tiket QR wajib disertakan.' },
        { status: 400 }
      );
    }

    const cleanCode = bookingCode.trim().toUpperCase();

    // 1. Cari tiket di database
    const ticket = queryOne<any>(
      `SELECT t.*, tm.name as team_name, tm.school_name as team_school_name
       FROM tickets t
       LEFT JOIN teams tm ON t.team_id = tm.id
       WHERE UPPER(t.booking_code) = ?`,
      [cleanCode]
    );

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: `Tiket dengan kode '${cleanCode}' tidak ditemukan atau tidak terdaftar di sistem MMFC I.`,
        },
        { status: 404 }
      );
    }

    // 2. Cegah pemindaian ganda (Duplicate scan prevention - PRD 4.3 & 5.7)
    if (ticket.status === 'CHECKED_IN') {
      return NextResponse.json(
        {
          success: false,
          alreadyCheckedIn: true,
          error: `PERINGATAN: Tiket sudah pernah digunakan pada ${ticket.checked_in_at} di ${ticket.gate_name || 'pintu masuk'}. Akses ditolak!`,
          ticket: {
            id: ticket.id,
            bookingCode: ticket.booking_code,
            buyerName: ticket.buyer_name,
            checkedInAt: ticket.checked_in_at,
            gateName: ticket.gate_name,
            status: ticket.status,
          },
        },
        { status: 400 }
      );
    }

    if (ticket.status === 'CANCELLED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Tiket ini telah dibatalkan oleh panitia dan tidak dapat digunakan untuk memasuki stadion.',
        },
        { status: 400 }
      );
    }

    // Otorisasi ketat: Hanya petugas terautentikasi (ADMIN atau REFEREE/petugas lapangan) yang berhak memindai tiket
    const auth = requireAuth(request, ['ADMIN', 'REFEREE']);
    if (auth instanceof NextResponse) return auth;
    const officerId = auth.user.id;

    // Atomic status update to prevent race conditions during rapid gate check-in
    const updateResult = run(
      `UPDATE tickets
       SET status = 'CHECKED_IN', checked_in_at = CURRENT_TIMESTAMP, checked_in_by = ?, gate_name = ?
       WHERE id = ? AND status != 'CHECKED_IN'`,
      [officerId, gateName, ticket.id]
    );

    if (updateResult.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          alreadyCheckedIn: true,
          error: `PERINGATAN: Tiket sudah dipindai oleh pintu masuk lain. Akses ditolak!`,
        },
        { status: 400 }
      );
    }

    // 5. BONUS POIN SUPORTER: Jika tiket suporter kontingen, tambahkan poin kehadiran tiket (+1 per qty)
    let supporterBonusApplied = false;
    let newSupporterTotal = null;

    if (ticket.team_id) {
      const existingScore = queryOne<any>(
        'SELECT * FROM supporter_scores WHERE team_id = ?',
        [ticket.team_id]
      );

      const addedTicketPoints = ticket.quantity || 1;

      if (existingScore) {
        const updatedTicketPoints = (existingScore.ticket_points || 0) + addedTicketPoints;
        const totalScore = updatedTicketPoints + (existingScore.creativity_points || 0) - (existingScore.penalty_points || 0);
        run(
          `UPDATE supporter_scores
           SET ticket_points = ?, total_score = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [updatedTicketPoints, totalScore, existingScore.id]
        );
        newSupporterTotal = totalScore;
        supporterBonusApplied = true;
      } else {
        const scoreId = `sup_${ticket.team_id}`;
        run(
          `INSERT INTO supporter_scores (
            id, competition_id, team_id, ticket_points, creativity_points, penalty_points, total_score, notes
          ) VALUES (?, 'comp_futsal_2026', ?, ?, 0, 0, ?, 'Akumulasi poin kehadiran gate masuk tiket')`,
          [scoreId, ticket.team_id, addedTicketPoints, addedTicketPoints]
        );
        newSupporterTotal = addedTicketPoints;
        supporterBonusApplied = true;
      }
    }

    // 6. Catat log audit
    const auditId = `audit_${randomUUID().slice(0, 8)}`;
    run(
      `INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, before_val, after_val, reason)
       VALUES (?, ?, 'ticket_check_in', 'tickets', ?, ?, ?, ?)`,
      [
        auditId,
        officerId,
        ticket.id,
        JSON.stringify({ status: 'ISSUED' }),
        JSON.stringify({ status: 'CHECKED_IN', gate: gateName }),
        `Check-in gate scanner untuk ${ticket.buyer_name} (${ticket.quantity} tiket)`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: `Tiket Valid! Selamat datang di Sauma Arena (${ticket.buyer_name} • ${ticket.quantity} Orang).`,
      ticket: {
        id: ticket.id,
        bookingCode: ticket.booking_code,
        buyerName: ticket.buyer_name,
        buyerPhone: ticket.buyer_phone,
        category: ticket.category,
        quantity: ticket.quantity,
        teamName: ticket.team_name,
        schoolName: ticket.team_school_name,
        gateName,
        status: 'CHECKED_IN',
        checkedInAt: new Date().toISOString(),
      },
      supporterBonusApplied,
      newSupporterTotal,
    });
  } catch (error: any) {
    console.error('Error scanning ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memproses validasi tiket gate stadion.' },
      { status: 500 }
    );
  }
}

