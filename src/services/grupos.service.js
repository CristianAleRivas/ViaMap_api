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

    async getByCategoria(categoria){
        if (!['masculino', 'femenino'].includes(categoria.toLowerCase())) {
            throw new Error("Categoría inválida. Debe ser 'masculino' o 'femenino'");
        }

        const snapshot = await db.collection(collection)
            .where('categoria', '==', categoria.toLowerCase())
            .get();
        
        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    },

    async getByHermandad(nombreHermandad){
        if (!nombreHermandad) {
            throw new Error("El nombre de la hermandad es requerido");
        }

        const snapshot = await db.collection(collection)
            .where('nombreHermandad', '==', nombreHermandad)
            .get();
        
        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    },

    async getByHermandadAndCategoria(nombreHermandad, categoria){
        if (!nombreHermandad) {
            throw new Error("El nombre de la hermandad es requerido");
        }
        
        if (!['masculino', 'femenino'].includes(categoria.toLowerCase())) {
            throw new Error("Categoría inválida. Debe ser 'masculino' o 'femenino'");
        }

        const snapshot = await db.collection(collection)
            .where('nombreHermandad', '==', nombreHermandad)
            .where('categoria', '==', categoria.toLowerCase())
            .get();
        
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
