import { Router } from "express";
import {
    createProcesion,
    getAllProcesiones,
    getProcesionById,
    updateProcesion,
    deleteProcesion,
    getUpcomingProcesiones,
    getActivasProcesiones,
    getActivasIdsProcesiones
} from '../controllers/procesion.controller.js';

const procesionRouter = Router();

procesionRouter.post('/', createProcesion);
procesionRouter.get('/activas/ids', getActivasIdsProcesiones);
procesionRouter.get('/activas', getActivasProcesiones);
procesionRouter.get('/upcoming', getUpcomingProcesiones);
procesionRouter.get('/', getAllProcesiones);
procesionRouter.get('/:id', getProcesionById);
procesionRouter.put('/:id', updateProcesion);
procesionRouter.delete('/:id', deleteProcesion);

export default procesionRouter;