import { NextResponse } from 'next/server';
import { requireAuth, updateUserProfile, signToken } from '@/lib/auth';
import { run } from '@/db/sqlite';
import { randomUUID } from 'node:crypto';

export async function POST(request: Request) {
  try {
    // 1. Validasi Autentikasi Wajib: Tolak akses tanpa token valid (CWE-306 / OWASP A01)
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user: authUser } = authResult;
    const body = await request.json();
    const { username, name, email, userId } = body || {};

    // 2. Proteksi IDOR / Akses Berjenjang:
    // Pengguna biasa hanya boleh memperbarui profilnya sendiri.
    // Hanya Super Administrator yang diizinkan memperbarui user lain dengan parameter userId.
    let targetIdentifier = authUser.id;
    if (userId && userId !== authUser.id) {
      if (authUser.role !== 'ADMIN') {
        return NextResponse.json(
          {
            success: false,
            error: 'Akses ditolak: Anda tidak memiliki izin Administrator untuk memperbarui akun pengguna lain.',
          },
          { status: 403 }
        );
      }
      targetIdentifier = userId;
    }

    const updateResult = updateUserProfile(targetIdentifier, { username, name, email });

    if (!updateResult.success || !updateResult.user) {
      return NextResponse.json(
        { success: false, error: updateResult.error || 'Gagal memperbarui profil pengguna.' },
        { status: updateResult.statusCode || 400 }
      );
    }

    const updatedUser = updateResult.user;

    // Catat audit log pembaruan identitas
    try {
      run(
        'INSERT INTO audit_logs (id, actor_id, action, entity, entity_id, after_val) VALUES (?, ?, ?, ?, ?, ?)',
        [
          `audit_${randomUUID().slice(0, 8)}`,
          authUser.id,
          'PROFILE_UPDATE',
          'auth_users',
          updatedUser.id,
          JSON.stringify({
            timestamp: new Date().toISOString(),
            ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
            actorRole: authUser.role,
            actionDescription: `Data profil/username pengguna ${updatedUser.username} (${updatedUser.name}) berhasil diperbarui oleh ${authUser.username}.`,
          }),
        ]
      );
    } catch (auditErr) {
      console.error('Audit log notice during profile update:', auditErr);
    }

    // Buat token JWT baru jika akun yang diperbarui adalah akun yang sedang aktif
    const newToken = signToken({
      userId: updatedUser.id,
      username: updatedUser.username || updatedUser.id,
      role: updatedUser.role,
      name: updatedUser.name,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Profil dan informasi akun berhasil diperbarui di database.',
      token: newToken,
      user: updatedUser,
    });

    response.cookies.set('sauma_auth_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Error in /api/auth/profile:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal server saat memperbarui data profil.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

