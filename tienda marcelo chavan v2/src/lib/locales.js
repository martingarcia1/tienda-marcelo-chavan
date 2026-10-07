// Los tres espacios de Marcelo Chavan en Tucumán.
//
// Vidriera: para la presentación, cada local muestra los productos de ciertas
// ramas del catálogo real (por rubro). Cuando se ponga en marcha, se puede
// pasar a "lo que carga el dueño de cada local" desde el panel.
//
// modo: 'vidriera' → solo para mirar, cada pieza se consulta por WhatsApp.
//       'demo'     → carrito de demostración (no cobra nada); en la versión
//                    final cada local tendría su propia pasarela de pago.
//
// La historia de cada local es provisoria hasta tener el relato real.

export const LOCALES = [
  {
    slug: 'sede-central',
    numero: 'I',
    nombre: 'Sede Central',
    rubro: 'Joyería de alta gama · Relojería suiza',
    duenos: [
      { nombre: 'Miguel Siufi', rol: 'Al frente de la Sede Central' },
      { nombre: 'Ely Siufi', rol: 'Al frente de la Sede Central' },
    ],
    direccion: 'Muñecas 136, Galería Áncel, Local 11',
    ciudad: 'San Miguel de Tucumán',
    mapsQuery: 'Joyería Marcelo Chavan, Muñecas 136, San Miguel de Tucumán',
    horario: 'Lunes a sábados',
    modo: 'vidriera',
    historia: [
      'La Sede Central es el corazón de Marcelo Chavan: el espacio donde la tradición iniciada en 1957 sigue viva, pieza por pieza, en plena Galería Áncel.',
      'Aquí se reúnen la joyería de alta gama en oro 18K, las alianzas y la relojería suiza, con la atención personalizada que distingue a la casa desde siempre.',
    ],
    secciones: [
      { slug: 'oro', label: 'Oro' },
      { slug: 'alianzas-oro', label: 'Alianzas de oro' },
      { slug: 'alianzas-plata-y-oro', label: 'Alianzas plata y oro' },
      { slug: 'relojeria-tissot', label: 'Tissot' },
      { slug: 'relojeria-festina', label: 'Festina' },
      { slug: 'relojeria-alta-gama', label: 'Alta gama' },
    ],
  },
  {
    slug: 'peatonal-mendoza',
    numero: 'II',
    nombre: 'Peatonal Mendoza',
    rubro: 'Joyería general · Relojería japonesa',
    duenos: [
      { nombre: 'Esteban Siufi', rol: 'Al frente de Peatonal Mendoza' },
    ],
    direccion: 'Peatonal Mendoza 612',
    ciudad: 'San Miguel de Tucumán',
    mapsQuery: 'Peatonal Mendoza 612, San Miguel de Tucumán',
    horario: 'Lunes a sábados',
    modo: 'demo',
    historia: [
      'Sobre la Peatonal Mendoza, en el pulso del centro tucumano, este espacio acerca la joyería de todos los días y la relojería japonesa a quien pasa y a quien vuelve.',
      'Relojes Citizen y Casio, abridores y piezas pensadas para regalar, con el mismo cuidado y la misma confianza de siempre.',
    ],
    secciones: [
      { slug: 'relojeria-citizen', label: 'Citizen' },
      { slug: 'relojeria-casio', label: 'Casio' },
      { slug: 'abridores-oro', label: 'Abridores' },
      { slug: 'acero', label: 'Acero' },
    ],
  },
  {
    slug: 'galeria-ancel-9',
    numero: 'III',
    nombre: 'Galería Áncel 9',
    rubro: 'Platería fina',
    duenos: [
      { nombre: 'Marcela Siufi', rol: 'Al frente de Galería Áncel 9' },
    ],
    direccion: 'Muñecas 132, Galería Áncel, Local 9',
    ciudad: 'San Miguel de Tucumán',
    mapsQuery: 'Galería Áncel Local 9, Muñecas 132, San Miguel de Tucumán',
    horario: 'Lunes a sábados',
    modo: 'demo',
    historia: [
      'Galería Áncel 9 es la casa de la platería fina de Marcelo Chavan: una línea dedicada por completo a la plata, con pulseras, pendientes, anillos y collares.',
      'Un espacio pensado para descubrir diseños con brillo propio y encontrar la pieza justa para cada historia.',
    ],
    secciones: [
      { slug: 'plata', label: 'Plata' },
      { slug: 'alianzas-plata', label: 'Alianzas de plata' },
      { slug: 'abridores-plata', label: 'Abridores' },
    ],
  },
]

export function getLocal(slug) {
  return LOCALES.find((l) => l.slug === slug) || null
}

export function nombresDuenos(local) {
  const n = local.duenos.map((d) => d.nombre)
  return n.length > 1 ? `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}` : n[0]
}
