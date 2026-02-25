# 🔒 DevLocker API v1

API REST para guardar fragmentos de código (*snippets*) de forma segura y privada. Cada usuario solo puede ver y gestionar sus propios snippets, gracias a autenticación JWT y seguridad a nivel de datos.

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor y API REST |
| MongoDB + Mongoose | Base de datos y ODM |
| JSON Web Tokens (JWT) | Autenticación de sesiones |
| bcryptjs | Hash de contraseñas |
| express-validator | Validación de entradas |

## 📦 Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [MongoDB](https://www.mongodb.com/try/download/community) corriendo localmente (o una URI de MongoDB Atlas)

## 🚀 Cómo levantar el proyecto

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <url-del-repositorio>
cd mini-challenge
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (ya incluido como ejemplo):

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/devlocker
JWT_SECRET=devlocker_super_secret_key_2026
JWT_EXPIRES_IN=7d
```

> **Nota:** Si usas MongoDB Atlas, reemplaza `MONGO_URI` con tu connection string.

### 3. Iniciar el servidor

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

El servidor quedará disponible en: `http://localhost:3000`

---

## 📡 Endpoints

### 🔓 Autenticación (pública)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/auth/register` | Registrar un nuevo usuario |
| `POST` | `/api/v1/auth/login` | Iniciar sesión y obtener token |

#### Registrar usuario
```json
POST /api/v1/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Iniciar sesión
```json
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Ambos responden con:
```json
{
  "success": true,
  "token": "<JWT>",
  "user": { "id": "...", "username": "...", "email": "..." }
}
```

---

### 🔐 Snippets (requieren token JWT)

Todos los endpoints requieren el header:
```
Authorization: Bearer <token>
```

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/snippets` | Crear un snippet |
| `GET` | `/api/v1/snippets` | Listar mis snippets |
| `PUT` | `/api/v1/snippets/:id` | Editar un snippet (solo si soy el dueño) |
| `DELETE` | `/api/v1/snippets/:id` | Borrar un snippet (solo si soy el dueño) |

#### Crear snippet
```json
POST /api/v1/snippets
{
  "title": "Función suma",
  "language": "javascript",
  "code": "const sum = (a, b) => a + b;",
  "tags": ["utils", "math"]
}
```

---

## 🔒 Seguridad: El Muro de Privacidad

El sistema garantiza aislamiento total entre usuarios:

- El `userId` del dueño **nunca** se acepta desde el body del request — siempre se extrae del token JWT (`req.user._id`).
- Los endpoints de editar y borrar buscan por `{ _id: snippetId, user: req.user._id }`. Si el snippet pertenece a otro usuario, responde **404** (no revela que el recurso existe).

### 🔥 Prueba de Fuego

1. Registra **User A** y **User B**
2. Crea un snippet con el token de **User A** → guarda el `id`
3. Intenta borrarlo con el token de **User B**
4. ✅ Resultado esperado: `404 - Snippet no encontrado`

---

## 📂 Estructura del Proyecto

```
├── server.js                     # Punto de entrada
├── .env                          # Variables de entorno
├── package.json
└── src/
    ├── config/
    │   └── db.js                 # Conexión a MongoDB
    ├── models/
    │   ├── User.js               # Modelo usuario
    │   └── Snippet.js            # Modelo snippet (ref: 'User')
    ├── middleware/
    │   ├── auth.js               # Middleware JWT (protect)
    │   ├── errorHandler.js       # Manejador global de errores
    │   └── validators.js         # Reglas express-validator
    ├── controllers/
    │   ├── authController.js     # Lógica register/login
    │   └── snippetController.js  # Lógica CRUD snippets
    └── routes/
        ├── authRoutes.js         # Rutas públicas
        └── snippetRoutes.js      # Rutas protegidas
```

## ⚠️ Manejo de Errores

Todas las respuestas de error siguen el formato:
```json
{
  "success": false,
  "status": 400,
  "message": "Descripción del error"
}
```

| Código | Situación |
|--------|-----------|
| 400 | Validación fallida o datos incorrectos |
| 401 | Token ausente, inválido o expirado |
| 404 | Recurso no encontrado (o no pertenece al usuario) |
| 500 | Error interno del servidor |
