import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';
import estacionRouter from './estacion.routes.js';
import eventoRouter from './evento.routes.js';
import gruposRouter from './grupos.routes.js';
import imagenesReliRouter from './imagenReligiosa.routes.js';
import recorridoRouter from './recorrido.routes.js'
import mapRouter from './map.routes.js';

const router = Router();

router.get('/health', healthController);
router.use('/evento', eventoRouter);
router.use('/estacion', estacionRouter);
router.use('/grupos', gruposRouter);
router.use('/imgReligiosa', imagenesReliRouter);
router.use('/recorrido', recorridoRouter);
router.use('/map', mapRouter);

export default router;
