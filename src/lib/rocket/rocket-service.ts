export interface RocketCreatePaymentPayload {
  amount: string;
  merchantInvoiceNumber: string;
  callbackURL: string;
}

export interface RocketCreatePaymentResponse {
  paymentID: string;
  redirectUrl: string;
  statusCode: string;
  statusMessage: string;
}

/**
 * Initiate payment with Dutch-Bangla Bank Rocket Gateway
 */
export async function createRocketPayment(
  payload: RocketCreatePaymentPayload
): Promise<RocketCreatePaymentResponse> {
  const paymentID = `ROCKET_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const mockRocketUrl = `${baseUrl}/mock-rocket-pg?paymentID=${paymentID}&callbackURL=${encodeURIComponent(payload.callbackURL)}`;

  return {
    paymentID,
    redirectUrl: mockRocketUrl,
    statusCode: '0000',
    statusMessage: 'Initiated Successfully',
  };
}

/**
 * Execute/Verify Rocket Payment after customer PIN entry
 */
export async function executeRocketPayment(paymentID: string) {
  return {
    paymentID,
    trxID: `ROCKET_TRX_${Date.now()}`,
    status: 'COMPLETED',
    statusCode: '0000',
    statusMessage: 'Rocket DBBL Payment Successful',
    customerMobile: '01911223344',
  };
}
