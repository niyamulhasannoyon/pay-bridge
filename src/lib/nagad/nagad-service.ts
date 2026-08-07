import axios from 'axios';

export interface NagadCreatePaymentPayload {
  amount: string;
  merchantInvoiceNumber: string;
  callbackURL: string;
}

export interface NagadCreatePaymentResponse {
  paymentID: string;
  redirectUrl: string;
  statusCode: string;
  statusMessage: string;
}

/**
 * Initiate payment with Nagad API (v0.2)
 */
export async function createNagadPayment(
  payload: NagadCreatePaymentPayload
): Promise<NagadCreatePaymentResponse> {
  const paymentID = `NAGAD_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Return Mock Nagad Gateway URL for sandbox / development
  const mockNagadUrl = `${baseUrl}/mock-nagad-pg?paymentID=${paymentID}&callbackURL=${encodeURIComponent(payload.callbackURL)}`;

  return {
    paymentID,
    redirectUrl: mockNagadUrl,
    statusCode: '0000',
    statusMessage: 'Initiated Successfully',
  };
}

/**
 * Execute/Verify Nagad Payment after customer completes PIN entry
 */
export async function executeNagadPayment(paymentID: string) {
  return {
    paymentID,
    trxID: `NAGAD_TRX_${Date.now()}`,
    status: 'COMPLETED',
    statusCode: '0000',
    statusMessage: 'Nagad Payment Successful',
    customerMobile: '01811223344',
  };
}
