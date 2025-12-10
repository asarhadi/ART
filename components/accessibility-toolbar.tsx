"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accessibility, Type, Contrast, Eye, Volume2, Pause, Focus, Palette, X } from "lucide-react"

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [screenReaderMode, setScreenReaderMode] = useState(false)
  const [pauseAnimations, setPauseAnimations] = useState(false)
  const [focusIndicator, setFocusIndicator] = useState(false)
  const [colorBlindMode, setColorBlindMode] = useState(false)

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150)
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}%`
  }

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80)
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}%`
  }

  const resetFontSize = () => {
    setFontSize(100)
    document.documentElement.style.fontSize = "100%"
  }

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
    document.documentElement.classList.toggle("high-contrast")
  }

  const toggleDyslexiaFont = () => {
    setDyslexiaFont(!dyslexiaFont)
    document.documentElement.classList.toggle("dyslexia-font")
  }

  const toggleScreenReaderMode = () => {
    setScreenReaderMode(!screenReaderMode)
    document.documentElement.classList.toggle("screen-reader-mode")
  }

  const togglePauseAnimations = () => {
    setPauseAnimations(!pauseAnimations)
    document.documentElement.classList.toggle("pause-animations")
  }

  const toggleFocusIndicator = () => {
    setFocusIndicator(!focusIndicator)
    document.documentElement.classList.toggle("enhanced-focus")
  }

  const toggleColorBlindMode = () => {
    setColorBlindMode(!colorBlindMode)
    document.documentElement.classList.toggle("color-blind-mode")
  }

  return (
    <>
      {/* Accessibility Button - Fixed bottom-left */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-[#4A00FF] p-0 shadow-lg hover:bg-[#4A00FF]/90"
        aria-label="Open Accessibility Toolbar"
        tabIndex={0}
      >
        <Accessibility className="h-6 w-6 text-white" />
      </Button>

      {/* Accessibility Toolbar Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 left-6 z-50 w-80 max-w-[calc(100vw-3rem)] border-2 border-[#4A00FF] bg-background p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Accessibility Options</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} aria-label="Close Accessibility Toolbar">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {/* Font Size Controls */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Font Size</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={decreaseFontSize} aria-label="Decrease font size">
                  A-
                </Button>
                <Button size="sm" variant="outline" onClick={resetFontSize} aria-label="Reset font size">
                  {fontSize}%
                </Button>
                <Button size="sm" variant="outline" onClick={increaseFontSize} aria-label="Increase font size">
                  A+
                </Button>
              </div>
            </div>

            {/* High Contrast Mode */}
            <button
              onClick={toggleHighContrast}
              className={`flex w-full items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted ${
                highContrast ? "bg-[#4A00FF]/10" : ""
              }`}
              aria-pressed={highContrast}
            >
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">High Contrast</span>
              </div>
              <div
                className={`h-5 w-5 rounded border-2 ${highContrast ? "border-[#4A00FF] bg-[#4A00FF]" : "border-border"}`}
              />
            </button>

            {/* Dyslexia-Friendly Font */}
            <button
              onClick={toggleDyslexiaFont}
              className={`flex w-full items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted ${
                dyslexiaFont ? "bg-[#4A00FF]/10" : ""
              }`}
              aria-pressed={dyslexiaFont}
            >
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dyslexia Font</span>
              </div>
              <div
                className={`h-5 w-5 rounded border-2 ${dyslexiaFont ? "border-[#4A00FF] bg-[#4A00FF]" : "border-border"}`}
              />
            </button>

            {/* Screen Reader Mode */}
            <button
              onClick={toggleScreenReaderMode}
              className={`flex w-full items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted ${
                screenReaderMode ? "bg-[#4A00FF]/10" : ""
              }`}
              aria-pressed={screenReaderMode}
            >
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Screen Reader</span>
              </div>
              <div
                className={`h-5 w-5 rounded border-2 ${screenReaderMode ? "border-[#4A00FF] bg-[#4A00FF]" : "border-border"}`}
              />
            </button>

            {/* Pause Animations */}
            <button
              onClick={togglePauseAnimations}
              className={`flex w-full items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted ${
                pauseAnimations ? "bg-[#4A00FF]/10" : ""
              }`}
              aria-pressed={pauseAnimations}
            >
              <div className="flex items-center gap-2">
                <Pause className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Pause Animations</span>
              </div>
              <div
                className={`h-5 w-5 rounded border-2 ${pauseAnimations ? "border-[#4A00FF] bg-[#4A00FF]" : "border-border"}`}
              />
            </button>

            {/* Enhanced Focus Indicator */}
            <button
              onClick={toggleFocusIndicator}
              className={`flex w-full items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted ${
                focusIndicator ? "bg-[#4A00FF]/10" : ""
              }`}
              aria-pressed={focusIndicator}
            >
              <div className="flex items-center gap-2">
                <Focus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Focus Indicator</span>
              </div>
              <div
                className={`h-5 w-5 rounded border-2 ${focusIndicator ? "border-[#4A00FF] bg-[#4A00FF]" : "border-border"}`}
              />
            </button>

            {/* Color-Blind Safe Mode */}
            <button
              onClick={toggleColorBlindMode}
              className={`flex w-full items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted ${
                colorBlindMode ? "bg-[#4A00FF]/10" : ""
              }`}
              aria-pressed={colorBlindMode}
            >
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Color-Blind Mode</span>
              </div>
              <div
                className={`h-5 w-5 rounded border-2 ${colorBlindMode ? "border-[#4A00FF] bg-[#4A00FF]" : "border-border"}`}
              />
            </button>
          </div>
        </Card>
      )}
    </>
  )
}
