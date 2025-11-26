# 📘 Guía de Uso - API de Recorridos y Procesiones

## 🚀 Flujo Completo: Crear Procesión con Recorrido

### **Opción 1: Crear recorrido desde cero**

```javascript
// Paso 1: Crear un nuevo recorrido con coordenadas
const crearRecorrido = async (coordenadas) => {
  const response = await fetch('http://localhost:4000/api/recorridos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: "Recorrido Viernes Santo 2025",
      descripcion: "Desde la Catedral hasta San Francisco",
      coordenadas: [
        { latitude: 13.7123, longitude: -89.2034 },
        { latitude: 13.7145, longitude: -89.2056 },
        { latitude: 13.7167, longitude: -89.2078 }
      ]
    })
  });
  
  const data = await response.json();
  console.log('Recorrido creado:', data);
  return data.data.id; // Retorna el ID del recorrido
};

// Paso 2: Crear la procesión con el recorrido
const crearProcesion = async (recorridoId) => {
  const response = await fetch('http://localhost:4000/api/procesiones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: "Procesión del Santo Entierro",
      recorridoId: recorridoId, // ID del recorrido creado
      fecha: "2025-04-18",
      horaEntrada: "18:00",
      horaSalida: "22:00",
      activo: true
    })
  });
  
  const data = await response.json();
  console.log('Procesión creada:', data);
  return data;
};

// Uso completo:
const flujoCompleto = async () => {
  // 1. Crear el recorrido
  const recorridoId = await crearRecorrido(misCoordenadas);
  
  // 2. Crear la procesión con ese recorrido
  const procesion = await crearProcesion(recorridoId);
  
  console.log('Todo creado!', procesion);
};
```

### **Opción 2: Usar un recorrido existente**

```javascript
// Paso 1: Listar todos los recorridos disponibles
const listarRecorridos = async () => {
  const response = await fetch('http://localhost:4000/api/recorridos');
  const data = await response.json();
  
  console.log('Recorridos disponibles:', JSON.stringify(data, null, 2));
  // Muestra: id, nombre, descripción, cantidad de puntos
  
  return data.data;
};

// Paso 2: Ver detalles de un recorrido específico
const verDetalleRecorrido = async (recorridoId) => {
  const response = await fetch(`http://localhost:4000/api/recorridos/${recorridoId}`);
  const data = await response.json();
  
  console.log('Detalle del recorrido:', JSON.stringify(data, null, 2));
  // Incluye todas las coordenadas
  
  return data.data;
};

// Paso 3: Crear procesión con recorrido existente
const crearProcesionConExistente = async (recorridoId) => {
  const response = await fetch('http://localhost:4000/api/procesiones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: "Nueva Procesión",
      recorridoId: recorridoId, // ID del recorrido seleccionado
      activo: true
    })
  });
  
  const data = await response.json();
  return data;
};
```

### **Opción 3: Duplicar un recorrido existente y modificarlo**

```javascript
// Paso 1: Duplicar un recorrido
const duplicarRecorrido = async (recorridoIdOriginal) => {
  const response = await fetch(
    `http://localhost:4000/api/recorridos/${recorridoIdOriginal}/duplicate`,
    { method: 'POST' }
  );
  
  const data = await response.json();
  console.log('Recorrido duplicado:', data);
  return data.data.id;
};

