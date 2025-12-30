import { Resend } from 'resend';

// Lazy initialization to avoid build-time crashes
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export const resend = {
  emails: {
    send: async (params: Parameters<Resend['emails']['send']>[0]) => {
      const client = getResendClient();
      return client.emails.send(params);
    }
  }
};
