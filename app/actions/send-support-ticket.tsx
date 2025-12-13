"use server"

import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"

interface SupportTicketData {
  name: string
  email: string
  phone: string
  company: string
  subject?: string
  description?: string
  category?: string
  impact?: string
  urgency?: string
  issue?: string
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

const calculatePriority = (impact: string, urgency: string): string => {
  const matrix: Record<string, Record<string, string>> = {
    Critical: { Critical: "Critical", High: "Critical", Medium: "High", Low: "Medium" },
    High: { Critical: "Critical", High: "High", Medium: "High", Low: "Medium" },
    Medium: { Critical: "High", High: "High", Medium: "Medium", Low: "Low" },
    Low: { Critical: "Medium", High: "Medium", Medium: "Low", Low: "Low" },
  }
  return matrix[impact]?.[urgency] || "Medium"
}

const getSLAResponseTime = (priority: string): string => {
  const sla: Record<string, string> = {
    Critical: "1 hour",
    High: "4 hours",
    Medium: "24 hours",
    Low: "48 hours",
  }
  return sla[priority] || "24 hours"
}

export async function sendSupportTicket(data: SupportTicketData) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    const supportEmail = process.env.SUPPORT_EMAIL || "support@americanreliabletech.com"

    console.log("[v0] Attempting to send support ticket")

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

    const calculatedPriority =
      data.impact && data.urgency
        ? calculatePriority(data.impact, data.urgency)
        : data.priority.charAt(0).toUpperCase() + data.priority.slice(1)

    const slaResponseTime = getSLAResponseTime(calculatedPriority)

    try {
      const supabase = await createClient()

      const { error: insertError } = await supabase.from("tickets").insert({
        ticket_number: ticketNumber,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        subject: data.subject || "Support Request",
        description: data.description || data.issue || "",
        category: data.category || "Other",
        impact: data.impact || "Medium",
        urgency: data.urgency || "Medium",
        priority: calculatedPriority,
        sla_response_time: slaResponseTime,
        status: "Open",
        attachments: data.attachmentData?.map((a) => a.filename) || [],
      })

      if (insertError) {
        console.error("[v0] Error saving ticket to database:", insertError)
      } else {
        console.log("[v0] Ticket saved to database successfully")
      }
    } catch (dbError) {
      console.error("[v0] Database error:", dbError)
    }

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

    try {
      await resend.emails.send({
        from: "support@americanreliabletech.com",
        to: "support@americanreliabletech.freshdesk.com",
        replyTo: data.email,
        subject: `[${calculatedPriority}] Ticket ${ticketNumber} - ${data.subject || data.name}`,
        text: `
SUPPORT TICKET: ${ticketNumber}

Customer Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}
- Company: ${data.company}

Priority: ${calculatedPriority}
SLA Response Time: ${slaResponseTime}
Category: ${data.category || "Other"}
Impact: ${data.impact || "Medium"}
Urgency: ${data.urgency || "Medium"}

Subject: ${data.subject || "Support Request"}

Description:
${data.description || data.issue}
        `,
        attachments: emailAttachments,
      })

      await resend.emails.send({
        from: "support@americanreliabletech.com",
        to: data.email,
        replyTo: "support@americanreliabletech.com",
        subject: `Support Ticket Confirmation - ${ticketNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">✓ Support Ticket Submitted!</h1>
              </div>
              
              <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
                <p style="margin: 0 0 20px 0;">Hi ${data.name},</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #7c3aed; text-align: center;">
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">Your Ticket Number</p>
                  <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #7c3aed;">${ticketNumber}</p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 15px 0;">Ticket Details</h2>
                  <p><strong>Priority:</strong> ${calculatedPriority}</p>
                  <p><strong>Expected Response:</strong> ${slaResponseTime}</p>
                  <p><strong>Category:</strong> ${data.category || "Other"}</p>
                  <p><strong>Subject:</strong> ${data.subject || "Support Request"}</p>
                </div>
                
                <p style="margin: 20px 0;">Track your ticket status at: <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://americanreliabletech.com"}/support/track">Track Ticket</a></p>
              </div>
            </body>
          </html>
        `,
      })

      return {
        success: true,
        ticketNumber,
        message: "Support ticket submitted successfully",
      }
    } catch (emailError: any) {
      console.error("[v0] Email error:", emailError)
      return {
        success: true,
        ticketNumber,
        message: `Ticket ${ticketNumber} created. Email notification pending.`,
      }
    }
  } catch (error: any) {
    console.error("[v0] Error in sendSupportTicket:", error)
    return {
      success: false,
      message: "Failed to submit support ticket. Please try again.",
    }
  }
}
