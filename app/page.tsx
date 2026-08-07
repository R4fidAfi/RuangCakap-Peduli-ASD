import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Makna from "@/components/makna";
import Benefits from "@/components/benefits";
import HowItWorks from "@/components/how-it-works";
import ClosingCta from "@/components/closing-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Makna />
      <Benefits />
      <HowItWorks />
      <ClosingCta />
      <Footer />
    </main>
  );
}
