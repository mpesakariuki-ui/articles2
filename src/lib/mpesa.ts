// Removing unused base64 import since we're using Buffer.from

interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  callbackUrl: string;
  environment: 'sandbox' | 'production';
}

class MpesaAPI {
  private config: MpesaConfig;
  private baseUrl: string;
  private accessToken = '';
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      consumerKey: process.env.MPESA_CONSUMER_KEY || '',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
      passkey: process.env.MPESA_PASSKEY || '',
      shortcode: process.env.MPESA_SHORTCODE || '',
      callbackUrl: process.env.MPESA_CALLBACK_URL || '',
      environment: (process.env.MPESA_ENV as 'sandbox' | 'production') || 'sandbox'
    };

    this.baseUrl = this.config.environment === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke';
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
    
    try {
      const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = now + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  private generateTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private generatePassword(timestamp: string): string {
    const str = this.config.shortcode + this.config.passkey + timestamp;
    return Buffer.from(str).toString('base64');
  }

  public async initiateSTKPush(phoneNumber: string, amount: number, accountReference: string, transactionDesc: string) {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          BusinessShortCode: this.config.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber.replace(/^0/, '254'), // Convert from 07... to 254...
          PartyB: this.config.shortcode,
          PhoneNumber: phoneNumber.replace(/^0/, '254'),
          CallBackURL: this.config.callbackUrl,
          AccountReference: accountReference,
          TransactionDesc: transactionDesc
        })
      });

      if (!response.ok) {
        throw new Error('STK push failed');
      }

      const data = await response.json();
      return {
        success: true,
        ...data
      };
    } catch (error) {
      console.error('Error initiating STK push:', error);
      throw error;
    }
  }

  public async queryTransactionStatus(checkoutRequestId: string) {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          BusinessShortCode: this.config.shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId
        })
      });

      if (!response.ok) {
        throw new Error('Transaction status query failed');
      }

      const data = await response.json();
      return {
        success: true,
        ...data
      };
    } catch (error) {
      console.error('Error querying transaction status:', error);
      throw error;
    }
  }
}

export const mpesa = new MpesaAPI();
