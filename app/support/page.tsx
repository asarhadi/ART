"use client"

import type React from "react"
import { useState } from "react"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageSquare, AlertCircle, CheckCircle, Loader2, Upload, X, Search } from "lucide-react"
import { sendSupportTicket } from "@/app/actions/send-support-ticket"
import Link from "next/link"

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

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    description: "",
    category: "",
    impact: "Medium",
    urgency: "Medium",
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])

  const priority = calculatePriority(formData.impact, formData.urgency)
  const slaTime = getSLAResponseTime(priority)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const attachmentData = await Promise.all(
        attachments.map(async (file) => {
          const reader = new FileReader()
          return new Promise<{ dataUrl: string; filename: string }>((resolve) => {
            reader.onload = () => {
              resolve({
                dataUrl: reader.result as string,
                filename: file.name,
              })
            }
            reader.readAsDataURL(file)
          })
        }),
      )

      const result = await sendSupportTicket({
        ...formData,
        issue: formData.description,
        priority: priority.toLowerCase(),
        attachmentData,
      })

      if (result.success) {
        setTicketNumber(result.ticketNumber)
        setSubmitted(true)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Error submitting support ticket:", error)
      alert("Failed to submit support ticket. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLiveChat = () => {
    window.dispatchEvent(new CustomEvent("openSupportChat"))
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Support Center</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get help from our team. Submit a ticket, call us, or chat with an agent.
          </p>
          <div className="mt-6">
            <Link href="/support/track" className="inline-flex items-center gap-2 text-primary hover:underline">
              <Search className="h-4 w-4" />
              Track Your Ticket
            </Link>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Phone Support */}
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">Call Our Support Team</h3>
              <p className="mt-3 text-muted-foreground">
                Speak directly with a support specialist for immediate assistance.
              </p>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Monday - Friday
                  <br />
                  8:00 AM - 6:00 PM PST
                </p>
              </div>
            </div>

            {/* Live Chat Support */}
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">Live Chat with an Agent</h3>
              <p className="mt-3 text-muted-foreground">
                Chat in real-time with a support agent. Quick answers to your questions.
              </p>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-muted-foreground">Available during business hours</p>
                <p className="text-sm font-medium text-primary">Average response: 2-5 minutes</p>
              </div>
              <Button onClick={handleLiveChat} className="mt-6 w-full bg-primary hover:bg-primary/90">
                Start Live Chat
              </Button>
            </div>

            {/* Email Support */}
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">Submit a Support Ticket</h3>
              <p className="mt-3 text-muted-foreground">
                Submit a detailed support request and we'll get back to you based on priority.
              </p>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-muted-foreground">support@americanreliabletech.com</p>
                <p className="text-sm font-medium text-primary">Response based on SLA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">Submit a Support Ticket</h2>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below and our support team will receive your ticket and respond based on priority.
          </p>

          <div className="mt-8 rounded-lg border border-border bg-card p-8">
            {submitted ? (
              <div className="rounded-lg bg-green-50 p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900">Support Ticket Submitted!</h3>
                    <p className="mt-2 text-sm text-green-800">
                      Your support request has been successfully submitted to our team.
                    </p>
                    <div className="mt-4 rounded-lg bg-primary/10 p-4 border-2 border-primary">
                      <p className="text-sm font-medium text-foreground">Ticket Number:</p>
                      <p className="text-2xl font-bold text-primary mt-1">{ticketNumber}</p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-green-800">
                        <strong>Priority:</strong> {priority}
                      </p>
                      <p className="text-sm text-green-800">
                        <strong>Expected Response Time:</strong> {slaTime}
                      </p>
                      <p className="text-sm text-green-800">
                        Our support team will respond to <strong>{formData.email}</strong>
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-green-200">
                      <p className="text-sm text-green-800 mb-3">
                        <strong>Track your ticket:</strong>
                      </p>
                      <Link
                        href="/support/track"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                      >
                        <Search className="h-4 w-4" />
                        Check Ticket Status
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        placeholder="(619) 363-2238"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={loading}
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Issue Details</h3>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        placeholder="Brief summary of the issue"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-foreground">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                      >
                        <option value="">Select a category</option>
                        <option value="Network Issues">Network Issues</option>
                        <option value="Hardware Problem">Hardware Problem</option>
                        <option value="Software Issue">Software Issue</option>
                        <option value="Security Concern">Security Concern</option>
                        <option value="Email Problem">Email Problem</option>
                        <option value="Cloud Services">Cloud Services</option>
                        <option value="Backup & Recovery">Backup & Recovery</option>
                        <option value="User Access">User Access</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-foreground">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        rows={6}
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        placeholder="Please describe the issue in detail..."
                      />
                    </div>
                  </div>
                </div>

                {/* Priority Calculation */}
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Priority Assessment</h3>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="impact" className="block text-sm font-medium text-foreground">
                        Impact <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="impact"
                        name="impact"
                        value={formData.impact}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                      >
                        <option value="Critical">Critical - Business stopped</option>
                        <option value="High">High - Major impact</option>
                        <option value="Medium">Medium - Moderate impact</option>
                        <option value="Low">Low - Minor impact</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="urgency" className="block text-sm font-medium text-foreground">
                        Urgency <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="urgency"
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                      >
                        <option value="Critical">Critical - Immediate</option>
                        <option value="High">High - Within hours</option>
                        <option value="Medium">Medium - Within day</option>
                        <option value="Low">Low - Can wait</option>
                      </select>
                    </div>
                  </div>

                  {/* SLA Display */}
                  <div className="mt-4 rounded-lg bg-primary/10 p-4 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Calculated Priority:</p>
                        <p className="text-lg font-bold text-primary">{priority}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">Expected Response:</p>
                        <p className="text-lg font-bold text-primary">{slaTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Attachments (Optional)</h3>

                  <div>
                    <label htmlFor="attachments" className="block text-sm font-medium text-foreground mb-2">
                      Upload files (screenshots, logs, etc.)
                    </label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={loading}
                        onClick={() => document.getElementById("attachments")?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Choose Files
                      </Button>
                      <input
                        type="file"
                        id="attachments"
                        multiple
                        onChange={handleFileChange}
                        disabled={loading}
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt,.log"
                      />
                      <span className="text-sm text-muted-foreground">Max 10MB per file</span>
                    </div>

                    {attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span className="text-sm text-foreground truncate flex-1">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Your support ticket will be sent to our team and stored securely. You'll receive email confirmation
                    and can track your ticket status online.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 py-6 text-base disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Create Support Ticket"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
