import axios from 'axios';
import { prisma } from '../db/prisma';
import { generateHmacSignature } from '../security/crypto';

// Retry backoff delays in seconds (1 min, 5 min, 15 min, 1 hr, 24 hr)
const RETRY_BACKOFF_SECONDS = [60, 300, 900, 3600, 86400];

export interface WebhookPayload {
  event: 'payment.completed' | 'payment.failed' | 'payment.cancelled' | 'refund.processed';
  transactionId: string;
  merchantInvoiceNo: string;
  amount: number;
  currency: string;
  status: string;
  bkashTrxID?: string | null;
  customerMobile?: string | null;
  timestamp: string;
  metadata?: unknown;
}

/**
 * Dispatch webhook event to sub-merchant's configured webhook endpoint
 */
export async function dispatchWebhook(
  merchantId: string,
  transactionId: string,
  event: WebhookPayload['event'],
  payloadData: Omit<WebhookPayload, 'event' | 'timestamp'>
) {
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
  });

  if (!merchant || !merchant.webhookUrl) {
    console.log(`[Webhook Dispatcher] No webhook URL configured for merchant ${merchantId}`);
    return null;
  }

  const timestamp = new Date().toISOString();
  const fullPayload: WebhookPayload = {
    ...payloadData,
    event,
    timestamp,
  };

  // Generate HMAC SHA-256 signature using sub-merchant's secret
  const signature = generateHmacSignature(fullPayload, merchant.webhookSecret);

  // Log Webhook attempt in database
  const log = await prisma.webhookLog.create({
    data: {
      merchantId,
      transactionId,
      event,
      endpointUrl: merchant.webhookUrl,
      payload: fullPayload as any,
      signature,
      attemptCount: 1,
      maxAttempts: 5,
      status: 'PENDING',
    },
  });

  // Execute immediate HTTP POST dispatch
  try {
    const res = await axios.post(merchant.webhookUrl, fullPayload, {
      headers: {
        'Content-Type': 'application/json',
        'x-paybridge-signature': signature,
        'x-paybridge-event': event,
        'x-paybridge-timestamp': timestamp,
        'User-Agent': 'PayBridge-Webhook-Dispatcher/1.0',
      },
      timeout: 10000,
    });

    await prisma.webhookLog.update({
      where: { id: log.id },
      data: {
        status: 'DELIVERED',
        httpStatus: res.status,
        responseBody: typeof res.data === 'string' ? res.data.slice(0, 1000) : JSON.stringify(res.data).slice(0, 1000),
      },
    });

    return { success: true, logId: log.id };
  } catch (error: any) {
    const nextRetryDelay = RETRY_BACKOFF_SECONDS[0];
    const nextRetryAt = new Date(Date.now() + nextRetryDelay * 1000);

    const httpStatus = error.response?.status || null;
    const responseBody = error.response?.data 
      ? (typeof error.response.data === 'string' ? error.response.data.slice(0, 1000) : JSON.stringify(error.response.data).slice(0, 1000))
      : error.message;

    await prisma.webhookLog.update({
      where: { id: log.id },
      data: {
        httpStatus,
        responseBody,
        nextRetryAt,
      },
    });

    return { success: false, logId: log.id, nextRetryAt };
  }
}

/**
 * Worker function to retry pending failed webhooks
 */
export async function processPendingWebhooks() {
  const pendingLogs = await prisma.webhookLog.findMany({
    where: {
      status: 'PENDING',
      nextRetryAt: { lte: new Date() },
      attemptCount: { lt: 5 },
    },
    take: 20,
    include: { merchant: true },
  });

  for (const log of pendingLogs) {
    const currentAttempt = log.attemptCount + 1;
    const timestamp = new Date().toISOString();
    const signature = generateHmacSignature(log.payload, log.merchant.webhookSecret);

    try {
      const res = await axios.post(log.endpointUrl, log.payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-paybridge-signature': signature,
          'x-paybridge-event': log.event,
          'x-paybridge-timestamp': timestamp,
          'User-Agent': 'PayBridge-Webhook-Dispatcher/1.0',
        },
        timeout: 10000,
      });

      await prisma.webhookLog.update({
        where: { id: log.id },
        data: {
          status: 'DELIVERED',
          httpStatus: res.status,
          responseBody: typeof res.data === 'string' ? res.data.slice(0, 1000) : JSON.stringify(res.data).slice(0, 1000),
          attemptCount: currentAttempt,
        },
      });
    } catch (error: any) {
      const isMaxedOut = currentAttempt >= log.maxAttempts;
      const nextDelay = RETRY_BACKOFF_SECONDS[Math.min(currentAttempt - 1, RETRY_BACKOFF_SECONDS.length - 1)];
      const nextRetryAt = isMaxedOut ? null : new Date(Date.now() + nextDelay * 1000);

      await prisma.webhookLog.update({
        where: { id: log.id },
        data: {
          status: isMaxedOut ? 'FAILED' : 'PENDING',
          attemptCount: currentAttempt,
          httpStatus: error.response?.status || null,
          responseBody: error.message,
          nextRetryAt,
        },
      });
    }
  }
}
