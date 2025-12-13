import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TicketDashboard } from "@/components/admin/ticket-dashboard"
import { fetchTickets } from "@/app/actions/admin-tickets"

export default async function AdminDashboardPage() {
  console.log("[v0] Admin dashboard: Starting page load")

  const supabase = await createClient()

  console.log("[v0] Admin dashboard: Checking user authentication")
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error("[v0] Admin dashboard: Auth error:", error)
    redirect("/admin/login")
  }

  if (!data?.user) {
    console.log("[v0] Admin dashboard: No user found, redirecting to login")
    redirect("/admin/login")
  }

  console.log("[v0] Admin dashboard: User authenticated:", data.user.email)
  console.log("[v0] Admin dashboard: Fetching tickets")

  const { tickets, error: ticketsError } = await fetchTickets()

  if (ticketsError) {
    console.error("[v0] Admin dashboard: Error fetching tickets:", ticketsError)
  } else {
    console.log("[v0] Admin dashboard: Successfully fetched", tickets.length, "tickets")
  }

  return <TicketDashboard userEmail={data.user.email || ""} initialTickets={tickets} />
}
