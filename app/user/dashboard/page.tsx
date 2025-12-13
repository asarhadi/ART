import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserTicketDashboard } from "@/components/user/user-ticket-dashboard"

export default async function UserDashboardPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  let profile = null
  const { data: existingProfile } = await supabase.from("user_profiles").select("*").eq("id", user.id).maybeSingle()

  if (!existingProfile) {
    const { data: newProfile } = await supabase
      .from("user_profiles")
      .insert({
        id: user.id,
        email: user.email,
        role: "user",
      })
      .select()
      .single()

    profile = newProfile
  } else {
    profile = existingProfile
  }

  // If admin, redirect to admin dashboard
  if (profile?.role === "admin") {
    redirect("/admin/dashboard")
  }

  // Fetch tickets assigned to or created by this user
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .or(`email.eq.${user.email},assigned_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  return <UserTicketDashboard tickets={tickets || []} userEmail={user.email || ""} userId={user.id} />
}
