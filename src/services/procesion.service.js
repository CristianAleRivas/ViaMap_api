import {db} from '../db/firebaseConfig.js';

const collection = 'procesiones';

const ProcesionService = {
    async create(data) {
        const {ubicacionActual, entradaUbi, salidaUbi, fecha, grupoActual, horaEntrada, horaSalida, recorrido, titulo} = data;
        if(!ubicacionActual || !entradaUbi || !salidaUbi || !fecha || !grupoActual || !horaEntrada || !horaSalida || !recorrido || !titulo){
            throw new Error("Por favor llena todos los campos!");
        }

        const procesionData = {ubicacionActual, entradaUbi, salidaUbi, fecha, grupoActual, horaEntrada, horaSalida, recorrido, titulo};
        const docRef = await db.collection(collection).add(procesionData);
        return {id: docRef.id, ...procesionData};
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