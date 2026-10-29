import { NextResponse } from 'next/server';
import { authenticateUser, signToken } from '@/lib/auth';
import { run } from '@/db/sqlite';
import { randomUUID } from 'node:crypto';

// Rate limiter in-memory untuk mitigasi Brute Force / Credential Stuffing (hunt-brute-force)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60 * 1000; // 1 menit

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }
  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak percobaan masuk. Mohon tunggu 1 menit sebelum mencoba kembali (Rate limit exceeded).',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password, role } = body;

    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Username dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const authResult = authenticateUser(username, password);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Autentikasi gagal.' },
        { status: authResult.statusCode || 401 }
      );
    }

    // Reset rate limit on success
    loginAttempts.delete(ip);

    const user = authResult.user;

    // Validasi kesesuaian peran jika dikirimkan oleh form
    if (role && user.role !== role) {
      // Izinkan admin masuk ke konsol juri, tapi juri tidak boleh masuk ke panel admin
      if (role === 'ADMIN' && user.role !== 'ADMIN') {
        return NextResponse.json(
          {
            success: false,
            error: `Akses ditolak. Akun '${user.name}' adalah ${user.roleLabel} dan tidak memiliki izin Administrator.`,
          },
          { status: 403 }
        );
      }
    }

    // Buat JWT Token aman
    const token = signToken({
      userId: user.id,
      username: user.username || user.id,
      role: user.role,
      name: user.name,
    });

    // Catat log audit login (pastikan profil sinkron untuk integritas foreign key)
    try {
      run(
        `INSERT OR IGNORE INTO profiles (id, role, display_name, phone, is_active)
         VALUES (?, ?, ?, '081200000000', 1)`,
        [user.id, user.role === 'ADMIN' ? 'admin' : 'official', user.name]
      );
      run(
        'INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, after_val) VALUES (?, ?, ?, ?, ?, ?)',
        [
          `audit_${randomUUID().slice(0, 8)}`,
          user.id,
          'LOGIN',
          'auth_users',
          user.id,
          JSON.stringify({
            timestamp: new Date().toISOString(),
            role: user.role,
            ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
          }),
        ]
      );
    } catch (auditErr) {
      console.error('Audit log notice during login:', auditErr);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Autentikasi berhasil.',
      token,
      user,
    });

    // Set cookie HTTPOnly yang aman
    response.cookies.set('sauma_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });

    return response;
  } catch (error: any) {
    console.error('Error in /api/auth/login:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal pada server autentikasi.' },
      { status: 500 }
    );
  }
}
