import { NextResponse } from 'next/server';
import { getAuthUserFromRequest, changeUserPassword, signToken } from '@/lib/auth';
import { run } from '@/db/sqlite';
import { randomUUID } from 'node:crypto';

export async function POST(request: Request) {
  try {
    const auth = getAuthUserFromRequest(request);
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword, userId, username } = body || {};

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi saat ini dan kata sandi baru wajib diisi.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Konfirmasi kata sandi baru tidak cocok. Periksa kembali.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi baru minimal harus 6 karakter.' },
        { status: 400 }
      );
    }

    // Tentukan user target:
    // 1. Jika terautentikasi via token/cookie: gunakan akun yang sedang login.
    //    Jika admin, izinkan admin mengubah target user jika userId disediakan.
    // 2. Jika sesi belum terbaca di cookie/header: gunakan identifier dari body (userId atau username),
    //    dengan jaminan keamanan mutlak karena currentPassword tetap wajib diverifikasi oleh SQLite hash!
    let targetIdentifier: string | null = null;

    if (auth) {
      if (userId && auth.user.role === 'ADMIN') {
        targetIdentifier = userId;
      } else {
        targetIdentifier = auth.user.id;
      }
    } else if (userId || username) {
      targetIdentifier = userId || username;
    }

    if (!targetIdentifier) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sesi masuk tidak ditemukan. Mohon masuk kembali sebelum mengganti kata sandi.',
        },
        { status: 401 }
      );
    }

    const changeResult = changeUserPassword(targetIdentifier, currentPassword, newPassword);

    if (!changeResult.success || !changeResult.user) {
      return NextResponse.json(
        { success: false, error: changeResult.error || 'Gagal memperbarui kata sandi.' },
        { status: changeResult.statusCode || 400 }
      );
    }

    const updatedUser = changeResult.user;

    // Catat log audit ke SQLite
    try {
      run(
        `INSERT OR IGNORE INTO profiles (id, role, display_name, phone, is_active)
         VALUES (?, ?, ?, '081200000000', 1)`,
        [updatedUser.id, updatedUser.role === 'ADMIN' ? 'admin' : 'official', updatedUser.name]
      );

      run(
        'INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, after_val) VALUES (?, ?, ?, ?, ?, ?)',
        [
          `audit_${randomUUID().slice(0, 8)}`,
          updatedUser.id,
          'PASSWORD_CHANGE',
          'auth_users',
          updatedUser.id,
          JSON.stringify({
            timestamp: new Date().toISOString(),
            ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
            actionDescription: `Kata sandi untuk pengguna ${updatedUser.username} (${updatedUser.name}) berhasil diperbarui.`,
          }),
        ]
      );
    } catch (auditErr) {
      console.error('Audit log notice during password change:', auditErr);
    }

    // Generate token JWT baru dengan masa aktif segar
    const newToken = signToken({
      userId: updatedUser.id,
      username: updatedUser.username || updatedUser.id,
      role: updatedUser.role,
      name: updatedUser.name,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Kata sandi berhasil diperbarui dan langsung aktif.',
      token: newToken,
      user: updatedUser,
    });

    // Set cookie HTTP-only yang aman
    response.cookies.set('sauma_auth_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Error in /api/auth/change-password:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal server saat mengubah kata sandi.' },
      { status: 500 }
    );
  }
}
