import {db} from '../db/firebaseConfig.js';

const collection = 'imagenes-religiosas';

const ImagenRService = {
    async create(data) {
        const {nombre} = data;
        if(!nombre){
            throw new Error("Por favor llena todos los campos!");
        }

        const grupoData = {nombre};
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
        const {nombre} = data;

        const updatedData = {};    
        if(nombre) updatedData.nombre = nombre;

        await db.collection(collection).doc(id).update(updatedData);
        return{id, ...data};
    },

    async delete(id){
        await db.collection(collection).doc(id).delete();
        return{id};
    }
};

export default ImagenRService;
