import { Donation } from './types';

interface DonationEmailData {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  tierName: string;
  transactionId: string;
  donatedAt: string;
  gotram?: string;
  message?: string;
}

export function generateDonationConfirmationEmail(data: DonationEmailData): string {
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: data.currency
  }).format(data.amount);

  const formattedDate = new Date(data.donatedAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🙏 Namaste ${data.donorName}</h1>
    <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Thank you for your generous donation</p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #FF6B35; margin-top: 0;">Donation Confirmation</h2>
    
    <p>Dear ${data.donorName},</p>
    
    <p>We are deeply grateful for your generous contribution to Sri Venkateshwara Temple Stuttgart. Your support helps us bring this sacred dream to life and serves the spiritual needs of our community.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #333; margin-top: 0; font-size: 18px; border-bottom: 2px solid #FF6B35; padding-bottom: 10px;">Donation Details</h3>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 40%;">Amount:</td>
          <td style="padding: 8px 0;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Tier:</td>
          <td style="padding: 8px 0;">${data.tierName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Transaction ID:</td>
          <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${data.transactionId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Date:</td>
          <td style="padding: 8px 0;">${formattedDate}</td>
        </tr>
        ${data.gotram ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Gotram:</td>
          <td style="padding: 8px 0;">${data.gotram}</td>
        </tr>
        ` : ''}
      </table>
      
      ${data.message ? `
      <div style="margin-top: 15px;">
        <p style="font-weight: bold; margin-bottom: 5px;">Your Message:</p>
        <p style="font-style: italic; color: #555; margin: 0;">"${data.message}"</p>
      </div>
      ` : ''}
    </div>
    
    <div style="background: #fff3e0; border-left: 4px solid #FF6B35; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px;">
        <strong>Tax Receipt:</strong> This donation may be eligible for tax deduction in Germany. 
        If you have questions about your donation receipt, please contact us at 
        <a href="mailto:svtstuttgart@gmail.com" style="color: #FF6B35;">svtstuttgart@gmail.com</a>
      </p>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 25px;">
      Your contribution will be used for the construction and establishment of Sri Venkateshwara Temple in Stuttgart, 
      creating a spiritual sanctuary for the Hindu community in the region.
    </p>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="color: #FF6B35; font-size: 18px; font-weight: bold; margin: 0;">Om Namo Venkatesaya</p>
      <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">May Lord Venkateshwara bless you and your family</p>
    </div>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; text-align: center; margin-top: 20px; border-radius: 8px; font-size: 12px; color: #666;">
    <p style="margin: 0 0 10px 0;"><strong>Sri Venkateshwara Temple Stuttgart</strong></p>
    <p style="margin: 5px 0;">Sri Venkateshwara Temple Stuttgart gUG (haftungsbeschränkt) i.G.</p>
    <p style="margin: 5px 0;">Wankelstrasse 4/A, 71272 Renningen, Germany</p>
    <p style="margin: 5px 0;">
      <a href="mailto:svtstuttgart@gmail.com" style="color: #FF6B35; text-decoration: none;">svtstuttgart@gmail.com</a> | 
      <a href="tel:+4915255749792" style="color: #FF6B35; text-decoration: none;">+49 152 55749792</a>
    </p>
    <p style="margin: 15px 0 5px 0; color: #999;">
      If you have any questions about this donation, please reply to this email or contact us directly.
    </p>
  </div>
</body>
</html>
  `.trim();
}
