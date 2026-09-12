import Header from "./components/Header";
import Hero from "./components/Hero";
import MenuSection from "./components/MenuSection";
import WhyTenSection from "./components/WhyTenSection";
import Gallery from "./components/Gallery";
import LocationSection from "./components/LocationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import LaunchGate from "./components/LaunchGate";

export default function Home() {
  return (
    <LaunchGate>
      <Header />

      <main>
        <Hero />
        <MenuSection />
        <WhyTenSection />
        <Gallery />
        <LocationSection />
        <ContactSection />
      </main>

      <Footer />
    </LaunchGate>
  );
}
