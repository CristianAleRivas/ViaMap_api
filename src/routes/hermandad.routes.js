import {Router} from 'express';
import HermandadController from '../controllers/hermandad.controller.js';

const router = Router();

// GET /api/hermandades - Obtener todas
router.get('/', HermandadController.getAll);

// GET /api/hermandades/:id - Obtener por ID
router.get('/:id', HermandadController.getById);

// POST /api/hermandades - Crear nueva
router.post('/', HermandadController.create);

// PUT /api/hermandades/:id - Actualizar
router.put('/:id', HermandadController.update);

// DELETE /api/hermandades/:id - Eliminar
router.delete('/:id', HermandadController.delete);

export default router;