// Paso 2: Modificar el recorrido duplicado (opcional)
const modificarRecorrido = async (recorridoId, nuevasCoordenadas) => {
  const response = await fetch(`http://localhost:4000/api/recorridos/${recorridoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: "Recorrido Modificado",
      coordenadas: nuevasCoordenadas
    })
  });
  
  const data = await response.json();
  return data;
};

// Paso 3: Crear procesión con el recorrido duplicado/modificado
const crearProcesionDesdeDuplicado = async (recorridoOriginalId) => {
  // Duplicar
  const nuevoRecorridoId = await duplicarRecorrido(recorridoOriginalId);
  
  // Opcional: modificar
  await modificarRecorrido(nuevoRecorridoId, misNuevasCoordenadas);
  
  // Crear procesión
  const procesion = await crearProcesionConExistente(nuevoRecorridoId);
  
  return procesion;
};
```

## 📋 Endpoints Disponibles

### **Recorridos:**

```javascript
// Crear recorrido
POST /api/recorridos
Body: {
  nombre: "Nombre del recorrido",
  descripcion: "Descripción opcional",
  coordenadas: [
    { latitude: 13.7123, longitude: -89.2034 },
    { latitude: 13.7145, longitude: -89.2056 }
  ]
}

// Listar todos (solo info básica)
GET /api/recorridos
// Response: [{ id, nombre, descripcion, cantidadPuntos, createdAt }]

// Ver detalle (con todas las coordenadas)
GET /api/recorridos/:id
// Response: { id, nombre, descripcion, coordenadas: [...], createdAt }

// Duplicar recorrido
POST /api/recorridos/:id/duplicate

// Actualizar recorrido
PUT /api/recorridos/:id
Body: { nombre, descripcion, coordenadas }

// Eliminar recorrido
DELETE /api/recorridos/:id
```

### **Procesiones:**

```javascript
// Crear procesión
POST /api/procesiones
Body: {
  titulo: "Título de la procesión",
  recorridoId: "ID_DEL_RECORRIDO", // ← Campo obligatorio
  fecha: "2025-04-18",
  horaEntrada: "18:00",
  horaSalida: "22:00",
  activo: true
}

// Listar todas
GET /api/procesiones

// Ver detalle
GET /api/procesiones/:id

// Actualizar procesión
PUT /api/procesiones/:id

// Eliminar procesión
DELETE /api/procesiones/:id
```

## 💡 Ejemplo Completo en React

```javascript
import { useState, useEffect } from 'react';

function CrearProcesionComponent() {
  const [recorridos, setRecorridos] = useState([]);
  const [recorridoSeleccionado, setRecorridoSeleccionado] = useState('');
  const [coordenadas, setCoordenadas] = useState([]);
  const [modoCreacion, setModoCreacion] = useState('nuevo'); // 'nuevo' o 'existente'

  // Cargar recorridos existentes
  useEffect(() => {
    if (modoCreacion === 'existente') {
      fetch('http://localhost:4000/api/recorridos')
        .then(res => res.json())
        .then(data => setRecorridos(data.data));
    }
  }, [modoCreacion]);

  const guardarProcesion = async () => {
    let recorridoId;

    // Si es nuevo, crear el recorrido primero
    if (modoCreacion === 'nuevo') {
      const resRecorrido = await fetch('http://localhost:4000/api/recorridos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: "Mi Recorrido",
          coordenadas: coordenadas
        })
      });
      const dataRecorrido = await resRecorrido.json();
      recorridoId = dataRecorrido.data.id;
    } else {
      recorridoId = recorridoSeleccionado;
    }

    // Crear la procesión
    const resProcesion = await fetch('http://localhost:4000/api/procesiones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: "Mi Procesión",
        recorridoId: recorridoId,
        activo: true
      })
    });

    const dataProcesion = await resProcesion.json();
    console.log('Procesión creada!', dataProcesion);
  };

  return (
    <div>
      <h2>Crear Procesión</h2>
      
      <select value={modoCreacion} onChange={e => setModoCreacion(e.target.value)}>
        <option value="nuevo">Crear recorrido nuevo</option>
        <option value="existente">Usar recorrido existente</option>
      </select>

      {modoCreacion === 'nuevo' ? (
        <div>
          {/* Aquí tu componente de mapa para dibujar el recorrido */}
          <p>Dibuja el recorrido en el mapa...</p>
        </div>
      ) : (
        <select value={recorridoSeleccionado} onChange={e => setRecorridoSeleccionado(e.target.value)}>
          <option value="">Selecciona un recorrido</option>
          {recorridos.map(rec => (
            <option key={rec.id} value={rec.id}>
              {rec.nombre} ({rec.cantidadPuntos} puntos)
            </option>
          ))}
        </select>
      )}

      <button onClick={guardarProcesion}>Guardar Procesión</button>
    </div>
  );
}
```

## ✅ Resumen del Flujo

1. **Crear o seleccionar recorrido** → Obtienes `recorridoId`
2. **Crear procesión** → Envías `recorridoId` en el body
3. **Firebase guarda la referencia** → La procesión queda vinculada al recorrido
4. **Puedes consultar el mapa** → Usando `/api/map/:procesionId`

¡Todo listo para gestionar tus procesiones con recorridos! 🎉
