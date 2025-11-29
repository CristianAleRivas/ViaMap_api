import {db} from '../db/firebaseConfig.js';
import admin from 'firebase-admin';

const collection = 'relevos';

const RelevoService = {
    async create(data) {
        const {grupoAnteriorId, grupoNuevoId, idImagen, idProcesion, ubicacion, completado} = data;
        
        if (!grupoAnteriorId || !grupoNuevoId || !idProcesion || !ubicacion) {
            throw new Error("grupoAnteriorId, grupoNuevoId, idProcesion y ubicacion son obligatorios");
        }

        const relevoData = {
            grupoAnterior: db.collection('grupos').doc(grupoAnteriorId),
            grupoNuevo: db.collection('grupos').doc(grupoNuevoId),
            idProcesion: db.collection('procesiones').doc(idProcesion),
            ubicacion: new admin.firestore.GeoPoint(ubicacion.latitude, ubicacion.longitude),
            completado: completado || false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        if (idImagen) {
            relevoData.idImagen = db.collection('imagen-procesion').doc(idImagen);
        }

        const docRef = await db.collection(collection).add(relevoData);
        return {id: docRef.id, ...data};
    },

    async getAll() {
        const snapshot = await db.collection(collection).get();
        const relevos = [];

        for (const doc of snapshot.docs) {
            const data = doc.data();
            
            // Obtener datos de las referencias
            const grupoAnteriorSnap = data.grupoAnterior ? await data.grupoAnterior.get() : null;
            const grupoNuevoSnap = data.grupoNuevo ? await data.grupoNuevo.get() : null;
            const imagenSnap = data.idImagen ? await data.idImagen.get() : null;
            const procesionSnap = data.idProcesion ? await data.idProcesion.get() : null;

            relevos.push({
                id: doc.id,
                grupoAnterior: grupoAnteriorSnap?.exists ? {id: grupoAnteriorSnap.id, ...grupoAnteriorSnap.data()} : null,
                grupoNuevo: grupoNuevoSnap?.exists ? {id: grupoNuevoSnap.id, ...grupoNuevoSnap.data()} : null,
                imagen: imagenSnap?.exists ? {id: imagenSnap.id, ...imagenSnap.data()} : null,
                procesion: procesionSnap?.exists ? {id: procesionSnap.id, ...procesionSnap.data()} : null,
                ubicacion: {
                    latitude: data.ubicacion._latitude || data.ubicacion.latitude,
                    longitude: data.ubicacion._longitude || data.ubicacion.longitude
                },
                completado: data.completado || false,
                createdAt: data.createdAt
            });
        }

        return relevos;
    },
    
    async getById(id) {
        const doc = await db.collection(collection).doc(id).get();
        if (!doc.exists) {
            throw new Error("Relevo no encontrado");
        }

        const data = doc.data();
        
        // Obtener datos de las referencias
        const grupoAnteriorSnap = data.grupoAnterior ? await data.grupoAnterior.get() : null;
        const grupoNuevoSnap = data.grupoNuevo ? await data.grupoNuevo.get() : null;
        const imagenSnap = data.idImagen ? await data.idImagen.get() : null;
        const procesionSnap = data.idProcesion ? await data.idProcesion.get() : null;

        return {
            id: doc.id,
            grupoAnterior: grupoAnteriorSnap?.exists ? {id: grupoAnteriorSnap.id, ...grupoAnteriorSnap.data()} : null,
            grupoNuevo: grupoNuevoSnap?.exists ? {id: grupoNuevoSnap.id, ...grupoNuevoSnap.data()} : null,
            imagen: imagenSnap?.exists ? {id: imagenSnap.id, ...imagenSnap.data()} : null,
            procesion: procesionSnap?.exists ? {id: procesionSnap.id, ...procesionSnap.data()} : null,
            ubicacion: {
                latitude: data.ubicacion._latitude || data.ubicacion.latitude,
                longitude: data.ubicacion._longitude || data.ubicacion.longitude
            },
            completado: data.completado || false,
            createdAt: data.createdAt
        };
    },

    async getByProcesion(procesionId) {
        const snapshot = await db.collection(collection)
            .where('idProcesion', '==', db.collection('procesiones').doc(procesionId))
            .get();

        const relevos = [];

        for (const doc of snapshot.docs) {
            const data = doc.data();
            
            const grupoAnteriorSnap = data.grupoAnterior ? await data.grupoAnterior.get() : null;
            const grupoNuevoSnap = data.grupoNuevo ? await data.grupoNuevo.get() : null;
            const imagenSnap = data.idImagen ? await data.idImagen.get() : null;

            relevos.push({
                id: doc.id,
                grupoAnterior: grupoAnteriorSnap?.exists ? {id: grupoAnteriorSnap.id, ...grupoAnteriorSnap.data()} : null,
                grupoNuevo: grupoNuevoSnap?.exists ? {id: grupoNuevoSnap.id, ...grupoNuevoSnap.data()} : null,
                imagen: imagenSnap?.exists ? {id: imagenSnap.id, ...imagenSnap.data()} : null,
                ubicacion: {
                    latitude: data.ubicacion._latitude || data.ubicacion.latitude,
                    longitude: data.ubicacion._longitude || data.ubicacion.longitude
                },
                completado: data.completado || false,
                createdAt: data.createdAt
            });
        }

        return relevos;
    },

    async update(id, data) {
        const {grupoAnteriorId, grupoNuevoId, idImagen, idProcesion, ubicacion, completado} = data;

        const updatedData = {};
        
        if (grupoAnteriorId) {
            updatedData.grupoAnterior = db.collection('grupos').doc(grupoAnteriorId);
        }
        
        if (grupoNuevoId) {
            updatedData.grupoNuevo = db.collection('grupos').doc(grupoNuevoId);
        }
        
        if (idImagen !== undefined) {
            if (idImagen) {
                updatedData.idImagen = db.collection('imagen-procesion').doc(idImagen);
            } else {
                updatedData.idImagen = admin.firestore.FieldValue.delete();
            }
        }
        
        if (idProcesion) {
            updatedData.idProcesion = db.collection('procesiones').doc(idProcesion);
        }
        
        if (ubicacion) {
            updatedData.ubicacion = new admin.firestore.GeoPoint(ubicacion.latitude, ubicacion.longitude);
        }
        
        if (completado !== undefined) {
            updatedData.completado = completado;
        }

        if (Object.keys(updatedData).length > 0) {
            await db.collection(collection).doc(id).update(updatedData);
        }

        return {id, ...data};
    },

    async delete(id) {
        await db.collection(collection).doc(id).delete();
        return {id};
    }
};

export default RelevoService;