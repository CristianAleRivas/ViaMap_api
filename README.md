# ViaMap API - Backend

API REST para el sistema de seguimiento en tiempo real de procesiones religiosas. Desarrollado con Node.js, Express y Firebase Firestore.

## 📋 Requisitos Previos

- **Node.js**: v22.16.0 o superior
- **npm**: v10 o superior
- **Firebase Project**: Cuenta de Firebase con Firestore habilitado
- **Git**: Para clonar el repositorio

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/CristianAleRivas/ViaMap_api.git
cd ViaMap_api
```

### 2. Cambiar a la rama de desarrollo

```bash
git checkout feature/backend
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Solicitar credenciales

Contacta al equipo de ViaMap para obtener:
- Archivo `.env`
- Archivo `serviceAccountKey.json`

Estos archivos contienen las credenciales de Firebase y configuración del proyecto.

### 5. Configurar variables de entorno

**El equipo de ViaMap te proporcionará:**
- Archivo `.env` con las variables de entorno configuradas
- Archivo `serviceAccountKey.json` con las credenciales de Firebase

Coloca ambos archivos en la raíz del proyecto (mismo nivel que `package.json`).

⚠️ **IMPORTANTE**: Estos archivos contienen información sensible y NO deben compartirse públicamente.

### 6. Verificar configuración

Una vez que tengas los archivos `.env` y `serviceAccountKey.json` en su lugar, la estructura de tu proyecto debe verse así:

```
viaMap_api/
├── .env                      ✅ Proporcionado por ViaMap
├── serviceAccountKey.json    ✅ Proporcionado por ViaMap
├── package.json
├── README.md
└── src/
    └── ...
```

## 🏃‍♂️ Ejecutar el Proyecto

### Modo Desarrollo (con auto-restart)

```bash
npm run dev
```

El servidor se iniciará en: `http://localhost:4000`

### Modo Producción

```bash
npm start
```

## 📡 Endpoints Principales

### Base URL
```
http://localhost:4000/api
```

### Health Check
```bash
GET /api/health
```

### Procesiones
```bash
GET    /api/procesiones              # Todas las procesiones
GET    /api/procesiones/activas      # Solo procesiones activas
GET    /api/procesiones/activas/ids  # IDs de procesiones activas
GET    /api/procesiones/upcoming     # Procesiones futuras
GET    /api/procesiones/:id          # Procesión por ID
POST   /api/procesiones              # Crear procesión
PUT    /api/procesiones/:id          # Actualizar procesión
DELETE /api/procesiones/:id          # Eliminar procesión
```

### Recorridos
```bash
GET    /api/recorridos                    # Todos los recorridos
GET    /api/recorridos/:id/completo       # Recorrido + estaciones
POST   /api/recorridos/completo           # Crear recorrido con estaciones
PUT    /api/recorridos/:id/completo       # Actualizar recorrido + estaciones
```

### Relevos
```bash
GET    /api/relevos                       # Todos los relevos
GET    /api/relevos/procesion/:id         # Relevos de una procesión
POST   /api/relevos                       # Crear relevo
PUT    /api/relevos/:id                   # Actualizar relevo
```

### Eventos
```bash
GET    /api/evento                        # Todos los eventos
GET    /api/evento/upcoming               # Solo eventos futuros
GET    /api/evento/tipo/:tipo             # Filtrar por tipo
GET    /api/evento/tipo/:tipo/upcoming    # Futuros por tipo
```

### Grupos
```bash
GET    /api/grupos                                      # Todos los grupos
GET    /api/grupos/categoria/:categoria                 # Por categoría (masculino/femenino)
GET    /api/grupos/hermandad/:nombreHermandad           # Por hermandad
GET    /api/grupos/hermandad/:h/categoria/:c            # Filtro combinado
```

### Mapa
```bash
GET    /api/map/:idProcesion             # Recorrido completo + estaciones + relevos
```

### Otros Endpoints
- `/api/hermandades` - CRUD hermandades
- `/api/imgReligiosa` - CRUD imágenes religiosas
- `/api/base-estaciones` - Templates de estaciones
- `/api/estacion` - CRUD estaciones individuales
- `/api/grupQ` - Queries especializadas de grupos

## 📝 Ejemplos de Uso

