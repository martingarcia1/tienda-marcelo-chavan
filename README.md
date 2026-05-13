# Documentación Técnica - Marcelo Chavan Plata

## 📋 Índice
1. [Stack Tecnológico](#stack-tecnológico)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Sistema de Diseño](#sistema-de-diseño)
5. [Componentes](#componentes)
6. [Animaciones](#animaciones)
7. [Características Principales](#características-principales)

---

## Stack Tecnológico

### Core
- **React 18.3.1** - Librería principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS 4.1** - Framework de estilos

### Dependencias Principales
```json
{
  "@radix-ui/react-dialog": "1.1.6",
  "@radix-ui/react-accordion": "1.2.3",
  "@radix-ui/react-avatar": "1.1.3",
  "motion": "12.23.24",
  "lucide-react": "0.487.0",
  "react-hook-form": "7.55.0"
}
```

### UI Components (Radix UI)
- Dialog, Dropdown Menu, Popover
- Accordion, Tabs, Tooltip
- Button, Card, Input, Label
- Avatar, Badge, Separator

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── App.tsx                    # Componente principal
│   └── components/
│       ├── Header.tsx             # Navegación sticky
│       ├── Hero.tsx               # Banner principal
│       ├── Collections.tsx        # Sección de colecciones
│       ├── EmotionalSection.tsx   # Valores de marca
│       ├── Ring3D.tsx             # Animación 3D del anillo
│       ├── FeaturedProducts.tsx   # Productos destacados
│       ├── VideoGallery.tsx       # Galería de videos
│       ├── BrandStory.tsx         # Historia de la marca
│       ├── Newsletter.tsx         # Suscripción newsletter
│       ├── Footer.tsx             # Footer con WhatsApp flotante
│       ├── figma/
│       │   └── ImageWithFallback.tsx
│       └── ui/                    # Componentes UI base (Radix)
│           ├── button.tsx
│           ├── card.tsx
│           ├── dialog.tsx
│           ├── input.tsx
│           └── ...
└── styles/
    ├── index.css
    ├── theme.css              # Variables CSS y tema
    ├── fonts.css              # Importación de fuentes
    ├── globals.css            # Estilos globales
    └── tailwind.css
```

---

## Instalación y Configuración

### 1. Crear proyecto con Vite
```bash
npm create vite@latest marcelo-chavan-plata -- --template react-ts
cd marcelo-chavan-plata
```

### 2. Instalar dependencias principales
```bash
npm install react react-dom
npm install -D @vitejs/plugin-react vite typescript
```

### 3. Instalar Tailwind CSS 4.1
```bash
npm install -D tailwindcss@4.1.12 @tailwindcss/vite@4.1.12
npm install tailwind-merge class-variance-authority clsx
```

### 4. Instalar Radix UI
```bash
npm install @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-popover \
  @radix-ui/react-tooltip \
  @radix-ui/react-accordion \
  @radix-ui/react-tabs \
  @radix-ui/react-avatar \
  @radix-ui/react-separator \
  @radix-ui/react-label \
  @radix-ui/react-slot
```

### 5. Instalar Motion (Framer Motion)
```bash
npm install motion@12.23.24
```

### 6. Instalar Lucide React (iconos)
```bash
npm install lucide-react@0.487.0
```

### 7. Instalar React Hook Form
```bash
npm install react-hook-form@7.55.0
```

---

## Sistema de Diseño

### Paleta de Colores

#### Variables CSS (theme.css)
```css
:root {
  /* Colores Base */
  --background: #fdfcfa;           /* Blanco cálido */
  --foreground: #3d3d3d;           /* Gris oscuro texto */
  
  /* Colores Premium */
  --primary: #c9a961;              /* Dorado champagne */
  --primary-foreground: #ffffff;
  
  /* Colores Secundarios */
  --secondary: #e8e5e0;            /* Gris perla */
  --muted: #f5f3f0;                /* Fondo suave */
  --muted-foreground: #8a8a8a;     /* Texto secundario */
  
  /* Colores Personalizados */
  --wood-light: #d4c5b0;           /* Madera clara */
  --pearl-gray: #e8e5e0;           /* Gris perla */
  --champagne-gold: #c9a961;       /* Dorado champagne */
  
  /* Otros */
  --card: #ffffff;
  --border: rgba(0, 0, 0, 0.08);
  --radius: 0.25rem;
}
```

#### Uso en Tailwind
```jsx
// Fondo principal
<div className="bg-background">

// Color primario (dorado)
<Button className="bg-primary text-primary-foreground">

// Color secundario (gris perla)
<section className="bg-secondary/30">

// Borde sutil
<Card className="border border-border">
```

### Tipografía

#### Fuentes
```css
/* fonts.css */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --font-serif: 'Cormorant Garamond', serif;  /* Títulos elegantes */
  --font-sans: 'Inter', sans-serif;            /* Texto general */
}

body {
  font-family: var(--font-sans);
}

h1, h2, h3 {
  font-family: var(--font-serif);
}
```

#### Tamaños y Pesos
- **Títulos H1**: 48-72px, weight 300 (light)
- **Títulos H2**: 36-48px, weight 400
- **Títulos H3**: 24-32px, weight 500
- **Texto body**: 16px, weight 400
- **Texto secundario**: 14px, weight 400

---

## Componentes

### 1. Header (Sticky Navigation)
**Archivo**: `Header.tsx`

**Características**:
- Navegación sticky con backdrop blur
- Logo centrado
- Links de navegación (desktop)
- Iconos de búsqueda y carrito
- Hamburger menu (mobile)

**Props**: Ninguna

```tsx
<Header />
```

---

### 2. Hero (Banner Principal)
**Archivo**: `Hero.tsx`

**Características**:
- Imagen de fondo con overlay gradiente
- Título principal con tipografía serif
- Subtítulo descriptivo
- Dos CTAs (primario y secundario)
- Altura: 85vh

**Props**: Ninguna

```tsx
<Hero />
```

---

### 3. Collections (Colecciones)
**Archivo**: `Collections.tsx`

**Características**:
- Grid responsive (1-2-3 columnas)
- Cards con hover effect (escala imagen)
- Overlay con gradiente al hover
- 5 colecciones: Anillos, Pulseras, Cadenas, Dijes, Aros

**Datos**:
```tsx
const collections = [
  {
    title: "Anillos",
    image: "url",
    description: "Diseños únicos para cada ocasión"
  },
  // ...
];
```

---

### 4. EmotionalSection (Valores)
**Archivo**: `EmotionalSection.tsx`

**Características**:
- Grid de 3 columnas (responsive)
- Iconos con fondo circular
- Título y descripción por valor
- Fondo con gradiente sutil

**Valores**:
1. **Joyas para Recordar** (Heart icon)
2. **Joyas para Regalar** (Gift icon)
3. **Plata con Identidad Tucumana** (Sparkles icon)

---

### 5. Ring3D (Animación 3D)
**Archivo**: `Ring3D.tsx`

**Características**:
- Anillo 3D interactivo con Motion
- Responde al movimiento del mouse
- Rotación automática continua
- Piedra central con efecto pulsante
- Partículas flotantes animadas
- 8 detalles dorados decorativos

**Efectos**:
```tsx
// Seguimiento del mouse
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

// Rotación basada en mouse
animate={{
  rotateY: mousePosition.x,
  rotateX: -mousePosition.y,
}}

// Rotación automática
animate={{
  rotateZ: [0, 360],
}}
transition={{
  duration: 20,
  repeat: Infinity,
  ease: "linear",
}}
```

**Estilos del anillo**:
- Círculo exterior: Gradiente plateado con sombras
- Círculo interior: Hueco con sombra inset
- Piedra central: Gradiente dorado con brillo
- Detalles: 8 puntos dorados giratorios

---

### 6. FeaturedProducts (Productos Destacados)
**Archivo**: `FeaturedProducts.tsx`

**Características**:
- Grid de 4 columnas (responsive)
- Tags de producto (Nuevo, Popular, Destacado)
- Precio en color dorado
- Botón "Consultar" con hover effect

**Estructura de datos**:
```tsx
const products = [
  {
    name: "Anillo Minimalista",
    price: "$45.000",
    image: "url",
    tag: "Nuevo"
  },
  // ...
];
```

---

### 7. VideoGallery (Galería de Videos)
**Archivo**: `VideoGallery.tsx`

**Características**:
- Grid de 4 columnas (responsive)
- Thumbnails con botón play overlay
- Duración del video en esquina
- Modal con Dialog de Radix UI
- Iframe de YouTube embebido

**Estructura de datos**:
```tsx
const videos = [
  {
    id: 1,
    title: "Proceso Artesanal",
    description: "Mirá cómo transformamos la plata en arte",
    thumbnail: "url",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    duration: "2:45"
  },
  // ...
];
```

**Accessibility**:
```tsx
<Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
  <DialogContent>
    <DialogTitle className="sr-only">{video.title}</DialogTitle>
    <DialogDescription className="sr-only">{video.description}</DialogDescription>
    <iframe src={videoUrl} title={title} />
  </DialogContent>
</Dialog>
```

---

### 8. BrandStory (Historia de Marca)
**Archivo**: `BrandStory.tsx`

**Características**:
- Layout de 2 columnas (imagen + texto)
- Imagen con gradiente overlay
- Badge "NUESTRA HISTORIA"
- 3 párrafos descriptivos
- Firma del maestro platero

---

### 9. Newsletter
**Archivo**: `Newsletter.tsx`

**Características**:
- Fondo con color primario (dorado)
- Form con input + botón
- Validación de email (React Hook Form)
- Texto de privacidad

```tsx
<form className="flex gap-3">
  <Input type="email" placeholder="Tu correo electrónico" />
  <Button type="submit">Suscribirme</Button>
</form>
```

---

### 10. Footer
**Archivo**: `Footer.tsx`

**Características**:
- Fondo oscuro (foreground color)
- 4 columnas: Marca, Navegación, Colecciones, Contacto
- Redes sociales con iconos
- WhatsApp flotante (fixed bottom-right)
- Copyright

**WhatsApp Flotante**:
```tsx
const whatsappNumber = "5493815123456";
const whatsappMessage = encodeURIComponent("Hola! Me gustaría consultar...");

<a
  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
  className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366]"
>
  <MessageCircle />
</a>
```

---

## Animaciones

### Motion (Framer Motion)

#### 1. Ring3D - Rotación con seguimiento de mouse
```tsx
import { motion } from "motion/react";

<motion.div
  style={{ perspective: "1000px" }}
  animate={{
    rotateY: mousePosition.x,
    rotateX: -mousePosition.y,
  }}
  transition={{
    type: "spring",
    stiffness: 50,
    damping: 20,
  }}
>
```

#### 2. Ring3D - Rotación automática
```tsx
<motion.div
  animate={{
    rotateZ: [0, 360],
  }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  }}
>
```

#### 3. Ring3D - Piedra pulsante
```tsx
<motion.div
  animate={{
    scale: [1, 1.1, 1],
    boxShadow: [
      "0 10px 30px rgba(201, 169, 97, 0.5)",
      "0 15px 40px rgba(201, 169, 97, 0.8)",
      "0 10px 30px rgba(201, 169, 97, 0.5)",
    ],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>
```

#### 4. Ring3D - Partículas flotantes
```tsx
{[...Array(6)].map((_, i) => (
  <motion.div
    key={i}
    animate={{
      x: [0, Math.cos(i * 60 * Math.PI / 180) * 150],
      y: [0, Math.sin(i * 60 * Math.PI / 180) * 150],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay: i * 0.5,
      ease: "easeOut",
    }}
  />
))}
```

### Tailwind CSS Transitions

#### Hover Effects
```tsx
// Escala de imagen
className="group-hover:scale-105 transition-transform duration-500"

// Overlay gradiente
className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"

// Sombra elevada
className="hover:shadow-xl transition-all duration-300"

// Botón con escala
className="hover:scale-110 transition-all duration-300"
```

---

## Características Principales

### 1. Responsive Design
- **Mobile First**: Diseño adaptable desde 320px
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

### 2. Performance
- **Lazy Loading**: Imágenes con loading="lazy"
- **Image Optimization**: Unsplash CDN con parámetros
- **Code Splitting**: Componentes divididos
- **Memoization**: Componentes optimizados

### 3. Accessibility (a11y)
- **ARIA Labels**: Todos los botones e iconos
- **Dialog Accessibility**: DialogTitle y DialogDescription
- **Keyboard Navigation**: Soporte completo
- **Screen Reader**: sr-only classes

### 4. SEO
- **Semantic HTML**: header, main, section, footer
- **Alt Text**: Todas las imágenes
- **Meta Tags**: Título y descripción
- **Structured Data**: Schema.org

### 5. Smooth Scroll
```css
/* globals.css */
* {
  scroll-behavior: smooth;
}

html {
  scroll-padding-top: 4rem; /* Header height */
}
```

---

## Configuración de Vite

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

---

## Tailwind CSS Configuration

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        card: 'var(--card)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
```

---

## Scripts Package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## Imágenes y Assets

### Fuente de Imágenes
- **Unsplash API**: Todas las imágenes de joyas
- **Parámetros optimizados**:
  - `crop=entropy`
  - `cs=tinysrgb`
  - `fit=max`
  - `fm=jpg`
  - `q=80`
  - `w=600/800/1080` según uso

### Componente ImageWithFallback
```tsx
<ImageWithFallback
  src="url"
  alt="descripción"
  className="w-full h-full object-cover"
/>
```

---

## Integración de WhatsApp

### Configuración
```tsx
const whatsappNumber = "5493815123456"; // +54 9 381 512-3456
const whatsappMessage = encodeURIComponent(
  "Hola! Me gustaría consultar sobre sus joyas en plata."
);

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
```

### Botón Flotante
- **Posición**: Fixed bottom-6 right-6
- **Z-index**: 50 (sobre todo el contenido)
- **Color**: #25D366 (verde WhatsApp oficial)
- **Hover**: Escala 1.1 + sombra elevada

---

## Deploy

### Recomendaciones de Hosting
1. **Vercel** (recomendado para React + Vite)
2. **Netlify**
3. **GitHub Pages**
4. **Railway**

### Build para producción
```bash
npm run build
```

Genera carpeta `dist/` lista para deploy.

---

## Próximas Mejoras Sugeridas

### Backend (opcional)
- **Base de datos**: PostgreSQL / MongoDB
- **CMS**: Strapi / Contentful
- **E-commerce**: Integrar carrito y checkout
- **Auth**: Login de usuarios

### Features
- [ ] Carrito de compras funcional
- [ ] Sistema de favoritos
- [ ] Búsqueda de productos con filtros
- [ ] Zoom en imágenes de productos
- [ ] Galería lightbox
- [ ] Reviews y testimonios
- [ ] Blog de cuidado de joyas
- [ ] Comparador de productos
- [ ] Sistema de tallas para anillos

### Optimizaciones
- [ ] Añadir sitemap.xml
- [ ] Implementar robots.txt
- [ ] PWA (Progressive Web App)
- [ ] Dark mode toggle
- [ ] Internacionalización (i18n)
- [ ] Analytics (Google Analytics / Plausible)
- [ ] Error boundaries
- [ ] Loading states mejorados

---

## Contacto y Soporte

Para preguntas sobre implementación:
- **Documentación React**: https://react.dev
- **Documentación Tailwind CSS**: https://tailwindcss.com
- **Documentación Radix UI**: https://radix-ui.com
- **Documentación Motion**: https://motion.dev

---

## Licencia

Este proyecto es de código propietario para **Marcelo Chavan Plata**.

---

**Última actualización**: Mayo 2026
**Versión**: 1.0.0
