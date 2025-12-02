import {db} from '../db/firebaseConfig.js';

const collection = 'hermandades';

const HermandadService = {
    // Obtener todas las hermandades
    async getAll() {
        const snapshot = await db.collection(collection).get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    // Obtener hermandad por ID
    async getById(id) {
        const doc = await db.collection(collection).doc(id).get();
        if (!doc.exists) {
            throw new Error("Hermandad no encontrada");
        }
        return {
            id: doc.id,
            ...doc.data()
        };
    },

    // Crear hermandad
    async create(data) {
        const {nombreHermandad} = data;
        
        if (!nombreHermandad) {
            throw new Error("nombreHermandad es obligatorio");
        }

        const docRef = await db.collection(collection).add({
            nombreHermandad
        });

        return {
            id: docRef.id,
            nombreHermandad
        };
    },

    // Actualizar hermandad
    async update(id, data) {
        const updatedData = {};
        
        if (data.nombreHermandad !== undefined) {
            updatedData.nombreHermandad = data.nombreHermandad;
        }

        if (Object.keys(updatedData).length > 0) {
            await db.collection(collection).doc(id).update(updatedData);
        }

        return {id, ...updatedData};
    },

    // Eliminar hermandad
    async delete(id) {
        await db.collection(collection).doc(id).delete();
        return {id};
    }
};

export default HermandadService;
