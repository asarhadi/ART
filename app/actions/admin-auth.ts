"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function loginAdmin(email: string, password: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/admin/dashboard")
}

export async function adminLogout() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

// Keep the old export for backward compatibility
export const logoutAdmin = adminLogout
