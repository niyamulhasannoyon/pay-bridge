import { NextResponse } from 'next/server';
import { processPendingWebhooks } from '@/lib/webhooks/dispatcher';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Validate Authorization if CRON_SECRET is configured in environment
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
    }

    // Trigger processPendingWebhooks background queue
    await processPendingWebhooks();

    return NextResponse.json({
      success: true,
      message: 'Pending webhook retries processed successfully.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Cron Webhooks Engine Error]:', error);
    return NextResponse.json(
      { error: 'Failed to process background webhooks', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return GET(req);
}
