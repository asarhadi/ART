"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DefaultAvatar } from "@/components/ui/default-avatar" // Import DefaultAvatar component
import { updateProfile, changePassword } from "@/app/actions/profile-actions"
import { Loader2, UserIcon, Lock, Bell, Camera, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileFormProps {
  user: User
  profile: any
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [profilePicture, setProfilePicture] = useState(profile?.profile_picture_url || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    try {
      // Delete old profile picture if exists
      if (profilePicture) {
        await fetch("/api/avatar/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: profilePicture }),
        })
      }

      // Upload new profile picture
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/avatar/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { url } = await response.json()

      // Update profile with new picture URL
      const updateFormData = new FormData()
      updateFormData.append("profile_picture_url", url)

      const result = await updateProfile(updateFormData)

      if (result.success) {
        setProfilePicture(url)
        setMessage({ type: "success", text: "Profile picture updated successfully!" })
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to update profile")
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to upload profile picture" })
    } finally {
      setUploading(false)
    }
  }

  const handleProfileUpdate = async (formData: FormData) => {
    setLoading(true)
    setMessage(null)

    const result = await updateProfile(formData)

    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" })
      router.refresh()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update profile" })
    }

    setLoading(false)
  }

  const handlePasswordChange = async (formData: FormData) => {
    setLoading(true)
    setMessage(null)

    const result = await changePassword(formData)

    if (result.success) {
      setMessage({ type: "success", text: "Password changed successfully!" })
      // Clear form
      const form = document.querySelector("form") as HTMLFormElement
      form?.reset()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to change password" })
    }

    setLoading(false)
  }

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.[0]?.toUpperCase() || "U"
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Preferences
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information and contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col items-center gap-4">
              <div className="relative">
                {profilePicture ? (
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profilePicture || "/placeholder.svg"} alt={profile?.full_name || user.email} />
                    <AvatarFallback className="bg-violet-600 text-white text-3xl">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-32 w-32">
                    <DefaultAvatar size="lg" />
                  </div>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>
            </div>

            <form action={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user.email} disabled className="bg-gray-50" />
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ""} placeholder="John Doe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile?.phone || ""}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  defaultValue={profile?.company || ""}
                  placeholder="Your Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={profile?.role === "admin" ? "Administrator" : "User"} disabled className="bg-gray-50" />
                <p className="text-sm text-gray-500">Contact an administrator to change your role</p>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {message.text}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required minLength={6} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {message.text}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about your tickets</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ticket Updates</p>
                  <p className="text-sm text-gray-500">Get notified when tickets are updated</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <Button className="w-full">Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
