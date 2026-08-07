import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/db/prisma';
import { signJwtToken } from '@/lib/auth/jwt';
import { generateApiKeyPair } from '@/lib/security/crypto';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, businessName } = await req.json();

    if (!name || !email || !password || !businessName) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User with this email already exists.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    const webhookSecret = `whsec_${crypto.randomBytes(24).toString('hex')}`;

    // Create user and merchant profile in a single transaction
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'MERCHANT',
        merchant: {
          create: {
            businessName,
            slug,
            webhookSecret,
            status: 'ACTIVE',
          },
        },
      },
      include: { merchant: true },
    });

    // Auto-generate initial Sandbox API Key for sub-merchant
    const sandboxKey = generateApiKeyPair('SANDBOX');
    await prisma.apiKey.create({
      data: {
        merchantId: user.merchant!.id,
        name: 'Default Sandbox Key',
        keyPrefix: sandboxKey.keyPrefix,
        keyHash: sandboxKey.keyHash,
        mode: 'SANDBOX',
      },
    });

    const token = await signJwtToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      merchantId: user.merchant!.id,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      merchant: user.merchant,
      initialApiKey: sandboxKey.rawKey,
    });

    response.cookies.set('paybridge_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Registration failed.' }, { status: 500 });
  }
}
