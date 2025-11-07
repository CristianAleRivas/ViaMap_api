import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';
import estacionRouter from './estacion.routes.js';
import eventoRouter from './evento.routes.js';
import grupoImg1Router from './gruposI1.routes.js';
import grupoImg2Router from './gruposI2.routes.js';

const router = Router();

router.get('/health', healthController);
router.use('/evento', eventoRouter);
router.use('/estacion', estacionRouter);
router.use('/grupoImg1', grupoImg1Router);
router.use('/grupoImg2', grupoImg2Router);

export default router;
