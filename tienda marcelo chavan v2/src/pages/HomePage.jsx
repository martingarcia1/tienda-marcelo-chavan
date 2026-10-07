import Hero from '../sections/Hero'
import Historia from '../sections/Historia'
import Espacios from '../sections/Espacios'
import PagosMarcas from '../sections/PagosMarcas'
import { useDocumentTitle } from '../lib/hooks'

export default function HomePage() {
  useDocumentTitle(null)
  return (
    <>
      <Hero />
      <Historia />
      <Espacios />
      <PagosMarcas />
    </>
  )
}
