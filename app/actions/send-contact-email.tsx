"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Send email to admin
    await resend.emails.send({
      from: "American Reliable Tech <noreply@americanreliabletech.com>",
      to: "admin@americanreliabletech.com",
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4A00FF; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #4A00FF; }
              .value { margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                
                ${
                  company
                    ? `
                <div class="field">
                  <div class="label">Company:</div>
                  <div class="value">${company}</div>
                </div>
                `
                    : ""
                }
                
                ${
                  phone
                    ? `
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value">${phone}</div>
                </div>
                `
                    : ""
                }
                
                <div class="field">
                  <div class="label">Subject:</div>
                  <div class="value">${subject}</div>
                </div>
                
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${message.replace(/\n/g, "<br>")}</div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: "American Reliable Tech <noreply@americanreliabletech.com>",
      to: email,
      subject: "Thank you for contacting American Reliable Tech",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4A00FF; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Thank You for Contacting Us</h2>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                
                <p>Thank you for reaching out to American Reliable Tech. We have received your message and will respond within 24 hours.</p>
                
                <p><strong>Your message:</strong></p>
                <p>${message.replace(/\n/g, "<br>")}</p>
                
                <p>If you need immediate assistance, please call us or visit our support page.</p>
                
                <p>Best regards,<br>American Reliable Tech Team</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      message: "Failed to send message. Please try again or email us directly at admin@americanreliabletech.com",
    }
  }
}
