import { streamText, tool, convertToModelMessages } from "ai"
import { z } from "zod"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    console.log("[v0] [SERVER] Received messages count:", messages.length)

    const modelMessages = convertToModelMessages(messages)

    const processedMessages = modelMessages.map((msg: any, index: number) => {
      const originalMsg = messages[index]

      // Check if the original message has experimental_attachments
      if (originalMsg?.experimental_attachments && originalMsg.experimental_attachments.length > 0) {
        console.log(`[v0] [SERVER] Message ${index} has ${originalMsg.experimental_attachments.length} attachments`)

        // Get existing text content
        const textContent = Array.isArray(msg.content)
          ? msg.content.find((p: any) => p.type === "text")?.text || ""
          : typeof msg.content === "string"
            ? msg.content
            : ""

        const contentParts: any[] = [{ type: "text", text: textContent }]

        // Add each attachment as an image part
        originalMsg.experimental_attachments.forEach((att: any, attIndex: number) => {
          console.log(`[v0] [SERVER] Processing attachment ${attIndex}:`, att.name, att.contentType)

          if (att.contentType?.startsWith("image/") && att.url) {
            contentParts.push({
              type: "image",
              image: att.url, // data URL
            })
            console.log(`[v0] [SERVER] Added image to message content`)
          }
        })

        return {
          ...msg,
          content: contentParts,
        }
      }

      return msg
    })

    console.log("[v0] [SERVER] Processed messages, sending to AI")

    const systemPrompt = `You are a helpful AI support agent for American Reliable Tech, a managed IT services provider (MSP) based in Irvine, California.

Your role is to:
1. Greet customers warmly and professionally
2. Help triage their IT support issues by asking structured questions
3. Answer common questions about our services:
   - Managed IT Support (24/7 proactive monitoring)
   - Cybersecurity (threat protection, compliance)
   - Cloud Services (migration, management)
   - Compliance Support (HIPAA, SOC 2, PCI-DSS)
   - IT Consulting (strategic planning)
   - Backup & Disaster Recovery
4. Collect necessary information to prepare a support ticket

IMPORTANT TRIAGE QUESTIONS - Ask these questions naturally and conversationally to gather information:

1. Can you briefly describe the issue you're experiencing?
2. Which app, account, or system is affected?
3. What device are you using (PC, Mac, iPhone, Android, etc.)?
4. When did this issue start happening?
5. Have you made any recent changes (updates, new software, settings, hardware)?
6. Are you the only one affected, or is this happening to others too?
7. Can you still access other apps or functions normally?
8. Have you already tried any troubleshooting steps (restart, reinstall, reset, etc.)?
9. Can you share any error messages, screenshots, or codes you're seeing?

You don't need to ask ALL questions at once - ask them naturally based on the conversation flow.

CRITICAL - WHEN CUSTOMERS UPLOAD IMAGES:
- You CAN see images that customers upload
- ALWAYS start your response by acknowledging the image: "I can see the [screenshot/image/photo] you uploaded..."
- Describe in detail what you observe: error messages, UI elements, system states, specific text, numbers, etc.
- Reference specific text, buttons, icons, or error codes visible in the image
- Use the visual information to diagnose the issue more accurately
- Ask follow-up questions based on what you see in the screenshot
- If the image shows an error message, read it out loud and explain what it means
- Never say you can't see an image if one was uploaded - you have vision capabilities

When you have collected sufficient information (at minimum: name, email, phone, company, and issue description), use the prepareTicket tool to prepare the ticket for submission.

Determine the urgency level automatically based on severity:
- Critical: System down, business stopped, security breach, data loss
- High: Major functionality broken, multiple users affected, urgent deadline
- Medium: Partial functionality issues, workarounds available
- Low: Minor issues, cosmetic problems, feature requests

Be conversational, empathetic, and professional.

Contact information:
- Phone: (949) 933-3821
- Email: support@americanreliabletech.com
- Location: Irvine, California`

    const result = streamText({
      model: "openai/gpt-4o",
      system: systemPrompt,
      messages: processedMessages,
      tools: {
        prepareTicket: tool({
          description:
            "Prepare a support ticket with collected information. Use this when you have gathered all necessary details from the customer.",
          inputSchema: z.object({
            name: z.string().describe("Customer's full name"),
            email: z.string().email().describe("Customer's email address (must be valid email format)"),
            phone: z
              .string()
              .min(10, "Phone must be at least 10 digits")
              .describe("Customer's phone number in US format (e.g., 949-933-3821 or (949) 933-3821)"),
            company: z.string().describe("Customer's company name"),
            priority: z.enum(["low", "medium", "high", "critical"]).describe("Issue priority level"),
            description: z.string().describe("Complete description of the issue including all gathered information"),
            conversationSummary: z.string().describe("Summary of the entire conversation for context"),
            troubleshooting: z
              .object({
                device: z
                  .string()
                  .optional()
                  .describe("Device type and OS (e.g., Windows 11 PC, MacBook Pro, iPhone 15)"),
                affectedSystem: z.string().optional().describe("Which app, account, or system is affected"),
                issueStartTime: z.string().optional().describe("When the issue started"),
                recentChanges: z.string().optional().describe("Any recent changes made (updates, new software, etc.)"),
                affectedUsers: z.string().optional().describe("Is this affecting just one user or multiple users"),
                otherFunctionsWorking: z.string().optional().describe("Can other apps/functions be accessed normally"),
                troubleshootingAttempted: z.string().optional().describe("What troubleshooting steps have been tried"),
                errorMessages: z.string().optional().describe("Any error messages, codes, or screenshots provided"),
              })
              .describe("Structured troubleshooting information collected during the conversation"),
          }),
          execute: async (params) => {
            return {
              ready: true,
              ticketData: params,
              message: "I've prepared your support ticket. Please verify your phone number to submit it.",
            }
          },
        }),
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] [SERVER] Chat API error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
