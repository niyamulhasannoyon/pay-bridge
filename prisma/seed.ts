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

  // 1. Create Super Admin User (niyamulhasanbd@gmail.com)
  const superAdminPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'niyamulhasanbd@gmail.com' },
    update: { role: 'SUPER_ADMIN' },
    create: {
      name: 'Niyamul Hasan (Super Admin)',
      email: 'niyamulhasanbd@gmail.com',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
      merchant: {
        create: {
          businessName: 'PayBridge Primary Admin',
          slug: 'paybridge-superadmin',
          webhookSecret: `whsec_${crypto.randomBytes(24).toString('hex')}`,
          status: 'ACTIVE',
        },
      },
    },
    include: { merchant: true },
  });

  // 2. Create Admin User (niyamulhasan1089@gmail.com)
  const adminPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'niyamulhasan1089@gmail.com' },
    update: { role: 'ADMIN' },
    create: {
      name: 'Niyamul Hasan (Admin)',
      email: 'niyamulhasan1089@gmail.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      merchant: {
        create: {
          businessName: 'PayBridge System Admin',
          slug: 'paybridge-admin',
          webhookSecret: `whsec_${crypto.randomBytes(24).toString('hex')}`,
          status: 'ACTIVE',
        },
      },
    },
    include: { merchant: true },
  });

  const merchantId = superAdmin.merchant!.id;

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

  const existingBkash = await prisma.bkashConfig.findFirst({
    where: { isSystemDefault: true, mode: 'SANDBOX' }
  });

  if (!existingBkash) {
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
  }

  // 5. Create Sample Completed Transaction
  await prisma.transaction.upsert({
    where: { transactionId: 'TRX-DEMO-1001' },
    update: {},
    create: {
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
  console.log('Super Admin: niyamulhasanbd@gmail.com');
  console.log('Admin: niyamulhasan1089@gmail.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
