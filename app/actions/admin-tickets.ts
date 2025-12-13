"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type AdminTicket = {
  id: string
  ticket_number: string
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string
  description: string
  category: string
  impact: string
  urgency: string
  priority: string
  status: string
  tech_assigned_to: string | null
  attachments: any[]
  created_at: string
  updated_at: string
}

export type TicketReply = {
  id: string
  ticket_id: string
  author_name: string
  author_email: string
  reply_text: string
  is_internal: boolean
  attachments: any[]
  created_at: string
}

export type Technician = {
  id: string
  full_name: string
  email: string
  role: string
}

export async function fetchTickets(): Promise<{ tickets: AdminTicket[]; error: string | null }> {
  try {
    console.log("[v0] fetchTickets: Starting to fetch tickets")
    const supabase = await createClient()

    console.log("[v0] fetchTickets: Supabase client created, querying tickets table")
    const { data, error } = await supabase.from("tickets").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] fetchTickets: Supabase error:", error)
      return { tickets: [], error: error.message }
    }

    console.log("[v0] fetchTickets: Successfully fetched", data?.length || 0, "tickets")
    return { tickets: data || [], error: null }
  } catch (error) {
    console.error("[v0] fetchTickets: Exception:", error)
    return { tickets: [], error: "Failed to fetch tickets" }
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", ticketId)

    if (error) {
      console.error("[v0] Error updating ticket:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/dashboard")
    return { success: true, error: null }
  } catch (error) {
    console.error("[v0] Exception updating ticket:", error)
    return { success: false, error: "Failed to update ticket" }
  }
}

export async function fetchTicketReplies(ticketId: string): Promise<{ replies: TicketReply[]; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("ticket_replies")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching ticket replies:", error)
      return { replies: [], error: error.message }
    }

    return { replies: data || [], error: null }
  } catch (error) {
    console.error("[v0] Exception fetching ticket replies:", error)
    return { replies: [], error: "Failed to fetch ticket replies" }
  }
}

export async function addTicketReply(
  ticketId: string,
  replyText: string,
  isInternal: boolean,
  attachments: any[] = [],
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .maybeSingle()

    const authorName = profile?.full_name || "Admin"
    const authorEmail = profile?.email || user.email || ""

    // Insert reply
    const { error: replyError } = await supabase.from("ticket_replies").insert({
      ticket_id: ticketId,
      author_id: user.id,
      author_name: authorName,
      author_email: authorEmail,
      reply_text: replyText,
      is_internal: isInternal,
      attachments: attachments,
    })

    if (replyError) {
      console.error("[v0] Error adding ticket reply:", replyError)
      return { success: false, error: replyError.message }
    }

    // If not internal, send email notification to customer
    if (!isInternal) {
      // Get ticket details
      const { data: ticket } = await supabase
        .from("tickets")
        .select("ticket_number, subject, email, name")
        .eq("id", ticketId)
        .single()

      if (ticket) {
        // Send email notification (you'll need to implement this)
        await sendReplyNotification(ticket, replyText, authorName)
      }
    }

    // Update ticket's updated_at timestamp
    await supabase.from("tickets").update({ updated_at: new Date().toISOString() }).eq("id", ticketId)

    revalidatePath("/admin/dashboard")
    return { success: true, error: null }
  } catch (error) {
    console.error("[v0] Exception adding ticket reply:", error)
    return { success: false, error: "Failed to add reply" }
  }
}

async function sendReplyNotification(ticket: any, replyText: string, authorName: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/send-reply-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketNumber: ticket.ticket_number,
        subject: ticket.subject,
        customerEmail: ticket.email,
        customerName: ticket.name,
        replyText: replyText,
        authorName: authorName,
      }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to send reply notification email")
    }
  } catch (error) {
    console.error("[v0] Error sending reply notification:", error)
  }
}

export async function assignTechToTicket(
  ticketId: string,
  techId: string | null,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("tickets")
      .update({
        tech_assigned_to: techId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ticketId)

    if (error) {
      console.error("[v0] Error assigning tech:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/dashboard")
    return { success: true, error: null }
  } catch (error) {
    console.error("[v0] Exception assigning tech:", error)
    return { success: false, error: "Failed to assign technician" }
  }
}

export async function fetchTechnicians(): Promise<{ technicians: Technician[]; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, full_name, email, role")
      .in("role", ["admin", "user"])
      .order("full_name")

    if (error) {
      console.error("[v0] Error fetching technicians:", error)
      return { technicians: [], error: error.message }
    }

    return { technicians: data || [], error: null }
  } catch (error) {
    console.error("[v0] Exception fetching technicians:", error)
    return { technicians: [], error: "Failed to fetch technicians" }
  }
}

export async function fetchTicketById(ticketId: string): Promise<{ ticket: AdminTicket | null; error: string | null }> {
  try {
    console.log("[v0] fetchTicketById: Fetching ticket", ticketId)
    const supabase = await createClient()

    const { data, error } = await supabase.from("tickets").select("*").eq("id", ticketId).single()

    if (error) {
      console.error("[v0] fetchTicketById: Supabase error:", error)
      return { ticket: null, error: error.message }
    }

    console.log("[v0] fetchTicketById: Successfully fetched ticket")
    return { ticket: data, error: null }
  } catch (error) {
    console.error("[v0] fetchTicketById: Exception:", error)
    return { ticket: null, error: "Failed to fetch ticket" }
  }
}
