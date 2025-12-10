"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, CheckCircle2, Ticket } from "lucide-react"

interface ConsultationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prefillData?: {
    name?: string
    email?: string
    phone?: string
  }
}

// Available time slots for scheduling
const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]

export function ConsultationDialog({ open, onOpenChange, prefillData }: ConsultationDialogProps) {
  const [step, setStep] = useState<"form" | "calendar" | "success">("form")
  const [loading, setLoading] = useState(false)
  const [ticketNumber, setTicketNumber] = useState<string>("")
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    if (prefillData && open) {
      setFormData({
        name: prefillData.name || "",
        email: prefillData.email || "",
        phone: prefillData.phone || "",
      })
      // If all data is prefilled, skip to calendar
      if (prefillData.name && prefillData.email && prefillData.phone) {
        setStep("calendar")
      }
    }
  }, [prefillData, open])

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, "")
    return digitsOnly.length >= 10
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "")

    // Format as (XXX) XXX-XXXX
    if (digitsOnly.length <= 3) {
      return digitsOnly
    } else if (digitsOnly.length <= 6) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
    } else {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, phone: formatted })
    if (errors.phone) {
      setErrors({ ...errors, phone: "" })
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits)"
    }

    setErrors(newErrors)

    // If no errors, proceed to calendar
    if (!newErrors.name && !newErrors.email && !newErrors.phone) {
      setStep("calendar")
    }
  }

  const handleScheduleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time for your consultation.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/schedule-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          time: selectedTime,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule consultation")
      }

      const data = await response.json()
      setTicketNumber(data.ticketNumber || "")

      setStep("success")
    } catch (error) {
      console.error("Error scheduling consultation:", error)
      toast({
        title: "Error",
        description: "Failed to schedule consultation. Please try again or call us at (949) 933-3821.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (step !== "success") {
      setStep("form")
      setFormData({ name: "", email: "", phone: "" })
      setErrors({ name: "", email: "", phone: "" })
      setSelectedDate(undefined)
      setSelectedTime("")
      setTicketNumber("")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Schedule Your Free Consultation</DialogTitle>
              <DialogDescription>
                Fill out your information below to schedule a free IT assessment with our team.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: "" })
                  }}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: "" })
                  }}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(949) 933-3821"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Continue to Calendar
                </Button>
              </div>
            </form>
          </>
        )}

        {step === "calendar" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Select Date & Time</DialogTitle>
              <DialogDescription>Choose your preferred date and time for the consultation.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Select Date
                </Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                  className="rounded-md border"
                />
              </div>

              {selectedDate && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select Time
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep("form")} className="flex-1">
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleScheduleSubmit}
                  disabled={!selectedDate || !selectedTime || loading}
                  className="flex-1"
                >
                  {loading ? "Scheduling..." : "Confirm Consultation"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <DialogTitle className="text-2xl text-center">Consultation Scheduled!</DialogTitle>
              <DialogDescription className="text-center">
                Thank you for scheduling with American Reliable Tech. We've sent confirmation emails to both you and our
                team.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-6">
              {ticketNumber && (
                <div className="bg-primary text-primary-foreground p-6 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Ticket className="h-5 w-5" />
                    <p className="text-sm font-medium">Your Ticket Number</p>
                  </div>
                  <p className="text-3xl font-bold tracking-wider">{ticketNumber}</p>
                  <p className="text-xs mt-2 opacity-90">Please save this for your records</p>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="font-semibold">Consultation Details:</p>
                {ticketNumber && (
                  <p className="text-sm">
                    <strong>Ticket:</strong> {ticketNumber}
                  </p>
                )}
                <p className="text-sm">
                  <strong>Date:</strong>{" "}
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm">
                  <strong>Time:</strong> {selectedTime}
                </p>
                <p className="text-sm">
                  <strong>Contact:</strong> {formData.email}
                </p>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                You'll receive a calendar invite shortly. If you need to reschedule, please call us at (949) 933-3821.
              </p>

              <Button
                onClick={() => {
                  setStep("form")
                  setFormData({ name: "", email: "", phone: "" })
                  setErrors({ name: "", email: "", phone: "" })
                  setSelectedDate(undefined)
                  setSelectedTime("")
                  setTicketNumber("")
                  onOpenChange(false)
                }}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
