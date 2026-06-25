# Tienda Marcelo Chavan — E-Commerce de Joyería de Platería

**Tucumán, Argentina** · Stack: React + Vite · C# ASP.NET Core 8 · MySQL 8

---

## Estructura del Proyecto

```
tienda marcelo chavan/
├── frontend/               ← React 19 + Vite 8
├── backend/
│   └── MarceloChavan.API/  ← ASP.NET Core 8 Web API
└── db/
    └── docker-compose.yml  ← MySQL 8 + phpMyAdmin
```

---

## Setup Rápido

### 1. Base de Datos (Docker)

```bash
cd db
docker compose up -d
```

- **MySQL** en `localhost:3306`
- **phpMyAdmin** en `http://localhost:8080`

### 2. Backend (C# / .NET 8)

```bash
cd backend/MarceloChavan.API

# Restaurar paquetes
dotnet restore

# Aplicar migraciones (la primera vez)
dotnet ef database update

# Correr el servidor
dotnet run
```

- **API** en `http://localhost:5000`
- **Swagger** en `http://localhost:5000/swagger`

### 3. Frontend (React + Vite)

```bash
cd frontend

# Instalar dependencias
npm install

# Correr el dev server
npm run dev
```

- **App** en `http://localhost:5173`

---

## Variables de Entorno

### Frontend (`/frontend/.env`)
```
VITE_API_URL=http://localhost:5000
VITE_MP_PUBLIC_KEY=TU_PUBLIC_KEY_DE_MERCADOPAGO
```

### Backend (`/backend/MarceloChavan.API/appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=marcelo_chavan;User=mcuser;Password=mcpassword;"
  },
  "JwtSettings": {
    "SecretKey": "CAMBIAR_EN_PRODUCCION_...",
    "ExpirationHours": 24
  },
  "MercadoPago": {
    "AccessToken": "TU_ACCESS_TOKEN_DE_MERCADOPAGO",
    "PublicKey": "TU_PUBLIC_KEY_DE_MERCADOPAGO"
  }
}
```

---

## Módulos

| Módulo | Estado |
|--------|--------|
| Landing page | 🔧 En desarrollo |
| Catálogo de productos | 🔧 En desarrollo |
| Carrito de compras | 🔧 En desarrollo |
| Checkout + MercadoPago | 🔧 En desarrollo |
| Panel Admin | 🔧 En desarrollo |
| Reseñas y calificaciones | 🔧 En desarrollo |
| Blog / Novedades | 🔧 En desarrollo |
| Autenticación JWT | ✅ Listo |

---

## Tecnologías

- **Frontend**: React 19, Vite 8, React Router 7, Zustand, Axios
- **Backend**: ASP.NET Core 8, Entity Framework Core, Pomelo.MySQL
- **Auth**: JWT Bearer Tokens, BCrypt
- **Pagos**: MercadoPago .NET SDK
- **DB**: MySQL 8
- **Dev Tools**: Docker Compose, phpMyAdmin, Swagger

---

## Comandos Útiles

```bash
# Crear primera migración EF Core (backend)
dotnet ef migrations add InitialCreate

# Actualizar base de datos
dotnet ef database update

# Instalar herramienta EF (si no la tenés)
dotnet tool install --global dotnet-ef
```
