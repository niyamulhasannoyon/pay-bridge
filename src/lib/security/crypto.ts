import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

function getValidKey(): Buffer {
  const hexKey = ENCRYPTION_KEY.padEnd(64, '0').slice(0, 64);
  return Buffer.from(hexKey, 'hex');
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
}

/**
 * Encrypt sensitive plain text using AES-256-GCM
 */
export function encrypt(text: string): EncryptedData {
  const iv = crypto.randomBytes(16);
  const key = getValidKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag,
  };
}

/**
 * Decrypt AES-256-GCM encrypted string back to plain text
 */
export function decrypt(encrypted: string, ivHex: string, tagHex: string): string {
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const key = getValidKey();
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Hash API Key Secret with SHA-256 for secure database lookup
 */
export function hashApiKey(keySecret: string): string {
  return crypto.createHash('sha256').update(keySecret).digest('hex');
}

/**
 * Generate a new Sub-Merchant API Key pair
 * Format: pb_live_xxxx... or pb_test_xxxx...
 */
export function generateApiKeyPair(mode: 'SANDBOX' | 'LIVE' = 'SANDBOX') {
  const prefix = mode === 'LIVE' ? 'pb_live_' : 'pb_test_';
  const randomBytes = crypto.randomBytes(24).toString('hex'); // 48 chars
  const rawKey = `${prefix}${randomBytes}`;
  const keyPrefix = rawKey.slice(0, 12);
  const keyHash = hashApiKey(rawKey);
  
  return {
    rawKey,     // Show to merchant ONLY ONCE at creation time
    keyPrefix,  // Displayed in dashboard table (e.g. pb_live_3f9b...)
    keyHash,    // Stored in database
  };
}

/**
 * Generate HMAC-SHA256 signature for outgoing webhook payload
 */
export function generateHmacSignature(payload: unknown, secret: string): string {
  const jsonString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(jsonString).digest('hex');
}

/**
 * Verify incoming webhook or request HMAC-SHA256 signature
 */
export function verifyHmacSignature(payload: unknown, secret: string, signature: string): boolean {
  const computed = generateHmacSignature(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
}
