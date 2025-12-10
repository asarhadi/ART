"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border backdrop-blur" style={{ backgroundColor: "#F1E9F7" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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
              <Link href="/contact">Contact Us</Link>
            </Button>
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
              <Button className="w-full bg-primary">
                <Link href="/contact" className="w-full">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
