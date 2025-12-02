import {db} from '../db/firebaseConfig.js';
import admin from 'firebase-admin';

const collection = 'procesiones';

const ProcesionService = {
    async create(data) {
        const {ubicacionActual, entradaUbi, salidaUbi, fecha, grupoActual, horaEntrada, horaSalida, recorridoId, titulo, activo, imagenId} = data;
        
        if(!titulo || !recorridoId){
            throw new Error("El título y el ID del recorrido son obligatorios");
        }

        // Crear referencia al recorrido
        const recorridoRef = db.collection('recorridos').doc(recorridoId);
        
        // Verificar que el recorrido existe
        const recorridoSnap = await recorridoRef.get();
        if (!recorridoSnap.exists) {
            throw new Error("El recorrido especificado no existe");
        }

        // Convertir fecha a Timestamp
        let fechaTimestamp = null;
        if (fecha) {
            if (fecha instanceof admin.firestore.Timestamp) {
                fechaTimestamp = fecha;
            } else {
                // Si viene en formato YYYY-MM-DD, interpretarlo como medianoche hora local
                if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                    // Crear fecha en hora local (no UTC) agregando hora local
                    const [year, month, day] = fecha.split('-').map(Number);
                    const fechaLocal = new Date(year, month - 1, day, 0, 0, 0, 0);
                    fechaTimestamp = admin.firestore.Timestamp.fromDate(fechaLocal);
                } else {
                    // Para otros formatos, usar el constructor estándar
                    fechaTimestamp = admin.firestore.Timestamp.fromDate(new Date(fecha));
                }
            }
        }

        // Crear referencia a imagenId si viene
        const imagenRef = imagenId ? db.collection('imagenes-religiosas').doc(imagenId) : null;

        const procesionData = {
            titulo,
            recorrido: recorridoRef, // Guardar como referencia
            ubicacionActual: ubicacionActual || null,
            entradaUbi: entradaUbi || null,
            salidaUbi: salidaUbi || null,
            fecha: fechaTimestamp,
            grupoActual: grupoActual || null,
            imagenId: imagenRef,
            horaEntrada: horaEntrada || null,
            horaSalida: horaSalida || null,
            activo: activo !== undefined ? activo : false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ultimaActualizacion: admin.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection(collection).add(procesionData);
        return {id: docRef.id, recorridoId, ...data};
    },

    async getAll(){
        const snapshot = await db.collection(collection).get();
        
        const procesiones = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data();
                
                // Expandir referencias
                const expanded = await this._expandReferences(data);
                
                return {
                    id: doc.id,
                    ...expanded
                };
            })
        );
        
        return procesiones;
    },
    
    async getById(id){
        const doc = await db.collection(collection).doc(id).get();
        if(!doc.exists) return null;
        
        const data = doc.data();
        const expanded = await this._expandReferences(data);
        
        return{id: doc.id, ...expanded};
    },

    async update(id, data){
        const {ubicacionActual, entradaUbi, salidaUbi, fecha, grupoActual, horaEntrada, horaSalida, recorrido, titulo, activo} = data;

        const updatedData = {};    
        if(ubicacionActual !== undefined) updatedData.ubicacionActual = ubicacionActual;
        if(entradaUbi !== undefined) updatedData.entradaUbi = entradaUbi;
        if(salidaUbi !== undefined) updatedData.salidaUbi = salidaUbi;
        if(fecha !== undefined) updatedData.fecha = fecha instanceof admin.firestore.Timestamp ? fecha : admin.firestore.Timestamp.fromDate(new Date(fecha));
        if(grupoActual !== undefined) updatedData.grupoActual = grupoActual;
        if(horaEntrada !== undefined) updatedData.horaEntrada = horaEntrada;
        if(horaSalida !== undefined) updatedData.horaSalida = horaSalida;
        if(recorrido !== undefined) updatedData.recorrido = recorrido;
        if(titulo !== undefined) updatedData.titulo = titulo;
        if(activo !== undefined) updatedData.activo = activo;

        if(Object.keys(updatedData).length > 0) {
            updatedData.ultimaActualizacion = admin.firestore.FieldValue.serverTimestamp();
            await db.collection(collection).doc(id).update(updatedData);
        }

        return{id, ...data};
    },

    async delete(id){
        await db.collection(collection).doc(id).delete();
        return{id};
    },

    // Obtener procesiones con fechas futuras (próximas a pasar)
    async getUpcoming(){
        const ahora = admin.firestore.Timestamp.now();
        
        const snapshot = await db.collection(collection)
            .where('fecha', '>=', ahora)
            .orderBy('fecha', 'asc')
            .get();
        
        const procesiones = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const expanded = await this._expandReferences(data);
                
                return {
                    id: doc.id,
                    ...expanded
                };
            })
        );
        
        return procesiones;
    },

    // Obtener solo procesiones activas
    async getActivas(){
        const snapshot = await db.collection(collection)
            .where('activo', '==', true)
            .get();
        
        const procesiones = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const expanded = await this._expandReferences(data);
                
                return {
                    id: doc.id,
                    ...expanded
                };
            })
        );
        
        return procesiones;
    },

    // Obtener solo los IDs de procesiones activas (más eficiente)
    async getActivasIds(){
        const snapshot = await db.collection(collection)
            .where('activo', '==', true)
            .select() // No trae campos, solo metadatos
            .get();
        
        return snapshot.docs.map(doc => doc.id);
    },

    // Helper para expandir DocumentReferences
    async _expandReferences(data) {
        const expanded = { ...data };

        // Expandir grupoActual
        if (data.grupoActual && data.grupoActual.path) {
            try {
                const grupoDoc = await data.grupoActual.get();
                expanded.grupoActual = grupoDoc.exists ? { id: grupoDoc.id, ...grupoDoc.data() } : null;
            } catch (error) {
                expanded.grupoActual = null;
            }
        }

        // Expandir imagenId
        if (data.imagenId && data.imagenId.path) {
            try {
                const imagenDoc = await data.imagenId.get();
                expanded.imagenId = imagenDoc.exists ? { id: imagenDoc.id, ...imagenDoc.data() } : null;
            } catch (error) {
                expanded.imagenId = null;
            }
        }

        // Expandir recorrido
        if (data.recorrido && data.recorrido.path) {
            try {
                const recorridoDoc = await data.recorrido.get();
                expanded.recorrido = recorridoDoc.exists ? { id: recorridoDoc.id, ...recorridoDoc.data() } : null;
            } catch (error) {
                expanded.recorrido = null;
            }
        }

        // Serializar GeoPoint
        if (data.ubicacionActual && data.ubicacionActual._latitude !== undefined) {
            expanded.ubicacionActual = {
                latitude: data.ubicacionActual._latitude,
                longitude: data.ubicacionActual._longitude
            };
        }

        // Serializar Timestamp
        if (data.fecha && data.fecha.toDate) {
            expanded.fecha = data.fecha.toDate().toISOString();
        }
        if (data.createdAt && data.createdAt.toDate) {
            expanded.createdAt = data.createdAt.toDate().toISOString();
        }
        if (data.ultimaActualizacion && data.ultimaActualizacion.toDate) {
            expanded.ultimaActualizacion = data.ultimaActualizacion.toDate().toISOString();
        }

        return expanded;
    }
};

export default ProcesionService;