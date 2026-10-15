// Los tres espacios de Marcelo Chavan en Tucumán: contenido de cada página.
// Lo operativo (dueño y si vende online o a consulta) vive en la tabla
// `locales` de Supabase: la vidriera de cada local muestra los productos
// que carga la cuenta de su dueño. La historia es provisoria.

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
    historia: [
      'La Sede Central es el corazón de Marcelo Chavan: el espacio donde la tradición iniciada en 1957 sigue viva, pieza por pieza, en plena Galería Áncel.',
      'Aquí se reúnen la joyería de alta gama en oro 18K, las alianzas y la relojería suiza, con la atención personalizada que distingue a la casa desde siempre.',
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
    puntosRetiro: [
      { id: 'peatonal-mendoza', nombre: 'Peatonal Mendoza', direccion: 'Peatonal Mendoza 612, San Miguel de Tucumán' },
    ],
    horario: 'Lunes a sábados',
    historia: [
      'Sobre la Peatonal Mendoza, en el pulso del centro tucumano, este espacio acerca la joyería de todos los días y la relojería japonesa a quien pasa y a quien vuelve.',
      'Relojes Citizen y Casio, abridores y piezas pensadas para regalar, con el mismo cuidado y la misma confianza de siempre.',
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
    // Secciones principales que se muestran siempre, en este orden, aunque
    // todavía no tengan piezas (con 'Próximamente').
    seccionesDestacadas: ['plata-925', 'plata-925-dorada', 'acero', 'perlas'],
    puntosRetiro: [
      { id: 'galeria-ancel-9', nombre: 'Galería Áncel, Local 9', direccion: 'Muñecas 132, San Miguel de Tucumán' },
      { id: 'yerba-buena', nombre: 'Yerba Buena', direccion: 'Av. Aconquija 688, Local 7, Yerba Buena' },
    ],
    horario: 'Lunes a sábados',
    historia: [
      'Galería Áncel 9 es la casa de la platería fina de Marcelo Chavan: una línea dedicada por completo a la plata, con pulseras, pendientes, anillos y collares.',
      'Un espacio pensado para descubrir diseños con brillo propio y encontrar la pieza justa para cada historia.',
    ],
  },
]

// Envío a domicilio: costo fijo (el servidor es el que lo cobra) y zona.
export const COSTO_ENVIO = 10000
// Zona de envío a domicilio en San Miguel de Tucumán (incluye las direcciones
// sobre estas avenidas, no más allá).
export const ZONA_ENVIO = {
  limites: [
    { lado: 'Norte', avenidas: 'Av. Belgrano y Av. Sarmiento' },
    { lado: 'Sur', avenidas: 'Av. Roca' },
    { lado: 'Este', avenidas: 'Av. Soldati y Av. Brígido Terán' },
    { lado: 'Oeste', avenidas: 'Camino del Perú (límite hacia Yerba Buena)' },
  ],
  nota: 'Los envíos incluyen los domicilios ubicados sobre estas avenidas, pero no se extienden más allá de ellas.',
}

export function getLocal(slug) {
  return LOCALES.find((l) => l.slug === slug) || null
}

export function nombresDuenos(local) {
  const n = local.duenos.map((d) => d.nombre)
  return n.length > 1 ? `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}` : n[0]
}
