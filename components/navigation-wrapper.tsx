import { createClient } from "@/lib/supabase/server"
import Navigation from "./navigation"

export default async function NavigationWrapper() {
  let user = null
  let profile = null

  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (authUser) {
      user = authUser

      const { data: profileData } = await supabase.from("user_profiles").select("*").eq("id", authUser.id).maybeSingle()

      if (!profileData) {
        const { data: newProfile } = await supabase
          .from("user_profiles")
          .insert({
            id: authUser.id,
            email: authUser.email,
            role: "user",
          })
          .select()
          .single()

        profile = newProfile
      } else {
        profile = profileData
      }
    }
  } catch (error) {
    console.log("[v0] Error in navigation wrapper:", error)
  }

  return <Navigation user={user} profile={profile} />
}
