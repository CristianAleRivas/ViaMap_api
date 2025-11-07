import { db } from '../db/firebaseConfig.js';

const collection = 'estaciones';

const EstacionService = {
    async create(data){
        const {nombre, numero, img, ubicacion} = data;
        if(!nombre | !numero | !img | !ubicacion){
            throw new Error("Por favor llenar todos los campos!");
        }

        const estacionData = {nombre, numero, img, ubicacion};
        const docRef = await db.collection(collection).add(estacionData);
        return {id: docRef.id, ...estacionData};
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
        const {nombre, numero, img, ubicacion} = data;

        const updatedData = {};
        if(nombre) updatedData.nombre = nombre;
        if(numero) updatedData.numero = numero;
        if(img) updatedData.img = img;
        if(ubicacion) updatedData.ubicacion = ubicacion;

        await db.collection(collection).doc(id).update(updatedData);
        return{id, ...data};
    },

    async delete(id){
        await db.collection(collection).doc(id).delete();
        return{id};
    }
};

export default EstacionService;