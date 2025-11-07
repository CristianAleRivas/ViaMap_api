import {db} from '../db/firebaseConfig.js';

const collection = 'grupos-Imagen2';

const GrupoI2Service = {
    async create(data) {
        const {grupo} = data;
        if(!grupo){
            throw new Error("Por favor llena todos los campos!");
        }

        const grupoData = {grupo};
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
        const {grupo} = data;

        const updatedData = {};    
        if(grupo) updatedData.grupo = grupo;

        await db.collection(collection).doc(id).update(updatedData);
        return{id, ...data};
    },

    async delete(id){
        await db.collection(collection).doc(id).delete();
        return{id};
    }
};

export default GrupoI2Service;
