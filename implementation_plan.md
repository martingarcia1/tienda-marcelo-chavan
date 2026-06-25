# Plan de Implementación — Sitio Web Marcelo Chavan
## Basado en requerimientos visuales del cliente

---

## Análisis de Referencias

El cliente compartió 5 referencias que definen claramente el estilo deseado:

| Referencia | Estilo clave |
|-----------|-------------|
| BRUNA | Navbar multi-categoría, hero slider full-width, product grid con badges |
| OMG Accessories | Hero editorial close-up, sección newest collection, shop by category |
| **Paleta de colores** | **Navy · Gold · Aqua · Teal · Sand** (definida por el cliente) |
| ALUKAS & CO | Barra de anuncio, banners de colecciones 3-col, categorías circulares |
| LUNESSÉ | Estilo premium crema/blanco, tipografía serif, galería editorial |

---

## Paleta de Colores (Exacta del Cliente)

| Color | Hex | Uso |
|-------|-----|-----|
| Navy | `#083A4F` | Navbar, footer, textos principales |
| Gold | `#A58D66` | Acentos, CTAs, precios, detalles |
| Aqua | `#C0D5D6` | Fondos de secciones alternadas, hovers |
| Teal | `#407E8C` | Botones secundarios, badges, links |
| Sand | `#E5E1DD` | Background base, cards, secciones claras |

> [!IMPORTANT]
> El cliente eligió un **light mode** (fondo claro/sand) — diferente al dark mode que teníamos. Se rediseñará el sistema CSS completo.

---

## Estructura de la Landing Page (HomePage)

### Sección 1: Barra de Anuncio Superior
- Fondo Navy, texto dorado
- Texto: "Envíos a todo el país · Joyería artesanal en plata 925 · Tucumán, Argentina"

### Sección 2: Navbar
- Logo "Marcelo Chavan" en tipografía serif (Playfair Display)
- Links: Inicio · Tienda · Colecciones · Blog · Contacto
- Iconos: Búsqueda, Wishlist, Carrito con badge
- Fondo blanco con borde bottom sutil

### Sección 3: Hero (Full-width)
- Imagen editorial close-up de joyería (generada con IA)
- Overlay con texto: colección destacada + CTA "Ver Colección"
- Slider con 2-3 slides

### Sección 4: Categorías Visuales (Grid editorial)
- 4 categorías: Anillos · Collares · Pulseras · Aros
- Imágenes editoriales con overlay de nombre
- Estilo: BRUNA / LUNESSÉ (photos full bleed)

### Sección 5: Destacados / Best Sellers
- Título "Más Vendidos"
- Grid 4 columnas de productos
- Cards con badge (Nuevo, Destacado), precio en gold, hover con quick-add

### Sección 6: Banner Editorial (Feature)
- Split layout: imagen izquierda + texto derecha
- "Plata artesanal de Tucumán" — historia de la marca
- CTA "Nuestra Historia"

### Sección 7: Nueva Colección
- Grid 3 columnas de productos recientes
- Encabezado con arrow "Ver todo →"

### Sección 8: Testimonio / Reseñas
- Carousel de reseñas de clientes

### Sección 9: Newsletter
- Fondo Aqua/Sand, formulario de email

### Footer
- Columnas: Tienda | Info | Contacto | Redes
- Fondo Navy, textos Sand/Aqua

---

## Cambios al Sistema de Diseño

### CSS (`index.css`)
- **Cambio de dark mode a light mode**
- Nueva paleta: Navy, Gold, Aqua, Teal, Sand
- Mantener Playfair Display (headings) + Inter (UI)
- Fondo base: `#E5E1DD` (Sand) / `#FFFFFF` (blanco)
- Texto principal: `#083A4F` (Navy)

### Tipografía
- Agregar **Cormorant Garamond** como alternativa serif más elegante para el hero

---

## Plan de Desarrollo por Fases

### Fase A: Rediseño del Design System CSS
- Actualizar tokens de color en `index.css`
- Componentes base: botones, cards, badges, inputs

### Fase B: Navbar + Announcement Bar
- Barra navy superior con texto de anuncio animado
- Navbar sticky con categorías y iconos

### Fase C: Landing Page Completa (HomePage)
- Todas las secciones descritas arriba
- Imágenes generadas con IA para hero y categorías

### Fase D: Página de Tienda (StorePage)
- Sidebar de filtros (categoría, material, precio)
- Grid de productos responsive
- Paginación

### Fase E: Footer
- Rediseño con paleta Navy

---

## Open Questions

> [!NOTE]
> **¿Tenés fotos reales de las joyas de Marcelo Chavan?** Si las tenés, las usamos. Si no, genero imágenes de referencia con IA para placeholder.

> [!NOTE]
> **¿Tenés logo del negocio?** Si no, puedo diseñar uno con tipografía Playfair Display + un ícono de platería.

> [!NOTE]
> **¿El sitio es en español argentino (vos/tu)?** Asumo español con "vos" para los CTAs.

---

## Verificación
Después de cada fase:
1. Correr `npm run dev` y verificar en el browser
2. Captura de pantalla para confirmar el diseño
