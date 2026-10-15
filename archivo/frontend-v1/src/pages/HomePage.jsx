import HeroSection from '../sections/Hero/HeroSection'
import AboutSection from '../sections/About/AboutSection'
import CategoryCoversSection from '../sections/Products/CategoryCoversSection'
import { useDocumentTitle } from '../hooks/useCatalog'

export default function HomePage() {
  useDocumentTitle(null)

  return (
    <>
      <HeroSection />
      <AboutSection />
      <CategoryCoversSection />
    </>
  )
}
