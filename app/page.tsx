import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import RecommendationBanner from "@/components/recommendation-banner";
import Benefits from "@/components/benefits";
import CourseSection from "@/components/course-section";
import Footer from "@/components/footer";
import OnboardingDialog from "@/components/onboarding-dialog";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <RecommendationBanner />
      <Benefits />
      <CourseSection />
      <Footer />
      <OnboardingDialog />
    </main>
  );
}
