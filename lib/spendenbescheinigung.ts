import { Donation } from './types';

interface SpendenbescheinigungData {
  donation: Donation;
  organization: {
    name: string;
    legalName: string;
    address: string;
    iban: string;
    representative: string;
    taxId?: string;
    registrationNumber?: string;
  };
  receiptNumber: string;
}

/**
 * Generates HTML content for a German Spendenbescheinigung (donation receipt)
 * This follows the official German tax authority format
 */
export function generateSpendenbescheinigungHTML(data: SpendenbescheinigungData): string {
  const { donation, organization, receiptNumber } = data;
  
  const donationDate = new Date(donation.captured_at || donation.created_at);
  const formattedDate = donationDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(donation.amount);

  // Convert amount to words (German)
  const amountInWords = numberToGermanWords(donation.amount);

  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Spendenbescheinigung - ${receiptNumber}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      max-width: 170mm;
      margin: 0 auto;
      padding: 20mm;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #000;
      padding-bottom: 15px;
    }
    
    .header h1 {
      font-size: 16pt;
      font-weight: bold;
      margin: 0 0 5px 0;
      text-transform: uppercase;
    }
    
    .header h2 {
      font-size: 12pt;
      font-weight: normal;
      margin: 0;
    }
    
    .receipt-number {
      text-align: right;
      font-size: 10pt;
      margin-bottom: 20px;
    }
    
    .section {
      margin-bottom: 20px;
    }
    
    .section-title {
      font-weight: bold;
      margin-bottom: 5px;
      text-decoration: underline;
    }
    
    .donor-info {
      background-color: #f5f5f5;
      padding: 15px;
      border: 1px solid #ccc;
      margin-bottom: 20px;
    }
    
    .donation-details {
      border: 2px solid #000;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .donation-details table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .donation-details td {
      padding: 8px 0;
      vertical-align: top;
    }
    
    .donation-details td:first-child {
      width: 40%;
      font-weight: bold;
    }
    
    .amount-box {
      background-color: #fffde7;
      border: 2px solid #f57c00;
      padding: 10px;
      text-align: center;
      margin: 15px 0;
    }
    
    .amount-box .amount {
      font-size: 18pt;
      font-weight: bold;
      color: #e65100;
    }
    
    .amount-box .amount-words {
      font-size: 10pt;
      font-style: italic;
    }
    
    .legal-text {
      font-size: 9pt;
      line-height: 1.4;
      text-align: justify;
      margin-top: 30px;
      padding: 15px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
    }
    
    .signature-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
    }
    
    .signature-block {
      width: 45%;
      text-align: center;
    }
    
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 50px;
      padding-top: 5px;
      font-size: 10pt;
    }
    
    .footer {
      margin-top: 40px;
      font-size: 9pt;
      text-align: center;
      border-top: 1px solid #ccc;
      padding-top: 15px;
    }
    
    .organization-info {
      margin-bottom: 20px;
    }
    
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Zuwendungsbestätigung</h1>
    <h2>zur Vorlage beim Finanzamt</h2>
    <p style="font-size: 10pt; margin-top: 10px;">
      (Bestätigung über Geldzuwendungen im Sinne des § 10b des Einkommensteuergesetzes)
    </p>
  </div>

  <div class="receipt-number">
    <strong>Bescheinigungsnummer:</strong> ${receiptNumber}<br>
    <strong>Ausstellungsdatum:</strong> ${today}
  </div>

  <div class="organization-info section">
    <div class="section-title">Aussteller (Zuwendungsempfänger):</div>
    <p>
      <strong>${organization.legalName}</strong><br>
      ${organization.address}<br>
      ${organization.registrationNumber ? `Registernummer: ${organization.registrationNumber}<br>` : ''}
      ${organization.taxId ? `Steuernummer: ${organization.taxId}` : ''}
    </p>
  </div>

  <div class="donor-info section">
    <div class="section-title">Zuwendender (Spender):</div>
    <p>
      <strong>${donation.donor_name}</strong><br>
      ${donation.donor_street || ''}<br>
      ${donation.donor_postal_code || ''} ${donation.donor_city || ''}<br>
      ${donation.donor_country || 'Deutschland'}
    </p>
  </div>

  <div class="donation-details">
    <table>
      <tr>
        <td>Art der Zuwendung:</td>
        <td>Geldzuwendung</td>
      </tr>
      <tr>
        <td>Datum der Zuwendung:</td>
        <td>${formattedDate}</td>
      </tr>
      <tr>
        <td>Verwendungszweck:</td>
        <td>Förderung religiöser Zwecke - ${donation.tier_name}</td>
      </tr>
    </table>
    
    <div class="amount-box">
      <div class="amount">${formattedAmount}</div>
      <div class="amount-words">(in Worten: ${amountInWords})</div>
    </div>
  </div>

  <div class="section">
    <p>
      Es wird bestätigt, dass die Zuwendung nur zur Förderung religiöser Zwecke 
      (§ 52 Abs. 2 Satz 1 Nr. 2 AO) verwendet wird.
    </p>
  </div>

  <div class="legal-text">
    <p><strong>Hinweise:</strong></p>
    <p>
      Es wird bestätigt, dass es sich nicht um Mitgliedsbeiträge, sonstige Mitgliedsumlagen 
      oder Aufnahmegebühren handelt und die Zuwendung nicht mit einer Gegenleistung 
      verbunden ist.
    </p>
    <p>
      Die Körperschaft ist nach § 5 Abs. 1 Nr. 9 KStG von der Körperschaftsteuer befreit, 
      weil sie ausschließlich und unmittelbar steuerbegünstigten gemeinnützigen Zwecken 
      im Sinne der §§ 51 ff. AO dient.
    </p>
    <p>
      Diese Zuwendungsbestätigung ist nur gültig in Verbindung mit einem Nachweis der 
      Gemeinnützigkeit (Freistellungsbescheid des Finanzamts).
    </p>
  </div>

  <div class="signature-section">
    <div class="signature-block">
      <div class="signature-line">
        Ort, Datum
      </div>
    </div>
    <div class="signature-block">
      <div class="signature-line">
        ${organization.representative}<br>
        (Unterschrift des Vertretungsberechtigten)
      </div>
    </div>
  </div>

  <div class="footer">
    <p>
      ${organization.legalName}<br>
      ${organization.address}<br>
      IBAN: ${organization.iban}
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Convert a number to German words (simplified version)
 */
