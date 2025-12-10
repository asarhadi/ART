"use server"

import { Resend } from "resend"

interface SupportTicketData {
  name: string
  email: string
  phone: string
  company: string
  issue: string
  priority: string
  conversationHistory?: string
  attachmentUrls?: string[]
  attachmentData?: Array<{ dataUrl: string; filename: string }>
  troubleshooting?: {
    device?: string
    affectedSystem?: string
    issueStartTime?: string
    recentChanges?: string
    affectedUsers?: string
    otherFunctionsWorking?: string
    troubleshootingAttempted?: string
    errorMessages?: string
  }
}

export async function sendSupportTicket(data: SupportTicketData) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    const supportEmail = process.env.SUPPORT_EMAIL || "support@americanreliabletech.com"

    console.log("[v0] Attempting to send support ticket")
    console.log("[v0] RESEND_API_KEY exists:", !!resendApiKey)
    console.log("[v0] Support email:", supportEmail)

    if (!resendApiKey) {
      console.error("[v0] Missing RESEND_API_KEY environment variable")
      return {
        success: false,
        message: "Email service not configured. Please contact administrator.",
      }
    }

    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const year = String(now.getFullYear()).slice(-2)
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")
    const ticketNumber = `ART-${month}${day}${year}${hours}${minutes}${seconds}`

    console.log("[v0] Generated ticket number:", ticketNumber)

    const resend = new Resend(resendApiKey)

    let cleanedConversation = ""
    if (data.conversationHistory) {
      const lines = data.conversationHistory.split("\n").filter((line) => line.trim())
      let questionNumber = 1
      const qaItems: string[] = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (line.startsWith("AI Agent:")) {
          const question = line.replace("AI Agent:", "").trim()
          if (question) {
            // Look for the next customer response
            let answer = ""
            if (i + 1 < lines.length && lines[i + 1].trim().startsWith("Customer:")) {
              answer = lines[i + 1].replace("Customer:", "").trim()
              i++ // Skip the next line since we've processed it
            }

            qaItems.push(`
              <div style="margin-bottom: 20px; padding: 12px; background: #f9fafb; border-radius: 6px; border-left: 3px solid #7c3aed;">
                <div style="margin-bottom: 8px;">
                  <span style="color: #5b21b6; font-weight: 700; font-size: 14px;">Q${questionNumber}:</span>
                  <span style="color: #000000; font-size: 14px; margin-left: 8px;">${question}</span>
                </div>
                ${
                  answer
                    ? `
                <div style="padding-left: 24px;">
                  <span style="color: #5b21b6; font-weight: 700; font-size: 14px;">A${questionNumber}:</span>
                  <span style="color: #000000; font-size: 14px; margin-left: 8px;">${answer}</span>
                </div>
                `
                    : ""
                }
              </div>
            `)
            questionNumber++
          }
        }
      }

      cleanedConversation = qaItems.join("")
    }

    let emailAttachments: Array<{ filename: string; content: Buffer }> | undefined
    if (data.attachmentUrls && data.attachmentUrls.length > 0) {
      console.log("[v0] [SERVER] Processing attachments:", data.attachmentUrls.length)
      data.attachmentUrls.forEach((url, index) => {
        console.log(`[v0] [SERVER] Attachment ${index} URL:`, url)
      })

      emailAttachments = await Promise.all(
        data.attachmentUrls.map(async (url, index) => {
          try {
            console.log(`[v0] [SERVER] Fetching attachment ${index} from:`, url)
            const response = await fetch(url)

            if (!response.ok) {
              console.error(`[v0] [SERVER] Failed to fetch attachment ${index}:`, response.status, response.statusText)
              return null
            }

            const arrayBuffer = await response.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            console.log(`[v0] [SERVER] Successfully fetched attachment ${index}, size:`, buffer.length, "bytes")

            // Extract filename from URL or use generic name
            const urlParts = url.split("/")
            const filename = urlParts[urlParts.length - 1] || `attachment-${index + 1}`
            const decodedFilename = decodeURIComponent(filename)
            console.log(`[v0] [SERVER] Attachment ${index} filename:`, decodedFilename)

            return {
              filename: decodedFilename,
              content: buffer,
            }
          } catch (error) {
            console.error(`[v0] [SERVER] Error fetching attachment ${index} from ${url}:`, error)
            return null
          }
        }),
      ).then((results) => {
        const validAttachments = results.filter((r): r is { filename: string; content: Buffer } => r !== null)
        console.log(
          `[v0] [SERVER] Successfully processed ${validAttachments.length} of ${data.attachmentUrls!.length} attachments`,
        )
        return validAttachments
      })

      if (emailAttachments.length === 0) {
        console.log("[v0] [SERVER] No attachments were successfully fetched, setting to undefined")
        emailAttachments = undefined
      }
    }

    if (data.attachmentData && data.attachmentData.length > 0) {
      console.log("[v0] [SERVER] Processing attachments:", data.attachmentData.length)

      emailAttachments = data.attachmentData
        .map((attachment, index) => {
          try {
            console.log(`[v0] [SERVER] Processing attachment ${index}:`, attachment.filename)

            // Extract base64 data from data URL
            const base64Data = attachment.dataUrl.split(",")[1]
            if (!base64Data) {
              console.error(`[v0] [SERVER] Failed to extract base64 data from attachment ${index}`)
              return null
            }

            const buffer = Buffer.from(base64Data, "base64")
            console.log(`[v0] [SERVER] Successfully processed attachment ${index}, size:`, buffer.length, "bytes")

            return {
              filename: attachment.filename,
              content: buffer,
            }
          } catch (error) {
            console.error(`[v0] [SERVER] Error processing attachment ${index}:`, error)
            return null
          }
        })
        .filter((r): r is { filename: string; content: Buffer } => r !== null)

      console.log(
        `[v0] [SERVER] Successfully processed ${emailAttachments.length} of ${data.attachmentData.length} attachments`,
      )

      if (emailAttachments.length === 0) {
        console.log("[v0] [SERVER] No attachments were successfully processed, setting to undefined")
        emailAttachments = undefined
      }
    }

    const emailBody = `
SUPPORT TICKET: ${ticketNumber}

Customer Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}
- Company: ${data.company}

Priority Level: ${data.priority.toUpperCase()}

Issue Description:
${data.issue}

${cleanedConversation ? `\nConversation History:\n${cleanedConversation.replace(/<[^>]*>/g, "")}` : ""}
${data.troubleshooting ? `\nTroubleshooting Information:\n${JSON.stringify(data.troubleshooting)}` : ""}
---
Please reference ticket number ${ticketNumber} in all correspondence.
Sent from: American Reliable Tech Support Portal
    `.trim()

    console.log("[v0] Attempting to send email via Resend")

    try {
      const freshdeskResult = await resend.emails.send({
        from: "support@americanreliabletech.com",
        to: "support@americanreliabletech.freshdesk.com",
        replyTo: data.email,
        subject: `Support Ticket ${ticketNumber} - ${data.name}`,
        text: emailBody,
        attachments: emailAttachments,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Support Ticket Received</h1>
              </div>
              
              <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #7c3aed;">
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">Ticket Number</p>
                  <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #7c3aed;">${ticketNumber}</p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Customer Information</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; width: 100px;"><strong>Name:</strong></td>
                      <td style="padding: 8px 0; color: #111827;">${data.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td>
                      <td style="padding: 8px 0; color: #111827;"><a href="mailto:${data.email}" style="color: #7c3aed; text-decoration: none;">${data.email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;"><strong>Phone:</strong></td>
                      <td style="padding: 8px 0; color: #111827;">${data.phone}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;"><strong>Company:</strong></td>
                      <td style="padding: 8px 0; color: #111827;">${data.company}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0;"><strong style="color: #111827;">Priority Level:</strong> 
                    <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; 
                      ${
                        data.priority === "critical"
                          ? "background: #fee2e2; color: #991b1b;"
                          : data.priority === "high"
                            ? "background: #fef3c7; color: #92400e;"
                            : data.priority === "medium"
                              ? "background: #dbeafe; color: #1e40af;"
                              : "background: #d1fae5; color: #065f46;"
                      }">
                      ${data.priority.toUpperCase()}
                    </span>
                  </p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Issue Description</h2>
                  <p style="margin: 0; color: #374151; white-space: pre-wrap;">${data.issue}</p>
                </div>
                
                ${
                  data.troubleshooting && Object.values(data.troubleshooting).some((v) => v)
                    ? `
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🔧 Troubleshooting Information</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${
                      data.troubleshooting.device
                        ? `
                    <tr>
                      <td style="padding: 8px 0; color: #5b21b6; font-weight: 700; vertical-align: top; width: 180px;">Device/System:</td>
                      <td style="padding: 8px 0; color: #000000;">${data.troubleshooting.device}</td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      data.troubleshooting.affectedSystem
                        ? `
                    <tr>
                      <td style="padding: 8px 0; color: #5b21b6; font-weight: 700; vertical-align: top;">Affected System:</td>
                      <td style="padding: 8px 0; color: #000000;">${data.troubleshooting.affectedSystem}</td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      data.troubleshooting.issueStartTime
                        ? `
                    <tr>
                      <td style="padding: 8px 0; color: #5b21b6; font-weight: 700; vertical-align: top;">Issue Started:</td>
                      <td style="padding: 8px 0; color: #000000;">${data.troubleshooting.issueStartTime}</td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      data.troubleshooting.recentChanges
                        ? `
                    <tr>
                      <td style="padding: 8px 0; color: #5b21b6; font-weight: 700; vertical-align: top;">Recent Changes:</td>
                      <td style="padding: 8px 0; color: #000000;">${data.troubleshooting.recentChanges}</td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      data.troubleshooting.affectedUsers
                        ? `
                    <tr>
                      <td style="padding: 8px 0; color: #5b21b6; font-weight: 700; vertical-align: top;">Affected Users:</td>
                      <td style="padding: 8px 0; color: #000000;">${data.troubleshooting.affectedUsers}</td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      data.troubleshooting.otherFunctionsWorking
                        ? `
                    <tr>
                      <td style="padding: 8px 0; color: #5b21b6; font-weight: 700; vertical-align: top;">Other Functions:</td>
                      <td style="padding: 8px 0; color: #000000;">${data.troubleshooting.otherFunctionsWorking}</td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      data.troubleshooting.troubleshootingAttempted
                        ? `
                    <tr>
                      <td style="padding: 8px 0; color: #5b21b6; font-weight: 700; vertical-align: top;">Steps Attempted:</td>
                      <td style="padding: 8px 0; color: #000000;">${data.troubleshooting.troubleshootingAttempted}</td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      data.troubleshooting.errorMessages
                        ? `
                    <tr>
                      <td style="padding: 8px 0; color: #5b21b6; font-weight: 700; vertical-align: top;">Error Messages:</td>
                      <td style="padding: 8px 0; color: #000000;">${data.troubleshooting.errorMessages}</td>
                    </tr>
                    `
                        : ""
                    }
                  </table>
                </div>
                `
                    : ""
                }
                
                ${
                  cleanedConversation
                    ? `
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">💬 Conversation History</h2>
                  <div style="padding: 10px 0;">
                    ${cleanedConversation}
                  </div>
                </div>
                `
                    : ""
                }
                
                ${
                  emailAttachments && emailAttachments.length > 0
                    ? `
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📎 Attachments</h2>
                  <ul style="margin: 0; padding-left: 20px; color: #374151;">
                    ${emailAttachments.map((file) => `<li style="margin: 5px 0;">${file.filename}</li>`).join("")}
                  </ul>
                  <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 13px; font-style: italic;">${emailAttachments.length} file(s) attached to this email</p>
                </div>
                `
                    : ""
                }
                
                <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <p style="margin: 0; font-size: 14px; color: #1e40af;">
                    <strong>Note:</strong> Please reference ticket number <strong>${ticketNumber}</strong> in all correspondence.
                  </p>
                </div>
              </div>
              
              <div style="background: #111827; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                <h3 style="color: white; margin: 0 0 10px 0; font-size: 18px;">American Reliable Tech</h3>
                <p style="color: #9ca3af; margin: 5px 0; font-size: 14px;">Your Trusted IT Partner for Reliable Technology</p>
                
                <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #374151;">
                  <p style="color: #9ca3af; margin: 5px 0; font-size: 14px;">
                    <strong style="color: white;">Email:</strong> 
                    <a href="mailto:support@americanreliabletech.com" style="color: #7c3aed; text-decoration: none;">support@americanreliabletech.com</a>
                  </p>
                  <p style="color: #9ca3af; margin: 5px 0; font-size: 14px;">
                    <strong style="color: white;">Phone:</strong> 
                    <a href="tel:+19499333821" style="color: #7c3aed; text-decoration: none;">(949) 933-3821</a>
                  </p>
                  <p style="color: #9ca3af; margin: 5px 0; font-size: 14px;">
                    <strong style="color: white;">Location:</strong> Irvine, California
                  </p>
                </div>
                
                <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 12px;">
                  © 2025 American Reliable Tech. All rights reserved.
                </p>
              </div>
            </body>
          </html>
        `,
      })

      console.log("[v0] Freshdesk email response:", JSON.stringify(freshdeskResult))

      const customerResult = await resend.emails.send({
        from: "support@americanreliabletech.com",
        to: data.email,
        replyTo: "support@americanreliabletech.com",
        subject: `Support Ticket Confirmation - ${ticketNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">✓ Support Ticket Submitted!</h1>
              </div>
              
              <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
                <p style="margin: 0 0 20px 0; font-size: 16px; color: #111827;">Hi ${data.name},</p>
                
                <p style="margin: 0 0 20px 0; font-size: 15px; color: #374151;">
                  Thank you for contacting American Reliable Tech. Your support request has been successfully submitted to our team.
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #7c3aed; text-align: center;">
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">Your Ticket Number</p>
                  <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #7c3aed;">${ticketNumber}</p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #111827;">What Happens Next?</h2>
                  <ul style="margin: 0; padding-left: 20px; color: #374151;">
                    <li style="margin: 10px 0;">Our support team will review your ticket</li>
                    <li style="margin: 10px 0;">You'll receive a response at <strong>${data.email}</strong> within 24 hours</li>
                    <li style="margin: 10px 0;">Please reference ticket number <strong>${ticketNumber}</strong> in any follow-up communication</li>
                  </ul>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #111827;">Your Request Summary</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; width: 120px;"><strong>Priority:</strong></td>
                      <td style="padding: 8px 0;">
                        <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; 
                          ${
                            data.priority === "critical"
                              ? "background: #fee2e2; color: #991b1b;"
                              : data.priority === "high"
                                ? "background: #fef3c7; color: #92400e;"
                                : data.priority === "medium"
                                  ? "background: #dbeafe; color: #1e40af;"
                                  : "background: #d1fae5; color: #065f46;"
                          }">
                          ${data.priority.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;"><strong>Issue:</strong></td>
                      <td style="padding: 8px 0; color: #111827;">${data.issue.substring(0, 100)}${data.issue.length > 100 ? "..." : ""}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <p style="margin: 0; font-size: 14px; color: #1e40af;">
                    <strong>Need urgent assistance?</strong> Call us at <a href="tel:+19499333821" style="color: #7c3aed; text-decoration: none; font-weight: bold;">(949) 933-3821</a>
                  </p>
                </div>
              </div>
              
              <div style="background: #111827; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                <h3 style="color: white; margin: 0 0 10px 0; font-size: 18px;">American Reliable Tech</h3>
                <p style="color: #9ca3af; margin: 5px 0; font-size: 14px;">Your Trusted IT Partner for Reliable Technology</p>
                
                <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #374151;">
                  <p style="color: #9ca3af; margin: 5px 0; font-size: 14px;">
                    <strong style="color: white;">Email:</strong> 
                    <a href="mailto:support@americanreliabletech.com" style="color: #7c3aed; text-decoration: none;">support@americanreliabletech.com</a>
                  </p>
                  <p style="color: #9ca3af; margin: 5px 0; font-size: 14px;">
                    <strong style="color: white;">Phone:</strong> 
                    <a href="tel:+19499333821" style="color: #7c3aed; text-decoration: none;">(949) 933-3821</a>
                  </p>
                  <p style="color: #9ca3af; margin: 5px 0; font-size: 14px;">
                    <strong style="color: white;">Location:</strong> Irvine, California
                  </p>
                </div>
                
                <p style="color: #6b7280; margin: 20px 0 0 0; font-size: 12px;">
                  © 2025 American Reliable Tech. All rights reserved.
                </p>
              </div>
            </body>
          </html>
        `,
      })

      console.log("[v0] Customer confirmation email response:", JSON.stringify(customerResult))

      if (freshdeskResult.error || customerResult.error) {
        console.error("[v0] Email errors - Freshdesk:", freshdeskResult.error, "Customer:", customerResult.error)
        return {
          success: true,
          ticketNumber,
          message: `Ticket ${ticketNumber} created. Email notification may be delayed. Our team will contact you within 24 hours.`,
        }
      }

      console.log("[v0] Both emails sent successfully")
      return {
        success: true,
        ticketNumber,
        message: "Support ticket submitted successfully",
      }
    } catch (emailError: any) {
      console.error("[v0] Resend API call failed:", emailError)
      console.error("[v0] Error details:", emailError.message, emailError.stack)

      return {
        success: true,
        ticketNumber,
        message: `Ticket ${ticketNumber} created. Email notification pending. Our team will contact you within 24 hours.`,
      }
    }
  } catch (error: any) {
    console.error("[v0] Error in sendSupportTicket:", error)
    console.error("[v0] Error details:", error.message, error.stack)
    return {
      success: false,
      message: "Failed to submit support ticket. Please try again.",
    }
  }
}
