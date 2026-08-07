import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'paybridge-super-secret-jwt-signing-key-32-chars!'
);

export interface UserSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MERCHANT';
  merchantId?: string;
}

/**
 * Sign JWT token for user session
 */
export async function signJwtToken(payload: UserSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify JWT token
 */
export async function verifyJwtToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as UserSessionPayload;
  } catch {
    return null;
  }
}
