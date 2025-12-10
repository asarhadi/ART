"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// CUSTOMIZATION: Edit these messages to change the tooltips shown by the character
const IT_TIPS = [
  "Did you know? Regular backups can save your business from data disasters!",
  "Pro tip: Update your software regularly to stay protected from security threats.",
  "Fun fact: We monitor your systems 24/7 to prevent issues before they happen.",
  "Remember: Strong passwords are your first line of defense against cyber attacks.",
  "Quick tip: Cloud solutions can reduce your IT costs by up to 40%!",
]

// CUSTOMIZATION: Adjust these values to change animation behavior
const SCROLL_THRESHOLD = 100 // Pixels scrolled before character appears
const TIP_CHANGE_INTERVAL = 8000 // Milliseconds between tip changes (8 seconds)
const ANIMATION_DURATION = 600 // Milliseconds for pop-up animation

export default function AnimatedITCharacter() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)
  const [animationState, setAnimationState] = useState<"wave" | "typing" | "thumbsup">("wave")

  // Handle scroll detection to show/hide character
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsVisible(scrollPosition > SCROLL_THRESHOLD)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cycle through different animation states
  useEffect(() => {
    if (!isVisible) return

    const animationCycle = setInterval(() => {
      setAnimationState((prev) => {
        if (prev === "wave") return "typing"
        if (prev === "typing") return "thumbsup"
        return "wave"
      })
    }, 3000) // Change animation every 3 seconds

    return () => clearInterval(animationCycle)
  }, [isVisible])

  // Cycle through IT tips
  useEffect(() => {
    if (!isVisible) return

    const tipCycle = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % IT_TIPS.length)
    }, TIP_CHANGE_INTERVAL)

    return () => clearInterval(tipCycle)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
      {/* Character Container */}
      <div className="relative">
        {/* Tooltip/Speech Bubble */}
        <div className="absolute bottom-full right-0 mb-4 w-64 animate-fade-in">
          <div className="relative rounded-2xl bg-cyan-500 px-4 py-3 text-sm text-white shadow-lg">
            <p className="font-medium">{IT_TIPS[currentTip]}</p>
            {/* Speech bubble pointer */}
            <div className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 bg-cyan-500" />
          </div>
        </div>

        {/* Character Image with Animation */}
        <div
          className={`relative h-48 w-48 transition-transform duration-500 ${
            animationState === "wave"
              ? "animate-wave"
              : animationState === "typing"
                ? "animate-bounce-subtle"
                : "animate-thumbsup"
          }`}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IT%20Guy-y4h0b4gFxxkZzPQfV305iqC1mBMpMU.png"
            alt="IT Support Assistant"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Optional: Close button to dismiss character */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white opacity-0 transition-opacity hover:opacity-100"
          aria-label="Hide assistant"
        >
          ×
        </button>
      </div>
    </div>
  )
}
