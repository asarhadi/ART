"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const full_name = formData.get("full_name") as string
  const phone = formData.get("phone") as string
  const company = formData.get("company") as string
  const profile_picture_url = formData.get("profile_picture_url") as string

  const updateData: any = {
    full_name,
    phone,
    company,
  }

  if (profile_picture_url) {
    updateData.profile_picture_url = profile_picture_url
  }

  const { error } = await supabase.from("user_profiles").update(updateData).eq("id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient()

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  if (newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
