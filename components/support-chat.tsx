"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { MessageCircle, X, Send, Paperclip, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { sendSupportTicket } from "@/app/actions/send-support-ticket"
import { sendOTP, verifyOTP } from "@/app/actions/send-otp"

declare global {
  interface WindowEventMap {
    openSupportChat: CustomEvent
  }
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [allUploadedFiles, setAllUploadedFiles] = useState<File[]>([])
  const [messageAttachments, setMessageAttachments] = useState<Map<number, Array<{ name: string; url: string }>>>(
    new Map(),
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [initialMessages, setInitialMessages] = useState<any[]>([])
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpError, setOtpError] = useState("")
  const [pendingTicketData, setPendingTicketData] = useState<any>(null)

  useEffect(() => {
    const savedMessages = sessionStorage.getItem("art-support-chat-messages")
    if (savedMessages) {
      try {
        setInitialMessages(JSON.parse(savedMessages))
      } catch (e) {
        console.error("[v0] Failed to parse saved messages:", e)
      }
    }

    const handleOpenChat = () => {
      setIsOpen(true)
    }
    window.addEventListener("openSupportChat", handleOpenChat)

    return () => {
      window.removeEventListener("openSupportChat", handleOpenChat)
    }
  }, [])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/support-chat" }),
    initialMessages,
    experimental_attachments: true,
  })

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("art-support-chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || status === "in_progress") return

    const formattedAttachments = await Promise.all(
      attachments.map(async (file) => {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        return {
          name: file.name,
          contentType: file.type,
          url: dataUrl,
        }
      }),
    )

    if (attachments.length > 0) {
      console.log("[v0] [CLIENT] Adding attachments to accumulated list:", attachments.length)
      setAllUploadedFiles((prev) => [...prev, ...attachments])

      const currentMessageIndex = messages.filter((m) => m.role === "user").length
      const attachmentData = await Promise.all(
        attachments.map(async (file) => {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
          return { name: file.name, url: dataUrl }
        }),
      )

      setMessageAttachments((prev) => {
        const newMap = new Map(prev)
        newMap.set(currentMessageIndex, attachmentData)
        return newMap
      })
    }

    sendMessage({
      text: inputValue,
      experimental_attachments: formattedAttachments.length > 0 ? formattedAttachments : undefined,
    })
    setInputValue("")
    setAttachments([])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSendOTP = async (ticketData: any) => {
    setPendingTicketData(ticketData)
    const result = await sendOTP(ticketData.phone, ticketData.email)

    if (result.success) {
      setOtpSent(true)
      setOtpError("")
    } else {
      setOtpError(result.message || "Failed to send verification code")
    }
  }

  const handleVerifyAndSubmit = async () => {
    if (!pendingTicketData || !otpCode) return

    setIsSubmittingTicket(true)
    const verifyResult = await verifyOTP(pendingTicketData.phone, otpCode)

    if (!verifyResult.success) {
      setOtpError(verifyResult.message || "Verification failed")
      setIsSubmittingTicket(false)
      return
    }

    // OTP verified, proceed with ticket submission
    await handleSubmitTicket(pendingTicketData)

    // Reset OTP state
    setOtpSent(false)
    setOtpCode("")
    setOtpError("")
    setPendingTicketData(null)
  }

  const handleSubmitTicket = async (ticketData: any) => {
    setIsSubmittingTicket(true)
    try {
      const conversationLines: string[] = []
      messages
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .forEach((msg) => {
          const text = msg.parts
            .filter((part: any) => part.type === "text")
            .map((part: any) => part.text)
            .join(" ")

          if (text.trim()) {
            if (msg.role === "assistant") {
              conversationLines.push(`AI Agent: ${text}`)
            } else {
              conversationLines.push(`Customer: ${text}`)
            }
          }
        })

      console.log("[v0] [CLIENT] Converting uploaded files to data URLs:", allUploadedFiles.length)
      const attachmentData: Array<{ dataUrl: string; filename: string }> = []

      for (const file of allUploadedFiles) {
        try {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
          console.log("[v0] [CLIENT] Converted file to data URL:", file.name)
          attachmentData.push({
            dataUrl,
            filename: file.name,
          })
        } catch (error) {
          console.error("[v0] [CLIENT] Error converting file to data URL:", file.name, error)
        }
      }

      console.log("[v0] [CLIENT] Total attachments with filenames:", attachmentData.length)

      const result = await sendSupportTicket({
        name: ticketData.name,
        email: ticketData.email,
        phone: ticketData.phone,
        company: ticketData.company,
        priority: ticketData.priority,
        issue: ticketData.description,
        conversationHistory: conversationLines.join("\n"),
        attachmentData: attachmentData.length > 0 ? attachmentData : undefined,
        troubleshooting: ticketData.troubleshooting,
      })

      if (result.success) {
        sendMessage({
          text: `✓ Ticket ${result.ticketNumber} has been created successfully! We'll respond within 24 hours. You should receive a confirmation email at ${ticketData.email}.`,
        })
        setAttachments([])
        setAllUploadedFiles([])
      } else {
        sendMessage({
          text: `Sorry, there was an error creating your ticket: ${result.message}. Please try submitting through our support form or call us at (949) 933-3821.`,
        })
      }
    } catch (error) {
      console.error("[v0] Error submitting ticket:", error)
      sendMessage({
        text: "Sorry, there was an error submitting your ticket. Please try our support form or call (949) 933-3821.",
      })
    } finally {
      setIsSubmittingTicket(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90 z-50"
          aria-label="Open support chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card
          className={`fixed bottom-6 right-6 w-96 flex flex-col shadow-2xl z-50 border-2 ${
            isMinimized ? "h-auto" : "max-h-[80vh] min-h-[400px]"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">ART Support</h3>
                <p className="text-xs opacity-90">We're here to help</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
                aria-label="Minimize chat"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      Hi! This is ART support Agent.
                      <br />
                      How can I help you today? :)
                    </p>
                  </div>
                )}

                {messages.map((message, messageIndex) => {
                  const userMessageIndex =
                    messages.slice(0, messageIndex + 1).filter((m) => m.role === "user").length - 1
                  const hasAttachments = message.role === "user" && messageAttachments.has(userMessageIndex)

                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.parts.map((part, index) => {
                          if (part.type === "text") {
                            return (
                              <p key={index} className="text-sm whitespace-pre-wrap">
                                {part.text}
                              </p>
                            )
                          }

                          if (part.type === "image") {
                            return (
                              <img
                                key={index}
                                src={part.image || "/placeholder.svg"}
                                alt="Uploaded image"
                                className="max-w-full rounded mt-2"
                              />
                            )
                          }

                          if (part.type === "file") {
                            return (
                              <div key={index} className="flex items-center gap-2 mt-2 text-xs">
                                <Paperclip className="h-3 w-3" />
                                <span>{part.name}</span>
                              </div>
                            )
                          }

                          if (part.type === "tool-prepareTicket") {
                            if (part.state === "input-available") {
                              return (
                                <div key={index} className="text-sm text-muted-foreground">
                                  Preparing your ticket...
                                </div>
                              )
                            }
                            if (part.state === "output-available") {
                              const output = part.output as any
                              if (output.ready) {
                                return (
                                  <div key={index} className="mt-2">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                                      <p className="text-sm font-semibold text-blue-900">Ticket Ready for Submission</p>
                                      <div className="text-xs text-blue-800 space-y-1">
                                        <p>
                                          <strong>Name:</strong> {output.ticketData.name}
                                        </p>
                                        <p>
                                          <strong>Email:</strong> {output.ticketData.email}
                                        </p>
                                        <p>
                                          <strong>Phone:</strong> {output.ticketData.phone}
                                        </p>
                                        <p>
                                          <strong>Priority:</strong> {output.ticketData.priority.toUpperCase()}
                                        </p>
                                      </div>

                                      {!otpSent ? (
                                        <Button
                                          onClick={() => handleSendOTP(output.ticketData)}
                                          disabled={isSubmittingTicket}
                                          className="w-full mt-2"
                                          size="sm"
                                        >
                                          Send Verification Code
                                        </Button>
                                      ) : (
                                        <div className="space-y-2 mt-2">
                                          <p className="text-xs text-blue-800">
                                            Enter the 6-digit code sent to your email:
                                          </p>
                                          <Input
                                            type="text"
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                            placeholder="000000"
                                            className="text-center text-lg tracking-widest"
                                          />
                                          {otpError && <p className="text-xs text-red-600">{otpError}</p>}
                                          <div className="flex gap-2">
                                            <Button
                                              onClick={handleVerifyAndSubmit}
                                              disabled={isSubmittingTicket || otpCode.length !== 6}
                                              className="flex-1"
                                              size="sm"
                                            >
                                              {isSubmittingTicket ? "Submitting..." : "Verify & Submit"}
                                            </Button>
                                            <Button
                                              onClick={() => handleSendOTP(output.ticketData)}
                                              variant="outline"
                                              size="sm"
                                            >
                                              Resend
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              }
                            }
                          }
                          return null
                        })}

                        {hasAttachments && (
                          <div className="mt-2 space-y-1">
                            {messageAttachments.get(userMessageIndex)!.map((attachment, idx) => {
                              const isImage = attachment.url.startsWith("data:image/")
                              return isImage ? (
                                <img
                                  key={idx}
                                  src={attachment.url || "/placeholder.svg"}
                                  alt={attachment.name}
                                  className="max-w-full rounded border mt-1"
                                />
                              ) : (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-xs bg-background/50 rounded px-2 py-1 mt-1"
                                >
                                  <Paperclip className="h-3 w-3" />
                                  <span className="truncate">{attachment.name}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t">
                {attachments.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={status === "in_progress"}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>

                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    disabled={status === "in_progress"}
                    className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <Button type="submit" size="icon" disabled={!inputValue.trim() || status === "in_progress"}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Press Enter to send, Shift+Enter for new line</p>
              </form>
            </>
          )}
        </Card>
      )}
    </>
  )
}
