"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DefaultAvatar } from "@/components/ui/default-avatar"
import { usePathname, useRouter } from "next/navigation"
import { adminLogout } from "@/app/actions/admin-auth"

interface NavigationProps {
  user: any
  profile: any
}

export default function Navigation({ user, profile }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isSupport = pathname === "/support"

  const handleLogout = async () => {
    await adminLogout()
    router.push("/")
    router.refresh()
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
    <nav className="sticky top-0 z-50 border-b border-border backdrop-blur" style={{ backgroundColor: "#F1E9F7" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2"
              style={{
                filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.4))",
                transition: "filter 0.3s ease",
              }}
            >
              <Image
                src="/art-logo-purple.png"
                alt="American Reliable Tech Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="hidden text-lg font-bold text-foreground sm:inline">American Reliable Tech</span>
              <span className="text-lg font-bold text-foreground sm:hidden">ART</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 ease-in-out hover:bg-[#4A00FF] hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 ease-in-out hover:bg-[#4A00FF] hover:text-white"
            >
              Services
            </Link>
            <Link
              href="/industries"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 ease-in-out hover:bg-[#4A00FF] hover:text-white"
            >
              Industries
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 ease-in-out hover:bg-[#4A00FF] hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 ease-in-out hover:bg-[#4A00FF] hover:text-white"
            >
              About
            </Link>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="outline">
              <Link href="/support">Support</Link>
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              style={{
                filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.4))",
                transition: "filter 0.3s ease",
              }}
            >
              <Link href="tel:619-363-2238">Call Now</Link>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                    {profile?.profile_picture_url ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={profile.profile_picture_url || "/placeholder.svg"}
                          alt={profile?.full_name || user.email}
                        />
                        <AvatarFallback className="bg-violet-600 text-white">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <DefaultAvatar size="md" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-violet-600 font-medium">
                        {profile?.role === "admin" ? "Administrator" : "User"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={profile?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              isSupport && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/admin/login" title="Admin Login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-[#4A00FF] hover:text-white"
              >
                Home
              </Link>
              <Link
                href="/services"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-[#4A00FF] hover:text-white"
              >
                Services
              </Link>
              <Link
                href="/industries"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-[#4A00FF] hover:text-white"
              >
                Industries
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-[#4A00FF] hover:text-white"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-[#4A00FF] hover:text-white"
              >
                About
              </Link>
              <Button variant="outline" className="w-full bg-transparent">
                <Link href="/support" className="w-full">
                  Support
                </Link>
              </Button>
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    {profile?.profile_picture_url ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={profile.profile_picture_url || "/placeholder.svg"}
                          alt={profile?.full_name || user.email}
                        />
                        <AvatarFallback className="bg-violet-600 text-white">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <DefaultAvatar size="md" />
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Link href={profile?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} className="w-full">
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent text-red-600" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                isSupport && (
                  <Button variant="outline" className="w-full bg-transparent">
                    <Link href="/admin/login" className="flex w-full items-center justify-center gap-2">
                      <User className="h-4 w-4" />
                      Admin Login
                    </Link>
                  </Button>
                )
              )}
              <Button className="w-full bg-primary">Call Now</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
