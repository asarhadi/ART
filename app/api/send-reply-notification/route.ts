import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { ticketNumber, subject, customerEmail, customerName, replyText, authorName } = await request.json()

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .ticket-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .reply-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Reply to Your Support Ticket</h1>
            </div>
            <div class="content">
              <p>Hello ${customerName},</p>
              <p>${authorName} has replied to your support ticket.</p>
              
              <div class="ticket-info">
                <p style="margin: 0;"><strong>Ticket #:</strong> ${ticketNumber}</p>
                <p style="margin: 10px 0 0 0;"><strong>Subject:</strong> ${subject}</p>
              </div>

              <div class="reply-box">
                <h3 style="margin-top: 0; color: #667eea;">Reply from ${authorName}:</h3>
                <p style="white-space: pre-wrap;">${replyText}</p>
              </div>

              <p>You can view the full ticket details and reply by visiting the support portal.</p>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/support/track?ticket=${ticketNumber}&email=${encodeURIComponent(customerEmail)}" class="button">
                View Ticket
              </a>

              <div class="footer">
                <p>This is an automated message from American Reliable Tech Support.</p>
                <p>Please do not reply directly to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    await resend.emails.send({
      from: process.env.SUPPORT_EMAIL || "support@americanreliabletech.com",
      to: customerEmail,
      subject: `Re: [Ticket #${ticketNumber}] ${subject}`,
      html: emailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error sending reply notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
