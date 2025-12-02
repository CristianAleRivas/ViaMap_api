import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';
import estacionRouter from './estacion.routes.js';
import eventoRouter from './evento.routes.js';
import gruposRouter from './grupos.routes.js';
import hermandadRouter from './hermandad.routes.js';
import imagenesReliRouter from './imagenReligiosa.routes.js';
import recorridoRouter from './recorrido.routes.js'
import procesionRouter from './procesion.routes.js';
import relevoRouter from './relevo.routes.js';
import mapRouter from './map.routes.js';
import grupQueryRouter from './grupQuery.routes.js';
import baseEstacionRouter from './baseEstacion.routes.js';

const router = Router();

router.get('/health', healthController);
router.use('/evento', eventoRouter);
router.use('/estacion', estacionRouter);
router.use('/base-estaciones', baseEstacionRouter);
router.use('/grupos', gruposRouter);
router.use('/hermandades', hermandadRouter);
router.use('/imgReligiosa', imagenesReliRouter);
router.use('/recorridos', recorridoRouter);
router.use('/procesiones', procesionRouter);
router.use('/relevos', relevoRouter);
router.use('/map', mapRouter);
router.use('/grupQ', grupQueryRouter);

export default router;
