import {db} from '../db/firebaseConfig.js';

const collection = 'recorridos';

const RecorridoService = {
    async create(data) {
        const {coordenadas} = data;
        if (!Array.isArray(coordenadas) || coordenadas.length === 0) {
            throw new Error("Por favor proporcione un array de coordenadas válido.");
        }

        const recorridoData = {coordenadas};
        const docRef = await db.collection(collection).add(recorridoData);
        return {id: docRef.id, ...recorridoData};
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
        const {coordenadas} = data;

        const updatedData = {};
        if (Array.isArray(coordenadas)) {
            updatedData.coordenadas = coordenadas; 
        }

        await db.collection(collection).doc(id).update(updatedData);
        return{id, ...data};
    },

    async delete(id){
        await db.collection(collection).doc(id).delete();
        return{id};
    }
};

export default RecorridoService;
