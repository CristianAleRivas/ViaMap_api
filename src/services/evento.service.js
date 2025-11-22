import {db} from '../db/firebaseConfig.js';

const collection = 'eventos';

const EventoService = {
    async create(data) {
        const {titulo, fecha, hora, ubicacion} = data;
        if(!titulo || !fecha || !hora || !ubicacion){
            throw new Error("Por favor llena todos los campos!");
        }

        const eventoData = {titulo, fecha, hora, ubicacion};
        const docRef = await db.collection(collection).add(eventoData);
        return {id: docRef.id, ...eventoData};
    },

    async getAll(){
        const snapshot = await db.collection(collection).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                fecha: data.fecha?.toDate ? data.fecha.toDate() : data.fecha
            };
        });
    },

    async getUpcoming(){
        const snapshot = await db.collection(collection).get();
        const eventos = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convertir Timestamp a Date si es necesario
                fecha: data.fecha?.toDate ? data.fecha.toDate() : data.fecha
            };
        });
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        return eventos.filter(evento => {
            if (!evento.fecha) return false;
            
            const fechaEvento = new Date(evento.fecha);
            fechaEvento.setHours(0, 0, 0, 0);
            
            return fechaEvento >= hoy;
        }).sort((a, b) => {
            return new Date(a.fecha) - new Date(b.fecha);
        });
    },
    
    async getById(id){
        const doc = await db.collection(collection).doc(id).get();
        if(!doc.exists) return null;
        return{id: doc.id, ...doc.data()};
    },

    async update(id, data){
        const {titulo, fecha, hora, ubicacion} = data;

        const updatedData = {};
        if(titulo) updatedData.titulo = titulo;
        if(fecha) updatedData.fecha = fecha;
        if(hora) updatedData.hora = hora;
        if(ubicacion) updatedData.ubicacion = ubicacion;

        await db.collection(collection).doc(id).update(updatedData);
        return{id, ...data};
    },

    async delete(id){
        await db.collection(collection).doc(id).delete();
        return{id};
    }
};

export default EventoService;
