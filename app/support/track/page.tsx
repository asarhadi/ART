"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Footer from "@/components/footer"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function TrackTicketPage() {
  const [ticketNumber, setTicketNumber] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<any>(null)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setTicket(null)

    try {
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from("tickets")
        .select("*")
        .eq("ticket_number", ticketNumber)
        .eq("email", email)
        .single()

      if (fetchError || !data) {
        setError("Ticket not found. Please check your ticket number and email address.")
      } else {
        setTicket(data)
      }
    } catch (err) {
      setError("An error occurred while searching for your ticket.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
      case "Closed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-amber-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
      case "Closed":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Waiting on Customer":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/support" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Support
          </Link>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Track Your Ticket
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enter your ticket number and email to check the status of your support request.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label htmlFor="ticketNumber" className="block text-sm font-medium text-foreground">
                  Ticket Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ticketNumber"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  required
                  disabled={loading}
                  className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                  placeholder="ART-110625112909"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                  placeholder="your@email.com"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 py-6 text-base disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Ticket
                  </>
                )}
              </Button>
            </form>

            {ticket && (
              <div className="mt-8 pt-8 border-t border-border space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Ticket Details</h2>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(ticket.status)}`}
                  >
                    {getStatusIcon(ticket.status)}
                    <span className="font-semibold">{ticket.status}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
                  <p className="text-sm font-medium text-foreground">Ticket Number</p>
                  <p className="text-xl font-bold text-primary mt-1">{ticket.ticket_number}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Priority</p>
                    <p className="text-lg font-semibold text-foreground mt-1">{ticket.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">SLA Response Time</p>
                    <p className="text-lg font-semibold text-foreground mt-1">{ticket.sla_response_time}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="text-lg font-semibold text-foreground mt-1">{ticket.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Subject</p>
                  <p className="text-foreground">{ticket.subject}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-foreground whitespace-pre-wrap">{ticket.description}</p>
                </div>

                {ticket.resolution_notes && (
                  <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-2">Resolution Notes</p>
                    <p className="text-sm text-green-800">{ticket.resolution_notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
