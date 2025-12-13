import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
          </div>

          <ProfileForm user={user} profile={profile} />
        </div>
      </div>
    </div>
  )
}
