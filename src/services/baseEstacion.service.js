import { db } from '../db/firebaseConfig.js';

const collection = 'base-estaciones';

const BaseEstacionService = {
    async create(data) {
        const { nombre, imagen } = data;
        
        if (!nombre) {
            throw new Error("El nombre es obligatorio");
        }

        const baseEstacionData = {
            nombre,
            imagen: imagen || null,
            createdAt: new Date()
        };
        
        const docRef = await db.collection(collection).add(baseEstacionData);
        return { id: docRef.id, ...baseEstacionData };
    },

    async getAll() {
        const snapshot = await db.collection(collection).get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    async getById(id) {
        const doc = await db.collection(collection).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },

    async update(id, data) {
        const { nombre, imagen } = data;
        const updateData = {};

        if (nombre) updateData.nombre = nombre;
        if (imagen !== undefined) updateData.imagen = imagen;

        await db.collection(collection).doc(id).update(updateData);
        return { id, ...data };
    },

    async delete(id) {
        await db.collection(collection).doc(id).delete();
        return { id };
    }
};

export default BaseEstacionService;
