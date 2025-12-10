"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Store OTPs in memory (in production, use Redis or a database)
const otpStore = new Map<string, { code: string; expires: number }>()

export async function sendOTP(phone: string, email: string) {
  try {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP with 5-minute expiration
    otpStore.set(phone, {
      code,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    })

    // Send OTP via email (since we don't have SMS service configured)
    // In production, you would use Twilio or similar for SMS
    await resend.emails.send({
      from: "ART Support <noreply@americanreliabletech.com>",
      to: email,
      subject: "Your ART Support Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Verification Code</h2>
          <p>Your verification code for ART Support is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code will expire in 5 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending OTP:", error)
    return { success: false, message: "Failed to send verification code" }
  }
}

export async function verifyOTP(phone: string, code: string) {
  const stored = otpStore.get(phone)

  if (!stored) {
    return { success: false, message: "No verification code found. Please request a new one." }
  }

  if (Date.now() > stored.expires) {
    otpStore.delete(phone)
    return { success: false, message: "Verification code expired. Please request a new one." }
  }

  if (stored.code !== code) {
    return { success: false, message: "Invalid verification code. Please try again." }
  }

  // OTP verified successfully, remove it
  otpStore.delete(phone)
  return { success: true }
}
