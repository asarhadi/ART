import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function generateTicketNumber(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const year = String(now.getFullYear()).slice(-2)
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")
  return `ART-${month}${day}${year}${hours}${minutes}${seconds}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, planName, billingMode, quantity, basePrice, totalPrice, timestamp } = body

    console.log("[v0] Service request received:", { name, email, phone, planName, billingMode, quantity })

    const ticketNumber = generateTicketNumber()
    console.log("[v0] Generated ticket number:", ticketNumber)

    const fromEmail = "support@americanreliabletech.com"
    const adminEmail = "support@americanreliabletech.freshdesk.com"

    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4A00FF 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4A00FF; }
            .ticket-box { background: #4A00FF; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .ticket-number { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; }
            .detail-value { color: #333; }
            .button { display: inline-block; background: #4A00FF; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Service Request Received!</h1>
              <p style="margin: 10px 0 0 0;">Thank you for choosing American Reliable Tech</p>
            </div>
            <div class="content">
              <div class="ticket-box">
                <p style="margin: 0 0 5px 0; font-size: 14px;">Your Ticket Number</p>
                <p class="ticket-number" style="margin: 0;">${ticketNumber}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px;">Please save this for your records</p>
              </div>

              <p>Dear ${name},</p>
              <p>Thank you for your interest in our <strong>${planName}</strong> plan! We've received your service request and our sales team will reach out shortly with a comprehensive solution tailored to your needs.</p>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #4A00FF;">Your Request Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Ticket Number:</span>
                  <span class="detail-value"><strong>${ticketNumber}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Plan:</span>
                  <span class="detail-value">${planName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Billing:</span>
                  <span class="detail-value">${billingMode === "annual" ? "Annual (20% savings)" : "Monthly"}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Users/Devices:</span>
                  <span class="detail-value">${quantity}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Price per User:</span>
                  <span class="detail-value">$${basePrice}/month</span>
                </div>
                <div class="detail-row" style="border-bottom: none; font-size: 18px;">
                  <span class="detail-label">Total Monthly:</span>
                  <span class="detail-value" style="color: #4A00FF; font-weight: bold;">$${totalPrice}</span>
                </div>
              </div>

              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our sales team will contact you within 24 hours</li>
                <li>We'll discuss your specific IT needs and requirements</li>
                <li>You'll receive a customized proposal with detailed pricing</li>
                <li>Schedule your FREE IT Assessment ($500 value)</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="tel:949-933-3821" class="button" style="color: white !important;">Call Us: (949) 933-3821</a>
              </div>

              <div class="footer">
                <p>American Reliable Tech<br>
                Email: support@americanreliabletech.com<br>
                Phone: (949) 933-3821</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4A00FF; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .ticket { background: #4A00FF; color: white; padding: 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">New Service Request</h2>
              <p style="margin: 10px 0 0 0;">Ticket: <span class="ticket">${ticketNumber}</span></p>
            </div>
            <div class="content">
              <div class="details">
                <h3 style="margin-top: 0;">Customer Information</h3>
                <div class="detail-row"><span class="label">Ticket Number:</span> ${ticketNumber}</div>
                <div class="detail-row"><span class="label">Name:</span> ${name}</div>
                <div class="detail-row"><span class="label">Email:</span> ${email}</div>
                <div class="detail-row"><span class="label">Phone:</span> ${phone}</div>
              </div>
              
              <div class="details">
                <h3 style="margin-top: 0;">Service Details</h3>
                <div class="detail-row"><span class="label">Plan:</span> ${planName}</div>
                <div class="detail-row"><span class="label">Billing Mode:</span> ${billingMode === "annual" ? "Annual (20% discount)" : "Monthly"}</div>
                <div class="detail-row"><span class="label">Quantity:</span> ${quantity} users/devices</div>
                <div class="detail-row"><span class="label">Price per User:</span> $${basePrice}/month</div>
                <div class="detail-row" style="border-bottom: none;"><span class="label">Total Monthly:</span> <strong>$${totalPrice}</strong></div>
              </div>

              <div class="details">
                <div class="detail-row" style="border-bottom: none;"><span class="label">Timestamp:</span> ${new Date(timestamp).toLocaleString()}</div>
              </div>

              <p style="margin-top: 20px;"><strong>Action Required:</strong> Contact this customer within 24 hours to discuss their requirements and provide a customized proposal.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const [customerEmail, adminEmailResult] = await Promise.all([
      resend.emails.send({
        from: `American Reliable Tech <${fromEmail}>`,
        to: email,
        replyTo: "support@americanreliabletech.com",
        subject: `Service Request Confirmation - ${planName} Plan`,
        html: customerEmailHtml,
      }),
      resend.emails.send({
        from: `American Reliable Tech <${fromEmail}>`,
        to: adminEmail,
        replyTo: email,
        subject: `New Service Request: ${planName} - ${name}`,
        html: adminEmailHtml,
      }),
    ])

    console.log("[v0] Emails sent successfully:", { customerEmail, adminEmailResult })

    return NextResponse.json({
      success: true,
      message: "Service request submitted successfully",
      ticketNumber,
    })
  } catch (error) {
    console.error("[v0] Error processing service request:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process service request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
