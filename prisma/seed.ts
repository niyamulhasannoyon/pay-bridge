import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

function encryptDummy(text: string) {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return { encrypted, iv: iv.toString('hex'), tag };
}

function hashKey(secret: string) {
  return crypto.createHash('sha256').update(secret).digest('hex');
}

async function main() {
  console.log('Seeding PayBridge Database...');

  // 1. Create Super Admin User
  const adminPassword = await bcrypt.hash('admin12345', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@paybridge.io' },
    update: {},
    create: {
      name: 'PayBridge Administrator',
      email: 'admin@paybridge.io',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });

  // 2. Create Demo Sub-Merchant
  const merchantPassword = await bcrypt.hash('merchant12345', 10);
  const merchantUser = await prisma.user.upsert({
    where: { email: 'merchant@acme.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'merchant@acme.com',
      passwordHash: merchantPassword,
      role: 'MERCHANT',
      merchant: {
        create: {
          businessName: 'Acme E-Commerce Ltd',
          slug: 'acme-ecommerce',
          webhookUrl: 'https://webhook.site/paybridge-demo',
          webhookSecret: `whsec_${crypto.randomBytes(24).toString('hex')}`,
          feePercentage: 0.50,
          fixedFee: 0.00,
          status: 'ACTIVE',
        },
      },
    },
    include: { merchant: true },
  });

  const merchantId = merchantUser.merchant!.id;

  // 3. Create Demo API Keys
  const testKeySecret = 'pb_test_demo_secret_key_1234567890abcdef';
  await prisma.apiKey.upsert({
    where: { keyHash: hashKey(testKeySecret) },
    update: {},
    create: {
      merchantId,
      name: 'Default Test Key',
      keyPrefix: 'pb_test_demo',
      keyHash: hashKey(testKeySecret),
      mode: 'SANDBOX',
    },
  });

  // 4. Create System Default bKash Config
  const encSecret = encryptDummy('sandbox_app_secret');
  const encUser = encryptDummy('sandbox_username');
  const encPass = encryptDummy('sandbox_password');

  await prisma.bkashConfig.create({
    data: {
      mode: 'SANDBOX',
      isSystemDefault: true,
      appKey: 'sandbox_app_key',
      appSecretEncrypted: encSecret.encrypted,
      usernameEncrypted: encUser.encrypted,
      passwordEncrypted: encPass.encrypted,
      iv: encSecret.iv,
      tag: encSecret.tag,
      isActive: true,
    },
  });

  // 5. Create Sample Completed Transaction
  const trx = await prisma.transaction.create({
    data: {
      transactionId: 'TRX-DEMO-1001',
      merchantId,
      merchantInvoiceNo: 'INV-1001',
      bkashPaymentID: 'TRX_BKASH_DEMO_9999',
      bkashTrxID: 'BKASH_TRX_88776655',
      amount: 1500.00,
      currency: 'BDT',
      feeAmount: 7.50,
      netAmount: 1492.50,
      status: 'COMPLETED',
      mode: 'SANDBOX',
      customerMobile: '01711223344',
      callbackUrl: 'http://localhost:3000/dashboard/transactions',
    },
  });

  console.log('Seeding completed successfully!');
  console.log('Admin login: admin@paybridge.io / admin12345');
  console.log('Merchant login: merchant@acme.com / merchant12345');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
