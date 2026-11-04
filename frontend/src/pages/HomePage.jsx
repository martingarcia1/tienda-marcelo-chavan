import Hero from '../sections/Hero'
import Novedades from '../sections/Novedades'
import Historia from '../sections/Historia'
import Espacios from '../sections/Espacios'
import PagosMarcas from '../sections/PagosMarcas'
import { useDocumentTitle } from '../lib/hooks'

export default function HomePage() {
  useDocumentTitle(null)
  return (
    <>
      <Hero />
      <Novedades />
      <Historia />
      <Espacios />
      <PagosMarcas />
    </>
  )
}
