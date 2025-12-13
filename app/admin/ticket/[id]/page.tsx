import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { fetchTicketById } from "@/app/actions/admin-tickets"
import { TicketDetailPage } from "@/components/admin/ticket-detail-page"

export default async function TicketPage({ params }: { params: { id: string } }) {
  // Check authentication
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Fetch ticket
  const { ticket, error } = await fetchTicketById(params.id)

  if (error || !ticket) {
    notFound()
  }

  return <TicketDetailPage ticket={ticket} />
}
