import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Sesi berhasil diakhiri.',
  });

  // Hapus cookie sesi
  response.cookies.set('sauma_auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
