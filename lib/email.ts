import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendShareNotificationParams {
  recipientEmail: string;
  recipientName: string;
  documentTitle: string;
  documentId: string;
  sharedByName: string;
  appUrl: string;
}

export async function sendShareNotification({
  recipientEmail,
  recipientName,
  documentTitle,
  documentId,
  sharedByName,
  appUrl,
}: SendShareNotificationParams) {
  // Skip sending email if no API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Skipping email notification.');
    return { success: false, reason: 'No API key' };
  }

  try {
    const accessUrl = `${appUrl}?user=${encodeURIComponent(recipientEmail)}`;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Document Editor <onboarding@resend.dev>',
      to: recipientEmail,
      subject: `${sharedByName} shared "${documentTitle}" with you`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111;">
                Document Shared With You
              </h1>
              <p style="margin: 0; font-size: 16px; color: #666;">
                <strong>${sharedByName}</strong> has shared a document with you.
              </p>
            </div>

            <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #111;">
                ${documentTitle}
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #666;">
                You can now view and edit this document.
              </p>
              <a href="${accessUrl}" style="display: inline-block; background-color: #111; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 14px;">
                Open Document
              </a>
            </div>

            <div style="font-size: 12px; color: #999; text-align: center;">
              <p style="margin: 0;">
                This document was shared from the Collaborative Document Editor.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
${sharedByName} shared "${documentTitle}" with you

You can now view and edit this document.

Open the document: ${accessUrl}

---
This document was shared from the Collaborative Document Editor.
      `.trim(),
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
