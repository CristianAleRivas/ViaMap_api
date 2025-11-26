import { Router } from "express";
import {
    createProcesion,
    getAllProcesiones,
    getProcesionById,
    updateProcesion,
    deleteProcesion
} from '../controllers/procesion.controller.js';

const procesionRouter = Router();

procesionRouter.post('/', createProcesion);
procesionRouter.get('/', getAllProcesiones);
procesionRouter.get('/:id', getProcesionById);
procesionRouter.put('/:id', updateProcesion);
procesionRouter.delete('/:id', deleteProcesion);

export default procesionRouter;