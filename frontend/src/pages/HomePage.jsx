import AnnouncementBar from '../components/layout/AnnouncementBar'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../sections/Hero/HeroSection'
import AboutSection from '../sections/About/AboutSection'
import ProductsSection from '../sections/Products/ProductsSection'
import Footer from '../components/layout/Footer'

export default function HomePage() {
  return (
    <>
      {/* Header sticky (announcement + navbar pegados juntos) */}
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main>
        <HeroSection />
        <AboutSection />
        <ProductsSection />
      </main>

      <Footer />
    </>
  )
}
