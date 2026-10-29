import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { query, queryOne, run, getDatabase } from '@/db/sqlite';
import { AppUser, UserRole } from '@/types';
import { PRESET_USERS } from '@/mocks/multiSportData';

const AUTH_SECRET = process.env.AUTH_SECRET || 'sauma_arena_secure_jwt_secret_key_2026_mmfc';
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

export interface TokenPayload {
  userId: string;
  username: string;
  role: UserRole;
  name: string;
  exp: number;
}

interface DbAuthUser {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  salt: string;
  role: UserRole;
  name: string;
  role_label: string | null;
  avatar_text: string | null;
  specialization: string | null;
  license_level: string | null;
  assigned_match_ids: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

/**
 * Hash password menggunakan PBKDF2 (SHA-512) dengan 10.000 iterasi.
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const useSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, useSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: useSalt };
}

/**
 * Verifikasi password menggunakan timingSafeEqual untuk mencegah timing attack.
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  if (!password || !storedHash || !salt) return false;
  const { hash } = hashPassword(password, salt);
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Membuat token terverifikasi HMAC-SHA256 (JWT standar).
 */
export function signToken(
  payload: Omit<TokenPayload, 'exp'>,
  expiresInMs: number = TOKEN_EXPIRY_MS
): string {
  const fullPayload: TokenPayload = {
    ...payload,
    exp: Date.now() + expiresInMs,
  };

  const headerB64 = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const dataToSign = `${headerB64}.${payloadB64}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(dataToSign).digest('base64url');

  return `${dataToSign}.${signature}`;
}

/**
 * Memvalidasi dan mendecode token HMAC-SHA256 dengan proteksi ketat alg:none dan timing attack.
 */
export function verifyToken(token: string): TokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signature] = parts;

  try {
    // Validasi ketat header JWT untuk mencegah alg:none atau pergantian algoritma (hunt-auth-bypass)
    const headerStr = Buffer.from(headerB64, 'base64url').toString('utf-8');
    const header = JSON.parse(headerStr);
    if (header.alg !== 'HS256' || header.typ !== 'JWT') {
      return null;
    }

    const dataToSign = `${headerB64}.${payloadB64}`;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(dataToSign).digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expSigBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expSigBuf.length) {
      return null;
    }

    const isSigValid = crypto.timingSafeEqual(sigBuf, expSigBuf);
    if (!isSigValid) return null;

    const payload: TokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (!payload.userId || !payload.exp || Date.now() > payload.exp) {
      return null; // Token kedaluwarsa atau payload cacat
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Inisialisasi dan seed akun default ke database SQLite jika tabel masih kosong.
 */
export function ensureAuthUsersSeeded(): void {
  try {
    getDatabase(); // Pastikan DB dan schema terload

    // Pastikan akun profil selalu sinkron dengan PRESET_USERS agar foreign key constraint audit_logs & matches valid
    for (const preset of PRESET_USERS) {
      const profileRole = preset.role === 'ADMIN' ? 'admin' : 'official';
      run(
        `INSERT OR IGNORE INTO profiles (id, role, display_name, phone, is_active)
         VALUES (?, ?, ?, '081200000000', 1)`,
        [preset.id, profileRole, preset.name]
      );
    }

    // Pastikan hanya akun juri tunggal (USR-JURI-1) yang ada, bersihkan juri lain jika ada
    run("DELETE FROM auth_users WHERE role = 'REFEREE' AND id != 'USR-JURI-1'");

    // Seed atau update preset accounts dengan default password 'pass1234'
    const defaultPassword = 'pass1234';
    const insertStmt = `
      INSERT INTO auth_users (
        id, username, email, password_hash, salt, role, name,
        role_label, avatar_text, specialization, license_level, assigned_match_ids, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        username = excluded.username,
        email = excluded.email,
        name = excluded.name,
        role_label = excluded.role_label,
        assigned_match_ids = excluded.assigned_match_ids,
        is_active = 1
    `;

    for (const preset of PRESET_USERS) {
      const username = preset.username || preset.id.toLowerCase();
      const { hash, salt } = hashPassword(defaultPassword);
      run(insertStmt, [
        preset.id,
        username,
        preset.email,
        hash,
        salt,
        preset.role,
        preset.name,
        preset.roleLabel || (preset.role === 'ADMIN' ? 'Admin Turnamen' : 'Panitia / Juri Lapangan'),
        preset.avatarText || username.slice(0, 2).toUpperCase(),
        preset.specialization || (preset.role === 'REFEREE' ? 'FUTSAL' : null),
        preset.licenseLevel || null,
        JSON.stringify(preset.assignedMatchIds || []),
        1,
      ]);
    }
  } catch (error) {
    console.error('Error seeding auth_users:', error);
  }
}

/**
 * Konversi baris database DBAuthUser ke format AppUser aplikasi yang aman.
 */
function formatDbUserToAppUser(dbUser: DbAuthUser): AppUser {
  let assignedIds: string[] = [];
  try {
    if (dbUser.assigned_match_ids) {
      assignedIds = JSON.parse(dbUser.assigned_match_ids);
    }
  } catch {
    assignedIds = [];
  }

  return {
    id: dbUser.id,
    name: dbUser.name,
    username: dbUser.username,
    email: dbUser.email,
    role: dbUser.role,
    roleLabel: dbUser.role_label || (dbUser.role === 'ADMIN' ? 'Admin Turnamen' : 'Panitia / Juri Lapangan'),
    specialization: (dbUser.specialization as any) || undefined,
    licenseLevel: dbUser.license_level || undefined,
    avatarText: dbUser.avatar_text || dbUser.username.slice(0, 2).toUpperCase(),
    isAvailable: Boolean(dbUser.is_active),
    assignedMatchIds: assignedIds,
  };
}

/**
 * Autentikasi pengguna berdasarkan username/email dan kata sandi.
 */
export function authenticateUser(
  identifier: string,
  passwordAttempt: string
): { success: boolean; user?: AppUser; error?: string; statusCode?: number } {
  ensureAuthUsersSeeded();

  const cleanIdentifier = identifier.trim().toLowerCase();
  let dbUser = queryOne<DbAuthUser>(
    'SELECT * FROM auth_users WHERE LOWER(username) = ? OR LOWER(email) = ?',
    [cleanIdentifier, cleanIdentifier]
  );

  // Kompatibilitas juri tunggal: izinkan login via username 'juri' maupun 'juri1'
  if (!dbUser && (cleanIdentifier === 'juri' || cleanIdentifier === 'juri1')) {
    dbUser = queryOne<DbAuthUser>('SELECT * FROM auth_users WHERE id = ?', ['USR-JURI-1']);
  }

  // Mencegah username enumeration: gunakan pesan kegagalan generik
  if (!dbUser) {
    return {
      success: false,
      error: 'Username/email atau kata sandi tidak valid. Periksa kembali.',
      statusCode: 401,
    };
  }

  if (dbUser.is_active === 0) {
    return {
      success: false,
      error: 'Akun Anda dinonaktifkan oleh administrator. Hubungi panitia turnamen.',
      statusCode: 403,
    };
  }

  const isValidPassword = verifyPassword(passwordAttempt, dbUser.password_hash, dbUser.salt);
  if (!isValidPassword) {
    return {
      success: false,
      error: 'Username/email atau kata sandi tidak valid. Periksa kembali.',
      statusCode: 401,
    };
  }

  const appUser = formatDbUserToAppUser(dbUser);
  return {
    success: true,
    user: appUser,
  };
}

/**
 * Ubah kata sandi pengguna dengan memverifikasi kata sandi lama,
 * menghasilkan hash baru dengan salt acak (PBKDF2), dan memperbarui data di SQLite.
 */
export function changeUserPassword(
  userIdOrUsername: string,
  currentPasswordAttempt: string,
  newPassword: string
): { success: boolean; user?: AppUser; error?: string; statusCode?: number } {
  ensureAuthUsersSeeded();

  if (!currentPasswordAttempt || !newPassword) {
    return {
      success: false,
      error: 'Kata sandi saat ini dan kata sandi baru wajib diisi.',
      statusCode: 400,
    };
  }

  if (newPassword.length < 6) {
    return {
      success: false,
      error: 'Kata sandi baru minimal harus 6 karakter.',
      statusCode: 400,
    };
  }

  const cleanIdentifier = userIdOrUsername.trim().toLowerCase();
  let dbUser = queryOne<DbAuthUser>(
    'SELECT * FROM auth_users WHERE id = ? OR LOWER(username) = ? OR LOWER(email) = ?',
    [userIdOrUsername.trim(), cleanIdentifier, cleanIdentifier]
  );

  if (!dbUser && (cleanIdentifier === 'juri' || cleanIdentifier === 'juri1')) {
    dbUser = queryOne<DbAuthUser>('SELECT * FROM auth_users WHERE id = ?', ['USR-JURI-1']);
  }

  if (!dbUser) {
    return {
      success: false,
      error: 'Pengguna tidak ditemukan dalam sistem.',
      statusCode: 404,
    };
  }

  if (dbUser.is_active === 0) {
    return {
      success: false,
      error: 'Akun Anda dinonaktifkan oleh administrator.',
      statusCode: 403,
    };
  }

  const isCurrentValid = verifyPassword(currentPasswordAttempt, dbUser.password_hash, dbUser.salt);
  if (!isCurrentValid) {
    return {
      success: false,
      error: 'Kata sandi saat ini salah. Pastikan Anda memasukkan kata sandi yang benar.',
      statusCode: 400,
    };
  }

  const isSamePassword = verifyPassword(newPassword, dbUser.password_hash, dbUser.salt);
  if (isSamePassword) {
    return {
      success: false,
      error: 'Kata sandi baru tidak boleh sama dengan kata sandi saat ini.',
      statusCode: 400,
    };
  }

  const { hash: newHash, salt: newSalt } = hashPassword(newPassword);

  run(
    'UPDATE auth_users SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [newHash, newSalt, dbUser.id]
  );

  const updatedDbUser = queryOne<DbAuthUser>('SELECT * FROM auth_users WHERE id = ?', [dbUser.id]) || dbUser;
  return {
    success: true,
    user: formatDbUserToAppUser(updatedDbUser),
  };
}

/**
 * Ambil data AppUser berdasarkan ID pengguna.
 */
export function getUserById(userId: string): AppUser | null {
  ensureAuthUsersSeeded();
  const dbUser = queryOne<DbAuthUser>('SELECT * FROM auth_users WHERE id = ?', [userId]);
  if (!dbUser || dbUser.is_active === 0) return null;
  return formatDbUserToAppUser(dbUser);
}

/**
 * Ekstrak dan verifikasi token dari request (Authorization header atau cookie sauma_auth_token).
 */
export function getAuthUserFromRequest(
  request: Request
): { user: AppUser; tokenPayload: TokenPayload } | null {
  let token: string | null = null;

  // 1. Ekstrak dari Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Jika tidak ada di header, baca dari cookie
  if (!token) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/sauma_auth_token=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = getUserById(payload.userId);
  if (!user || !user.isAvailable) return null;

  return { user, tokenPayload: payload };
}

/**
 * Proteksi rute API: pastikan pengguna terautentikasi dan memiliki peran yang diizinkan.
 * Jika tidak lolos, mengembalikan NextResponse dengan status 401 atau 403.
 */
export function requireAuth(
  request: Request,
  allowedRoles?: UserRole[]
): { user: AppUser; tokenPayload: TokenPayload } | NextResponse {
  const auth = getAuthUserFromRequest(request);

  if (!auth) {
    return NextResponse.json(
      { success: false, error: 'Akses ditolak: Autentikasi diperlukan untuk tindakan ini.' },
      { status: 401 }
    );
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(auth.user.role)) {
    return NextResponse.json(
      {
        success: false,
        error: `Akses ditolak: Peran '${auth.user.role}' tidak memiliki izin untuk tindakan ini.`,
      },
      { status: 403 }
    );
  }

  return auth;
}
