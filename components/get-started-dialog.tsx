"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Ticket } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ConsultationDialog } from "@/components/consultation-dialog"

interface GetStartedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planName: string
  basePrice: number
  billingMode: "monthly" | "annual"
}

export function GetStartedDialog({ open, onOpenChange, planName, basePrice, billingMode }: GetStartedDialogProps) {
  const [step, setStep] = useState(1)
  const [deviceCount, setDeviceCount] = useState(5)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")
  const [consultationOpen, setConsultationOpen] = useState(false)
  const { toast } = useToast()

  const totalPrice = deviceCount * basePrice

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^[\d\s\-+()]+$/.test(phone) && phone.replace(/\D/g, "").length >= 10
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    }
  }

  const handleRequestService = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }
    if (!validatePhone(phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number (at least 10 digits)",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/request-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          planName,
          billingMode,
          quantity: deviceCount,
          basePrice,
          totalPrice,
          timestamp: new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        setTicketNumber(result.ticketNumber || "")
        setStep(3)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit request. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error submitting service request:", error)
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetDialog = () => {
    setStep(1)
    setDeviceCount(5)
    setName("")
    setEmail("")
    setPhone("")
    setTicketNumber("")
  }

  const handleScheduleAssessment = () => {
    onOpenChange(false)
    setConsultationOpen(true)
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange(open)
          if (!open) resetDialog()
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Get Started with {planName}</DialogTitle>
            <DialogDescription>
              {step === 1 && "Let's calculate your customized pricing"}
              {step === 2 && "Tell us about yourself"}
              {step === 3 && "Request submitted successfully!"}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Quantity & Total */}
          {step === 1 && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="devices" className="text-base font-semibold">
                  How many users/devices?
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeviceCount(Math.max(1, deviceCount - 1))}
                    aria-label="Decrease device count"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="devices"
                    type="number"
                    value={deviceCount}
                    onChange={(e) => setDeviceCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="text-center text-2xl font-bold"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeviceCount(deviceCount + 1)}
                    aria-label="Increase device count"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border-2 border-[#4A00FF] bg-[#4A00FF]/5 p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price per User:</span>
                    <span className="font-semibold">
                      ${basePrice}/{billingMode === "annual" ? "month (annual)" : "month"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Number of Users:</span>
                    <span className="font-semibold">{deviceCount}</span>
                  </div>
                  <div className="my-2 border-t border-border" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total {billingMode === "annual" ? "Monthly" : "Monthly"}:</span>
                    <span className="text-xl font-bold text-foreground">${totalPrice}</span>
                  </div>
                  {billingMode === "annual" && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm font-semibold">Annual Savings:</span>
                      <span className="text-sm font-bold">20% OFF</span>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleNext} className="w-full bg-[#4A00FF] hover:bg-[#4A00FF]/90">
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleRequestService}
                  className="flex-1 bg-[#4A00FF] hover:bg-[#4A00FF]/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request the Service"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success Message */}
          {step === 3 && (
            <div className="space-y-6 py-4">
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

              <div className="rounded-lg bg-green-50 border-2 border-green-500 p-6 text-center">
                <p className="text-lg font-semibold text-green-900 mb-2">Thank you, {name}!</p>
                <p className="text-green-800">Our sales team will reach out with a clear, comprehensive solution.</p>
                {ticketNumber && <p className="text-sm text-green-700 mt-2">Reference: {ticketNumber}</p>}
              </div>
              <Button onClick={handleScheduleAssessment} className="w-full bg-[#4A00FF] hover:bg-[#4A00FF]/90">
                Schedule Free Assessment
              </Button>
              <Button
                onClick={() => {
                  resetDialog()
                  onOpenChange(false)
                }}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConsultationDialog
        open={consultationOpen}
        onOpenChange={setConsultationOpen}
        prefillData={{ name, email, phone }}
      />
    </>
  )
}
