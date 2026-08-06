import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Benefits from "@/components/benefits";
import CourseSection from "@/components/course-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Benefits />
      <CourseSection />
      <Footer />
    </main>
  );
}