### Crear una Procesión

```bash
POST http://localhost:4000/api/procesiones
Content-Type: application/json

{
  "titulo": "Procesión del Viernes Santo",
  "fecha": "2025-04-18",
  "horaEntrada": "08:00 AM",
  "horaSalida": "10:00 PM",
  "entradaUbi": "Catedral Metropolitana",
  "salidaUbi": "Iglesia La Merced",
  "recorridoId": "abc123",
  "imagenId": "xyz789",
  "activo": true,
  "ubicacionActual": {
    "_latitude": 14.6349,
    "_longitude": -90.5069
  }
}
```

### Actualizar Ubicación en Tiempo Real

```bash
PUT http://localhost:4000/api/procesiones/abc123
Content-Type: application/json

{
  "ubicacionActual": {
    "_latitude": 14.6360,
    "_longitude": -90.5080
  }
}
```

### Obtener Procesiones Activas

```bash
GET http://localhost:4000/api/procesiones/activas
```

Respuesta expandida con todas las referencias:
```json
{
  "ok": true,
  "data": [
    {
      "id": "abc123",
      "titulo": "Procesión del Viernes Santo",
      "fecha": "2025-04-18T06:00:00.000Z",
      "activo": true,
      "grupoActual": {
        "id": "grupo1",
        "nombreGrupo": "Grupo 1",
        "categoria": "masculino",
        "nombreHermandad": "Hermandad de Jesús"
      },
      "imagenId": {
        "id": "imagen1",
        "nombre": "Jesús Nazareno",
        "imagen": "https://..."
      },
      "recorrido": {
        "id": "recorrido1",
        "nombre": "Recorrido Centro Histórico",
        "coordenadas": [...]
      },
      "ubicacionActual": {
        "latitude": 14.6349,
        "longitude": -90.5069
      }
    }
  ]
}
```

## 🔧 Scripts Disponibles

```bash
npm run dev     # Ejecutar en modo desarrollo (nodemon)
npm start       # Ejecutar en modo producción
```

## 🗂️ Estructura del Proyecto

```
viaMap_api/
├── src/
│   ├── config/              # Configuración
│   ├── controllers/         # Controladores HTTP
│   ├── db/                  # Configuración Firebase
│   ├── middlewares/         # Middleware (errores, etc.)
│   ├── routes/              # Definición de rutas
│   ├── services/            # Lógica de negocio
│   ├── server/              # Configuración Express
│   └── utils/               # Utilidades
├── .env                     # Variables de entorno (NO versionado)
├── .gitignore
├── package.json
└── serviceAccountKey.json   # Credenciales Firebase (NO versionado)
```

## 🔐 Seguridad

### Archivos sensibles (NO deben versionarse)

- `.env` - Variables de entorno
- `serviceAccountKey.json` - Credenciales de Firebase
- `node_modules/` - Dependencias

Estos archivos ya están incluidos en `.gitignore`.

### Buenas Prácticas

1. **Nunca** hardcodees credenciales en el código
2. Usa variables de entorno para configuración sensible
3. Mantén actualizadas las dependencias: `npm audit`
4. Limita el acceso a las credenciales de Firebase

## 🐛 Troubleshooting

### Error: "Firebase configuration missing"

**Solución**: Asegúrate de haber recibido y colocado los archivos `.env` y `serviceAccountKey.json` del equipo de ViaMap en la raíz del proyecto.

### Error: "Port 4000 already in use"

**Solución**: 
```bash
# Windows PowerShell
Stop-Process -Name node -Force

# Cambiar puerto en .env
PORT=4000
```

### Error: "Permission denied" en Firestore

**Solución**: Contacta al equipo de ViaMap para verificar que las credenciales proporcionadas sean correctas y tengan los permisos adecuados.

### Servidor no reinicia automáticamente

**Solución**: Asegúrate de estar usando `npm run dev` (no `npm start`) y que nodemon esté instalado.

## 📚 Tecnologías Utilizadas

- **Node.js** v22.16.0
- **Express** 5.1.0
- **Firebase Admin SDK**
- **Firestore** (Base de datos NoSQL)
- **CORS** (Cross-Origin Resource Sharing)
- **dotenv** (Variables de entorno)
- **nodemon** (Auto-restart en desarrollo)


