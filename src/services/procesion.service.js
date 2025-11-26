import {db} from '../db/firebaseConfig.js';
import admin from 'firebase-admin';

const collection = 'procesiones';

const ProcesionService = {
    async create(data) {
        const {ubicacionActual, entradaUbi, salidaUbi, fecha, grupoActual, horaEntrada, horaSalida, recorridoId, titulo, activo} = data;
        
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

        const procesionData = {
            titulo,
            recorrido: recorridoRef, // Guardar como referencia
            ubicacionActual: ubicacionActual || null,
            entradaUbi: entradaUbi || null,
            salidaUbi: salidaUbi || null,
            fecha: fecha || null,
            grupoActual: grupoActual || null,
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
        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    },
    
    async getById(id){
        const doc = await db.collection(collection).doc(id).get();
        if(!doc.exists) return null;
        return{id: doc.id, ...doc.data()};
    },

    async update(id, data){
        const {ubicacionActual, entradaUbi, salidaUbi, fecha, grupoActual, horaEntrada, horaSalida, recorrido, titulo} = data;

        const updatedData = {};    
        if(ubicacionActual) updatedData.ubicacionActual = ubicacionActual;
        if(entradaUbi) updatedData.entradaUbi = entradaUbi;
        if(salidaUbi) updatedData.salidaUbi = salidaUbi;
        if(fecha) updatedData.fecha = fecha;
        if(grupoActual) updatedData.grupoActual = grupoActual;
        if(horaEntrada) updatedData.horaEntrada = horaEntrada;
        if(horaSalida) updatedData.horaSalida = horaSalida;
        if(recorrido) updatedData.recorrido = recorrido;
        if(titulo) updatedData.titulo = titulo;

        await db.collection(collection).doc(id).update(updatedData);
        return{id, ...data};
    },

    async delete(id){
        await db.collection(collection).doc(id).delete();
        return{id};
    }
};

export default ProcesionService;