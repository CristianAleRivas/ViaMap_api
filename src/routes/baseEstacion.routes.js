import { Router } from 'express';
import {
    createBaseEstacion,
    getAllBaseEstaciones,
    getBaseEstacionById,
    updateBaseEstacion,
    deleteBaseEstacion
} from '../controllers/baseEstacion.controller.js';

const baseEstacionRouter = Router();

baseEstacionRouter.post('/', createBaseEstacion);
baseEstacionRouter.get('/', getAllBaseEstaciones);
baseEstacionRouter.get('/:id', getBaseEstacionById);
baseEstacionRouter.put('/:id', updateBaseEstacion);
baseEstacionRouter.delete('/:id', deleteBaseEstacion);

export default baseEstacionRouter;
