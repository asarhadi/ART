"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addTicketNote(ticketId: string, note: string, userId: string, userEmail: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase.from("user_profiles").select("full_name").eq("id", userId).maybeSingle()

  const { error } = await supabase.from("ticket_notes").insert({
    ticket_id: ticketId,
    user_id: userId,
    author_name: profile?.full_name || "User",
    author_email: userEmail,
    note: note,
    is_internal: false,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/user/dashboard")
  revalidatePath("/admin/dashboard")
  return { success: true }
}
