import { NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const auth = getAuthUserFromRequest(request);

    if (!auth) {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'Sesi tidak valid atau telah kedaluwarsa.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: auth.user,
    });
  } catch (error: any) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { success: false, authenticated: false, error: 'Terjadi kesalahan internal verifikasi sesi.' },
      { status: 500 }
    );
  }
}
