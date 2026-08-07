import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/db/prisma';
import { signJwtToken } from '@/lib/auth/jwt';
import { generateApiKeyPair } from '@/lib/security/crypto';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/v1/auth/google/callback`;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=Google authentication failed`);
  }

  try {
    // 1. Exchange code for Google Access Token
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenRes.data;

    // 2. Fetch User Profile from Google API
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name } = userRes.data;

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/login?error=Email not provided by Google`);
    }

    // 3. Check if user already exists or create new user + merchant profile
    let user = await prisma.user.findUnique({
      where: { email },
      include: { merchant: true },
    });

    if (!user) {
      const dummyPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
      const businessName = `${name}'s Business`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);
      const webhookSecret = `whsec_${crypto.randomBytes(24).toString('hex')}`;

      user = await prisma.user.create({
        data: {
          name: name || 'Google User',
          email,
          passwordHash: dummyPassword,
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

      // Auto-generate Sandbox API Key
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
    }

    // 4. Sign JWT session token
    const token = await signJwtToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      merchantId: user.merchant?.id,
    });

    const response = NextResponse.redirect(`${baseUrl}/dashboard`);
    response.cookies.set('paybridge_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Google OAuth Error:', error.response?.data || error.message);
    return NextResponse.redirect(`${baseUrl}/login?error=Google authentication exception`);
  }
}
