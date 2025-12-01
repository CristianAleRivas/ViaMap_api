import {db} from '../db/firebaseConfig.js';
import admin from 'firebase-admin';

const collection = 'eventos';

// Tipos de eventos válidos
const TIPOS_EVENTO = ['Procesión', 'Misa', 'Concierto', 'Reunión', 'Otro'];

const EventoService = {
    // Crear evento
    async create(data) {
        const {Título, fecha, hora, 'tipo-evento': tipoEvento} = data;
        
        if (!Título || !fecha || !hora || !tipoEvento) {
            throw new Error("Título, fecha, hora y tipo-evento son obligatorios");
        }

        if (!TIPOS_EVENTO.includes(tipoEvento)) {
            throw new Error(`Tipo de evento inválido. Debe ser uno de: ${TIPOS_EVENTO.join(', ')}`);
        }

        const eventoData = {
            'Título': Título,
            'fecha': fecha instanceof admin.firestore.Timestamp ? fecha : admin.firestore.Timestamp.fromDate(new Date(fecha)),
            'hora': hora,
            'tipo-evento': tipoEvento,
            'descripcion': data.descripcion || null,
        };

        // Agregar campos específicos según el tipo
        if (tipoEvento === 'Procesión') {
            if (!data['entrada-procesion'] || !data['salida-procesion']) {
                throw new Error("Procesión requiere entrada-procesion y salida-procesion");
            }
            eventoData['entrada-procesion'] = data['entrada-procesion'];
            eventoData['salida-procesion'] = data['salida-procesion'];
        } else {
            // Para otros tipos: Misa, Concierto, Reunión, Otro
            if (!data.lugar) {
                throw new Error(`${tipoEvento} requiere el campo lugar`);
            }
            eventoData.lugar = data.lugar;
        }

        const docRef = await db.collection(collection).add(eventoData);
        return {id: docRef.id, ...this._serializeEvento(eventoData)};
    },

    // Helper para obtener imagen según tipo-evento
    async _getImagenByTipo(tipoEvento) {
        const imagenSnapshot = await db.collection('imagen-evento')
            .where('tipo-evento', '==', tipoEvento)
            .limit(1)
            .get();
        
        if (imagenSnapshot.empty) {
            return null;
        }

        const imagenDoc = imagenSnapshot.docs[0];
        const imagenData = imagenDoc.data();
        return {
            id: imagenDoc.id,
            imagenUrl: imagenData.imagenUrl,
            'tipo-evento': imagenData['tipo-evento']
        };
    },

    // Obtener todos los eventos (futuros y pasados)
    async getAll() {
        const snapshot = await db.collection(collection)
            .orderBy('fecha', 'desc')
            .get();
        
        const eventos = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const imagen = await this._getImagenByTipo(data['tipo-evento']);
                
                return {
                    id: doc.id,
                    ...this._serializeEvento(data),
                    imagen
                };
            })
        );

        return eventos;
    },

    // Obtener solo eventos futuros (no vencidos)
    async getUpcoming() {
        const ahora = admin.firestore.Timestamp.now();
        
        const snapshot = await db.collection(collection)
            .where('fecha', '>=', ahora)
            .orderBy('fecha', 'asc')
            .get();
        
        const eventos = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const imagen = await this._getImagenByTipo(data['tipo-evento']);
                
                return {
                    id: doc.id,
                    ...this._serializeEvento(data),
                    imagen
                };
            })
        );

        return eventos;
    },

    // Obtener eventos por tipo (todos)
    async getByTipo(tipo) {
        if (!TIPOS_EVENTO.includes(tipo)) {
            throw new Error(`Tipo inválido. Debe ser: ${TIPOS_EVENTO.join(', ')}`);
        }

        // Obtener imagen una sola vez para este tipo
        const imagen = await this._getImagenByTipo(tipo);

        // Filtrar por tipo sin ordenar (para evitar índice compuesto)
        const snapshot = await db.collection(collection)
            .where('tipo-evento', '==', tipo)
            .get();
        
        // Ordenar en memoria
        const eventos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...this._serializeEvento(doc.data()),
            imagen,
            _fechaTimestamp: doc.data().fecha
        }));

        return eventos.sort((a, b) => {
            const fechaA = a._fechaTimestamp?.toDate ? a._fechaTimestamp.toDate() : new Date(a.fecha);
            const fechaB = b._fechaTimestamp?.toDate ? b._fechaTimestamp.toDate() : new Date(b.fecha);
            return fechaB - fechaA; // Descendente
        }).map(({_fechaTimestamp, ...evento}) => evento);
    },

    // Obtener eventos futuros por tipo
    async getUpcomingByTipo(tipo) {
        if (!TIPOS_EVENTO.includes(tipo)) {
            throw new Error(`Tipo inválido. Debe ser: ${TIPOS_EVENTO.join(', ')}`);
        }

        const ahora = new Date();
        
        // Obtener imagen una sola vez para este tipo
        const imagen = await this._getImagenByTipo(tipo);
        
        // Solo filtrar por tipo, luego filtrar y ordenar en memoria
        const snapshot = await db.collection(collection)
            .where('tipo-evento', '==', tipo)
            .get();
        
        // Filtrar futuros y ordenar en memoria
        const eventos = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...this._serializeEvento(doc.data()),
                imagen,
                _fechaTimestamp: doc.data().fecha
            }))
            .filter(evento => {
                const fechaEvento = evento._fechaTimestamp?.toDate 
                    ? evento._fechaTimestamp.toDate() 
                    : new Date(evento.fecha);
                return fechaEvento >= ahora;
            })
            .sort((a, b) => {
                const fechaA = a._fechaTimestamp?.toDate ? a._fechaTimestamp.toDate() : new Date(a.fecha);
                const fechaB = b._fechaTimestamp?.toDate ? b._fechaTimestamp.toDate() : new Date(b.fecha);
                return fechaA - fechaB; // Ascendente
            });

        return eventos.map(({_fechaTimestamp, ...evento}) => evento);
    },
    
    // Obtener evento por ID
    async getById(id) {
        const doc = await db.collection(collection).doc(id).get();
        if (!doc.exists) {
            throw new Error("Evento no encontrado");
        }
        
        const data = doc.data();
        const imagen = await this._getImagenByTipo(data['tipo-evento']);
        
        return {
            id: doc.id,
            ...this._serializeEvento(data),
            imagen
        };
    },

    // Actualizar evento
    async update(id, data) {
        const updatedData = {};
        
        if (data.Título !== undefined) updatedData['Título'] = data.Título;
        if (data.hora !== undefined) updatedData.hora = data.hora;
        if (data.descripcion !== undefined) updatedData.descripcion = data.descripcion;
        if (data['tipo-evento'] !== undefined) {
            if (!TIPOS_EVENTO.includes(data['tipo-evento'])) {
                throw new Error(`Tipo inválido. Debe ser: ${TIPOS_EVENTO.join(', ')}`);
            }
            updatedData['tipo-evento'] = data['tipo-evento'];
        }
        
        if (data.fecha !== undefined) {
            updatedData.fecha = data.fecha instanceof admin.firestore.Timestamp 
                ? data.fecha 
                : admin.firestore.Timestamp.fromDate(new Date(data.fecha));
        }

        // Campos específicos por tipo
        if (data['entrada-procesion'] !== undefined) updatedData['entrada-procesion'] = data['entrada-procesion'];
        if (data['salida-procesion'] !== undefined) updatedData['salida-procesion'] = data['salida-procesion'];
        if (data.lugar !== undefined) updatedData.lugar = data.lugar;

        if (Object.keys(updatedData).length > 0) {
            await db.collection(collection).doc(id).update(updatedData);
        }

        return {id, ...data};
    },

    // Eliminar evento
    async delete(id) {
        await db.collection(collection).doc(id).delete();
        return {id};
    },

    // Helper para serializar timestamps
    _serializeEvento(data) {
        return {
            ...data,
            fecha: data.fecha?.toDate ? data.fecha.toDate().toISOString() : data.fecha
        };
    }
};

export default EventoService;
