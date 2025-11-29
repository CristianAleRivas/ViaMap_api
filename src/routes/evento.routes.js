import { Router } from 'express';
import {
    createEvento,
    getAllEventos,
    getUpcomingEventos,
    getEventoById,
    updateEvento,
    deleteEvento,
    getEventosByTipo,
    getUpcomingEventosByTipo
} from '../controllers/evento.controller.js';

const router = Router();

// Rutas específicas primero
router.get('/upcoming', getUpcomingEventos); // Todos los eventos futuros
router.get('/tipo/:tipo/upcoming', getUpcomingEventosByTipo); // Eventos futuros por tipo
router.get('/tipo/:tipo', getEventosByTipo); // Todos los eventos por tipo

// Rutas CRUD básicas
router.post('/', createEvento);
router.get('/', getAllEventos);
router.get('/:id', getEventoById);
router.put('/:id', updateEvento);
router.delete('/:id', deleteEvento);

export default router;