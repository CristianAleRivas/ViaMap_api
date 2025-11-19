import {db} from '../db/firebaseConfig.js';

const collection = 'relevos';

const RelevoService = {
    async create(data) {
        const {grupoAnterior, grupoNuevo, idGrupo, idImagen, idProcesion, ubicacion} = data;
        if(!grupoAnterior || !grupoNuevo || !idGrupo || !idImagen || !idProcesion || !ubicacion){
            throw new Error("Por favor llena todos los campos!");
        }

        const relevoData = {grupoAnterior, grupoNuevo, idGrupo, idImagen, idProcesion, ubicacion};
        const docRef = await db.collection(collection).add(relevoData);
        return {id: docRef.id, ...relevoData};
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
        const {grupoAnterior, grupoNuevo, idGrupo, idImagen, idProcesion, ubicacion} = data;

        const updatedData = {};    
        if(grupoAnterior) updatedData.grupoAnterior = grupoAnterior;
        if(grupoNuevo) updatedData.grupoNuevo = grupoNuevo;
        if(idGrupo) updatedData.idGrupo = idGrupo;
        if(idImagen) updatedData.idImagen = idImagen;
        if(idProcesion) updatedData.idProcesion = idProcesion;
        if(ubicacion) updatedData.ubicacion = ubicacion;

        await db.collection(collection).doc(id).update(updatedData);
        return{id, ...data};
    },

    async delete(id){
        await db.collection(collection).doc(id).delete();
        return{id};
    }
};

export default RelevoService;