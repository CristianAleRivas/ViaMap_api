import {db} from '../db/firebaseConfig.js';
import admin from 'firebase-admin';

const collection = 'recorridos';

const RecorridoService = {
    async create(data) {
        const {coordenadas, nombre, descripcion} = data;
        
        if (!Array.isArray(coordenadas) || coordenadas.length === 0) {
            throw new Error("Por favor proporcione un array de coordenadas válido.");
        }

        // Convertir coordenadas a GeoPoints si es necesario
        const geoPoints = coordenadas.map(coord => {
            if (coord.latitude !== undefined && coord.longitude !== undefined) {
                return new admin.firestore.GeoPoint(coord.latitude, coord.longitude);
            }
            return coord; // Ya es un GeoPoint
        });

        const recorridoData = {
            coordenadas: geoPoints,
            nombre: nombre || "Recorrido sin nombre",
            descripcion: descripcion || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection(collection).add(recorridoData);
        return {id: docRef.id, ...data};
    },

    // Duplicar un recorrido existente
    async duplicate(id) {
        const recorridoOriginal = await this.getById(id);
        if (!recorridoOriginal) {
            throw new Error("Recorrido no encontrado");
        }
        
        return await this.create({
            nombre: `${recorridoOriginal.nombre || 'Recorrido'} (Copia)`,
            descripcion: recorridoOriginal.descripcion,
            coordenadas: recorridoOriginal.coordenadas
        });
    },

    async getAll(){
        const snapshot = await db.collection(collection).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                nombre: data.nombre,
                descripcion: data.descripcion,
                cantidadPuntos: data.coordenadas?.length || 0,
                createdAt: data.createdAt?.toDate()
            };
        });
    },
    
    async getById(id){
        const doc = await db.collection(collection).doc(id).get();
        if(!doc.exists) return null;
        
        const data = doc.data();
        // Serializar GeoPoints
        const coordenadas = data.coordenadas?.map(geoPoint => ({
            latitude: geoPoint._latitude || geoPoint.latitude,
            longitude: geoPoint._longitude || geoPoint.longitude
        })) || [];
        
        return {
            id: doc.id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            coordenadas,
            createdAt: data.createdAt?.toDate()
        };
    },

    async update(id, data){
        const {coordenadas, nombre, descripcion} = data;

        const updatedData = {};
        
        if (nombre !== undefined) {
            updatedData.nombre = nombre;
        }
        
        if (descripcion !== undefined) {
            updatedData.descripcion = descripcion;
        }
        
        if (Array.isArray(coordenadas)) {
            updatedData.coordenadas = coordenadas.map(coord => {
                if (coord.latitude !== undefined && coord.longitude !== undefined) {
                    return new admin.firestore.GeoPoint(coord.latitude, coord.longitude);
                }
                return coord;
            });
        }

        if (Object.keys(updatedData).length > 0) {
            await db.collection(collection).doc(id).update(updatedData);
        }
        
        return{id, ...data};
    },

    async delete(id){
        await db.collection(collection).doc(id).delete();
        return{id};
    },

    // Crear recorrido completo con estaciones
    async createWithEstaciones(data) {
        const {coordenadas, nombre, descripcion, estaciones} = data;
        
        if (!Array.isArray(coordenadas) || coordenadas.length === 0) {
            throw new Error("Por favor proporcione un array de coordenadas válido.");
        }

        // Convertir coordenadas a GeoPoints
        const geoPoints = coordenadas.map(coord => {
            if (coord.latitude !== undefined && coord.longitude !== undefined) {
                return new admin.firestore.GeoPoint(coord.latitude, coord.longitude);
            }
            return coord;
        });

        // Crear el recorrido
        const recorridoData = {
            coordenadas: geoPoints,
            nombre: nombre || "Recorrido sin nombre",
            descripcion: descripcion || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        const recorridoRef = await db.collection(collection).add(recorridoData);

        // Agregar estaciones si existen
        if (estaciones && Array.isArray(estaciones) && estaciones.length > 0) {
            const estacionesPromises = estaciones.map(async (estacion) => {
                const estacionData = {
                    numero: estacion.numero,
                    ubicacion: new admin.firestore.GeoPoint(
                        estacion.ubicacion.latitude,
                        estacion.ubicacion.longitude
                    )
                };

                // Si tiene referencia a base de estación
                if (estacion.baseEstacionId) {
                    estacionData.baseRef = db.collection('base-estaciones').doc(estacion.baseEstacionId);
                }

                return recorridoRef.collection('estaciones').add(estacionData);
            });

            await Promise.all(estacionesPromises);
        }

        return {
            id: recorridoRef.id,
            nombre,
            descripcion,
            coordenadas,
            estaciones: estaciones || []
        };
    },

    // Agregar una estación a un recorrido existente
    async addEstacion(recorridoId, estacionData) {
        const {numero, ubicacion, baseEstacionId} = estacionData;

        if (!numero || !ubicacion) {
            throw new Error("Número y ubicación son obligatorios");
        }

        const estacion = {
            numero,
            ubicacion: new admin.firestore.GeoPoint(ubicacion.latitude, ubicacion.longitude)
        };

        if (baseEstacionId) {
            estacion.baseRef = db.collection('base-estaciones').doc(baseEstacionId);
        }

        const estacionRef = await db.collection(collection)
            .doc(recorridoId)
            .collection('estaciones')
            .add(estacion);

        return {id: estacionRef.id, ...estacionData};
    },

    // Obtener todas las estaciones de un recorrido
    async getEstaciones(recorridoId) {
        const estacionesSnap = await db.collection(collection)
            .doc(recorridoId)
            .collection('estaciones')
            .orderBy('numero')
            .get();

        const estaciones = [];
        for (const doc of estacionesSnap.docs) {
            const data = doc.data();
            
            let baseEstacionData = null;
            if (data.baseRef) {
                const baseSnap = await data.baseRef.get();
                if (baseSnap.exists) {
                    baseEstacionData = baseSnap.data();
                }
            }

            estaciones.push({
                id: doc.id,
                numero: data.numero,
                ubicacion: {
                    latitude: data.ubicacion._latitude || data.ubicacion.latitude,
                    longitude: data.ubicacion._longitude || data.ubicacion.longitude
                },
                baseEstacion: baseEstacionData // { nombre, imagen }
            });
        }

        return estaciones;
    },

    // Eliminar una estación
    async deleteEstacion(recorridoId, estacionId) {
        await db.collection(collection)
            .doc(recorridoId)
            .collection('estaciones')
            .doc(estacionId)
            .delete();
        
        return {id: estacionId};
    },

    // Obtener recorrido completo con estaciones
    async getRecorridoCompleto(recorridoId) {
        // Obtener el recorrido
        const recorridoSnap = await db.collection(collection).doc(recorridoId).get();
        
        if (!recorridoSnap.exists) {
            throw new Error("Recorrido no encontrado");
        }

        const recorridoData = recorridoSnap.data();
        
        // Obtener las estaciones
        const estaciones = await this.getEstaciones(recorridoId);

        return {
            id: recorridoSnap.id,
            nombre: recorridoData.nombre,
            descripcion: recorridoData.descripcion,
            coordenadas: recorridoData.coordenadas.map(gp => ({
                latitude: gp._latitude || gp.latitude,
                longitude: gp._longitude || gp.longitude
            })),
            estaciones
        };
    },

    // Actualizar una estación específica
    async updateEstacion(recorridoId, estacionId, estacionData) {
        const {numero, ubicacion, baseEstacionId} = estacionData;

        const updatedData = {};

        if (numero !== undefined) {
            updatedData.numero = numero;
        }

        if (ubicacion) {
            updatedData.ubicacion = new admin.firestore.GeoPoint(
                ubicacion.latitude, 
                ubicacion.longitude
            );
        }

        if (baseEstacionId !== undefined) {
            if (baseEstacionId) {
                updatedData.baseRef = db.collection('base-estaciones').doc(baseEstacionId);
            } else {
                updatedData.baseRef = admin.firestore.FieldValue.delete();
            }
        }

        if (Object.keys(updatedData).length > 0) {
            await db.collection(collection)
                .doc(recorridoId)
                .collection('estaciones')
                .doc(estacionId)
                .update(updatedData);
        }

        return {id: estacionId, ...estacionData};
    },

    // Actualizar recorrido completo (coordenadas y estaciones)
    async updateRecorridoCompleto(recorridoId, data) {
        const {nombre, descripcion, coordenadas, estaciones} = data;

        // Actualizar datos básicos del recorrido
        await this.update(recorridoId, {nombre, descripcion, coordenadas});

        // Si se proporcionan estaciones, reemplazar completamente la colección
        if (Array.isArray(estaciones)) {
            // 1. Eliminar TODAS las estaciones existentes
            const estacionesExistentes = await db.collection(collection)
                .doc(recorridoId)
                .collection('estaciones')
                .get();

            // Crear un batch para eliminar todas las estaciones
            const batch = db.batch();
            estacionesExistentes.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            // 2. Crear las nuevas estaciones
            for (const estacion of estaciones) {
                const estacionData = {
                    numero: estacion.numero,
                    ubicacion: new admin.firestore.GeoPoint(
                        estacion.ubicacion.latitude, 
                        estacion.ubicacion.longitude
                    )
                };

                if (estacion.baseEstacionId) {
                    estacionData.baseRef = db.collection('base-estaciones').doc(estacion.baseEstacionId);
                }

                await db.collection(collection)
                    .doc(recorridoId)
                    .collection('estaciones')
                    .add(estacionData);
            }
        }

        return await this.getRecorridoCompleto(recorridoId);
    }
};

export default RecorridoService;
