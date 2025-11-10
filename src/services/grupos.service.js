import {db} from '../db/firebaseConfig.js';

const collection = 'grupos';

const GruposService = {
    async create(data) {
        const {numeroGrupo, jefeGrupo, idImagen} = data;
        if(!numeroGrupo || !jefeGrupo || !idImagen){
            throw new Error("Por favor llena todos los campos!");
        }

        const grupoData = {numeroGrupo, jefeGrupo, idImagen};
        const docRef = await db.collection(collection).add(grupoData);
        return {id: docRef.id, ...grupoData};
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
        const {numeroGrupo, jefeGrupo, idImagen} = data;

        const updatedData = {};    
        if(numeroGrupo) updatedData.grupo = numeroGrupo;
        if(jefeGrupo) updatedData.jefeGrupo = jefeGrupo;
        if(idImagen) updatedData.idImagen = idImagen;

        await db.collection(collection).doc(id).update(updatedData);
        return{id, ...data};
    },

    async delete(id){
        await db.collection(collection).doc(id).delete();
        return{id};
    }
};

export default GruposService;
