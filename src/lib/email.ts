import { Registration } from './types';
import { EVENT_INFO } from './constants';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Using Resend API - you can swap this for any email provider
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'COALESCE <noreply@coalesce.event>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments?.map(att => ({
          filename: att.filename,
          content: att.content.toString('base64'),
        })),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export function generateConfirmationEmail(registration: Registration): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1b263b 0%, #0d1b2a 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center; border: 1px solid rgba(212, 175, 55, 0.3); border-bottom: none;">
      <h1 style="margin: 0; font-size: 36px; font-weight: bold; color: #d4af37; letter-spacing: 4px;">
        ${EVENT_INFO.name}
      </h1>
      <p style="margin: 10px 0 0; color: #f4e4a6; font-size: 14px; letter-spacing: 2px;">
        ${EVENT_INFO.tagline}
      </p>
    </div>
    
    <!-- Content -->
    <div style="background: #1b263b; padding: 40px 30px; border: 1px solid rgba(212, 175, 55, 0.3); border-top: none; border-bottom: none;">
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="display: inline-block; background: linear-gradient(135deg, #b8960c 0%, #d4af37 100%); color: #0d1b2a; padding: 8px 24px; border-radius: 20px; font-weight: 600; font-size: 14px;">
          ✓ REGISTRATION CONFIRMED
        </span>
      </div>
      
      <p style="color: #fafafa; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        Dear <strong style="color: #d4af37;">${registration.name}</strong>,
      </p>
      
      <p style="color: #ccc; font-size: 15px; line-height: 1.6; margin: 0 0 30px;">
        Congratulations! Your registration for ${EVENT_INFO.name} has been verified. Your entry pass is attached to this email.
      </p>
      
      <!-- Details Card -->
      <div style="background: rgba(10, 10, 10, 0.5); border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid rgba(212, 175, 55, 0.2);">
        <h3 style="margin: 0 0 20px; color: #d4af37; font-size: 14px; letter-spacing: 1px;">
          EVENT DETAILS
        </h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 13px;">Registration ID</td>
            <td style="padding: 8px 0; color: #d4af37; font-size: 13px; text-align: right; font-weight: 600;">
              ${registration.id.substring(0, 8).toUpperCase()}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 13px;">Date</td>
            <td style="padding: 8px 0; color: #fafafa; font-size: 13px; text-align: right;">
              ${EVENT_INFO.date}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 13px;">Time</td>
            <td style="padding: 8px 0; color: #fafafa; font-size: 13px; text-align: right;">
              ${EVENT_INFO.time}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 13px;">Venue</td>
            <td style="padding: 8px 0; color: #fafafa; font-size: 13px; text-align: right;">
              ${EVENT_INFO.venue}
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Instructions -->
      <div style="background: rgba(212, 175, 55, 0.1); border-radius: 8px; padding: 20px; border-left: 3px solid #d4af37;">
        <h4 style="margin: 0 0 10px; color: #d4af37; font-size: 14px;">
          Important Instructions
        </h4>
        <ul style="margin: 0; padding-left: 20px; color: #ccc; font-size: 13px; line-height: 1.8;">
          <li>Please carry a printed or digital copy of your entry pass</li>
          <li>Bring a valid photo ID for verification</li>
          <li>Gates open at 9:30 AM</li>
          <li>This pass is non-transferable</li>
        </ul>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: #0d1b2a; border-radius: 0 0 16px 16px; padding: 30px; text-align: center; border: 1px solid rgba(212, 175, 55, 0.3); border-top: none;">
      <p style="margin: 0 0 10px; color: #888; font-size: 12px;">
        ${EVENT_INFO.location}
      </p>
      <p style="margin: 0; color: #666; font-size: 11px;">
        © 2026 ${EVENT_INFO.name}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generatePendingEmail(registration: Registration): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #1b263b 0%, #0d1b2a 100%); border-radius: 16px; padding: 40px 30px; border: 1px solid rgba(212, 175, 55, 0.3);">
      <h1 style="margin: 0 0 10px; font-size: 32px; color: #d4af37; text-align: center; letter-spacing: 4px;">
        ${EVENT_INFO.name}
      </h1>
      <p style="margin: 0 0 30px; color: #f4e4a6; font-size: 13px; text-align: center; letter-spacing: 2px;">
        ${EVENT_INFO.tagline}
      </p>
      
      <div style="text-align: center; margin-bottom: 25px;">
        <span style="display: inline-block; background: rgba(212, 175, 55, 0.2); color: #d4af37; padding: 8px 24px; border-radius: 20px; font-size: 14px; border: 1px solid rgba(212, 175, 55, 0.3);">
          ⏳ PAYMENT VERIFICATION PENDING
        </span>
      </div>
      
      <p style="color: #fafafa; font-size: 16px; margin: 0 0 15px;">
        Dear <strong style="color: #d4af37;">${registration.name}</strong>,
      </p>
      
      <p style="color: #ccc; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
        Thank you for registering for ${EVENT_INFO.name}! We have received your registration and payment details.
      </p>
      
      <div style="background: rgba(10, 10, 10, 0.5); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; color: #888; font-size: 12px;">Registration ID</p>
        <p style="margin: 0; color: #d4af37; font-size: 16px; font-weight: 600;">
          ${registration.id.substring(0, 8).toUpperCase()}
        </p>
      </div>
      
      <p style="color: #ccc; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
        Our team is verifying your payment. This usually takes 2-4 hours during working hours. You will receive your entry pass via email once verified.
      </p>
      
      <p style="color: #888; font-size: 12px; margin: 0; text-align: center;">
        Questions? Contact us at support@coalesce.event
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
