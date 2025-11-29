import { Router } from "express";
import {
    createRelevo,
    getAllRelevos,
    getRelevoById,
    getRelevosByProcesion,
    updateRelevo,
    deleteRelevo
} from '../controllers/relevo.controller.js';

const relevoRouter = Router();

// Rutas específicas primero
relevoRouter.get('/procesion/:procesionId', getRelevosByProcesion);

// Rutas CRUD básicas
relevoRouter.post('/', createRelevo);
relevoRouter.get('/', getAllRelevos);
relevoRouter.get('/:id', getRelevoById);
relevoRouter.put('/:id', updateRelevo);
relevoRouter.delete('/:id', deleteRelevo);

export default relevoRouter;