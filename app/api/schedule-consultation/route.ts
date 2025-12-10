import { NextResponse } from "next/server"
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

export async function POST(req: Request) {
  try {
    console.log("[v0] Schedule consultation API called")
    const { name, email, phone, date, time } = await req.json()
    console.log("[v0] Received data:", { name, email, phone, date, time })

    const ticketNumber = generateTicketNumber()
    console.log("[v0] Generated ticket number:", ticketNumber)

    // Validate required fields
    if (!name || !email || !phone || !date || !time) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const fromEmail = "support@americanreliabletech.com"
    const adminEmail = "support@americanreliabletech.freshdesk.com"
    console.log("[v0] Using from email:", fromEmail)

    const eventDate = new Date(date)
    const [hours, minutes] = time.split(":")
    eventDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    const endDate = new Date(eventDate.getTime() + 45 * 60000) // 45 minutes later

    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    const calendarTitle = encodeURIComponent("IT Consultation - American Reliable Tech")
    const calendarDescription = encodeURIComponent(
      "Free IT consultation with American Reliable Tech. We'll discuss your IT needs and how we can help optimize your technology infrastructure.",
    )
    const calendarLocation = encodeURIComponent("Phone/Video Call")
    const startTime = formatDateForCalendar(eventDate)
    const endTime = formatDateForCalendar(endDate)

    // Google Calendar link
    const googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${startTime}/${endTime}&details=${calendarDescription}&location=${calendarLocation}`

    // Email to the customer
    const customerEmail = {
      from: `American Reliable Tech <${fromEmail}>`,
      to: email,
      replyTo: "support@americanreliabletech.com",
      subject: "Your Free IT Consultation is Scheduled!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #4A00FF 0%, #6B21FF 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4A00FF; }
              .ticket-box { background: #4A00FF; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .ticket-number { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              .button { display: inline-block; background: #4A00FF; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
              .button-secondary { background: #10B981; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Consultation Confirmed!</h1>
              </div>
              <div class="content">
                <div class="ticket-box">
                  <p style="margin: 0 0 5px 0; font-size: 14px;">Your Ticket Number</p>
                  <p class="ticket-number" style="margin: 0;">${ticketNumber}</p>
                  <p style="margin: 5px 0 0 0; font-size: 12px;">Please save this for your records</p>
                </div>

                <p>Hi ${name},</p>
                <p>Thank you for scheduling a free IT consultation with American Reliable Tech! We're excited to learn about your business and show you how we can help optimize your technology infrastructure.</p>
                
                <div class="details">
                  <h3 style="margin-top: 0; color: #4A00FF;">Consultation Details</h3>
                  <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
                  <p><strong>Date:</strong> ${date}</p>
                  <p><strong>Time:</strong> ${time}</p>
                  <p><strong>Duration:</strong> 30-45 minutes</p>
                  <p><strong>Format:</strong> Phone/Video Call</p>
                </div>

                <h3>What to Expect:</h3>
                <ul>
                  <li>FREE comprehensive IT assessment ($500 value)</li>
                  <li>Discussion of your current IT challenges and goals</li>
                  <li>Customized recommendations for your business</li>
                  <li>Overview of our managed IT services</li>
                  <li>Transparent pricing with no hidden fees</li>
                </ul>

                <h3>Before Our Call:</h3>
                <p>Please have ready any information about your current IT setup, pain points, or specific questions you'd like to discuss.</p>

                <p><strong>Need to reschedule?</strong> No problem! Just give us a call at <a href="tel:949-933-3821">(949) 933-3821</a> or reply to this email.</p>

                <div style="text-align: center;">
                  <a href="${googleCalendarLink}" class="button button-secondary" style="color: white !important;">📅 Add to Calendar</a>
                  <a href="tel:949-933-3821" class="button" style="color: white !important;">Call Us: (949) 933-3821</a>
                </div>
              </div>
              <div class="footer">
                <p><strong>American Reliable Tech</strong><br>
                Irvine, California<br>
                Phone: (949) 933-3821<br>
                Email: support@americanreliabletech.com</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    // Email to admin (Freshdesk)
    const adminEmailData = {
      from: `American Reliable Tech <${fromEmail}>`,
      to: adminEmail,
      replyTo: email,
      subject: `New Consultation Scheduled - ${name} [${ticketNumber}]`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4A00FF; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .label { font-weight: bold; color: #4A00FF; }
              .ticket { background: #4A00FF; color: white; padding: 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
              .button { display: inline-block; background: #10B981; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Consultation Scheduled</h2>
                <p style="margin: 10px 0 0 0;">Ticket: <span class="ticket">${ticketNumber}</span></p>
              </div>
              <div class="content">
                <p>A new free consultation has been scheduled through the website.</p>
                
                <div class="details">
                  <h3 style="margin-top: 0;">Client Information</h3>
                  <p><span class="label">Ticket Number:</span> ${ticketNumber}</p>
                  <p><span class="label">Name:</span> ${name}</p>
                  <p><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></p>
                  <p><span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a></p>
                </div>

                <div class="details">
                  <h3 style="margin-top: 0;">Scheduled Time</h3>
                  <p><span class="label">Date:</span> ${date}</p>
                  <p><span class="label">Time:</span> ${time}</p>
                </div>

                <div style="text-align: center;">
                  <a href="${googleCalendarLink}" class="button" style="color: white !important;">📅 Add to Calendar</a>
                </div>

                <p><strong>Action Required:</strong> Please add this consultation to the calendar and prepare for the call.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    console.log("[v0] Sending emails...")
    // Send both emails
    const results = await Promise.all([resend.emails.send(customerEmail), resend.emails.send(adminEmailData)])

    console.log("[v0] Email send results:", results)
    console.log("[v0] Emails sent successfully")

    return NextResponse.json({ success: true, ticketNumber })
  } catch (error) {
    console.error("[v0] Error scheduling consultation:", error)
    return NextResponse.json(
      {
        error: "Failed to schedule consultation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
