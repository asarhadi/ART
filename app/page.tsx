import HeroSection from "@/components/hero-section"
import ServiceOverview from "@/components/service-overview"
import Differentiators from "@/components/differentiators"
import IndustriesServed from "@/components/industries-served"
import CTA from "@/components/cta-section"
import Footer from "@/components/footer"
import AnimatedITCharacter from "@/components/animated-it-character"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ServiceOverview />
      <Differentiators />
      <IndustriesServed />
      <CTA />
      <Footer />
      <AnimatedITCharacter />
    </main>
  )
}
