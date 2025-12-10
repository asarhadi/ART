"use client"

import type React from "react"
import { useState } from "react"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageSquare, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { sendSupportTicket } from "@/app/actions/send-support-ticket"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    issue: "",
    priority: "medium",
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await sendSupportTicket(formData)

      if (result.success) {
        setTicketNumber(result.ticketNumber)
        setSubmitted(true)
        // Users can now view the ticket number indefinitely until they manually close or refresh
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
                Submit a detailed support request and we'll get back to you within 24 hours.
              </p>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-muted-foreground">admin@americanreliabletech.com</p>
                <p className="text-sm font-medium text-primary">Response within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Ticket Form */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">Submit a Support Ticket</h2>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below and our support team will receive your ticket and respond to your issue.
          </p>

          <div className="mt-8 rounded-lg border border-border bg-card p-8">
            {submitted ? (
              <div className="rounded-lg bg-green-50 p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900">Support Ticket Submitted!</h3>
                    <p className="mt-2 text-sm text-green-800">
                      Your support request has been successfully submitted to our team.
                    </p>
                    <p className="mt-3 text-sm font-mono text-green-900">
                      Ticket #: <strong>{ticketNumber}</strong>
                    </p>
                    <p className="mt-3 text-sm text-green-800">
                      Our support team will respond to <strong>{formData.email}</strong> within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
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
                      placeholder="Your phone number"
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

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-foreground">
                    Priority Level
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={loading}
                    className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                  >
                    <option value="low">Low - General Inquiry</option>
                    <option value="medium">Medium - Standard Support</option>
                    <option value="high">High - Urgent Issue</option>
                    <option value="critical">Critical - System Down</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="issue" className="block text-sm font-medium text-foreground">
                    Issue Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="issue"
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows={6}
                    className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    placeholder="Please describe the issue you're experiencing in detail..."
                  />
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Your support ticket will be sent directly to support Team and they will respond within 24 hours.
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