function numberToGermanWords(amount: number): string {
  const units = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
  const teens = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
  const tens = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
  
  const euros = Math.floor(amount);
  const cents = Math.round((amount - euros) * 100);
  
  function convertHundreds(n: number): string {
    if (n === 0) return '';
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const unit = n % 10;
      const ten = Math.floor(n / 10);
      if (unit === 0) return tens[ten];
      return units[unit] + 'und' + tens[ten];
    }
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    return units[hundred] + 'hundert' + convertHundreds(rest);
  }
  
  function convertThousands(n: number): string {
    if (n < 1000) return convertHundreds(n);
    const thousands = Math.floor(n / 1000);
    const rest = n % 1000;
    const thousandStr = thousands === 1 ? 'eintausend' : convertHundreds(thousands) + 'tausend';
    return thousandStr + convertHundreds(rest);
  }
  
  let result = '';
  
  if (euros === 0) {
    result = 'null Euro';
  } else if (euros === 1) {
    result = 'ein Euro';
  } else {
    result = convertThousands(euros) + ' Euro';
  }
  
  if (cents > 0) {
    result += ' und ' + (cents === 1 ? 'ein Cent' : convertHundreds(cents) + ' Cent');
  }
  
  return result;
}

/**
 * Generate a unique receipt number
 */
export function generateReceiptNumber(donationId: string): string {
  const year = new Date().getFullYear();
  const shortId = donationId.substring(0, 8).toUpperCase();
  return `SPB-${year}-${shortId}`;
}
