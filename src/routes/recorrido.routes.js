import { Router } from "express";
import {
    createRecorrido,
    getAllRecorridos,
    getRecorridoById,
    duplicateRecorrido,
    updateRecorrido,
    deleteRecorrido,
    createRecorridoWithEstaciones,
    addEstacion,
    getEstaciones,
    deleteEstacion,
    getRecorridoCompleto,
    updateEstacion,
    updateRecorridoCompleto
} from '../controllers/recorrido.controller.js';

const recorridoRouter = Router();

// IMPORTANTE: Rutas específicas ANTES de rutas con parámetros
recorridoRouter.post('/completo', createRecorridoWithEstaciones); // Crear con estaciones
recorridoRouter.get('/', getAllRecorridos);
recorridoRouter.post('/', createRecorrido);

// Rutas con parámetros específicos
recorridoRouter.get('/:id/completo', getRecorridoCompleto); // Obtener recorrido con estaciones
recorridoRouter.put('/:id/completo', updateRecorridoCompleto); // Actualizar recorrido completo
recorridoRouter.post('/:id/duplicate', duplicateRecorrido);
recorridoRouter.post('/:id/estaciones', addEstacion); // Agregar estación
recorridoRouter.get('/:id/estaciones', getEstaciones); // Listar estaciones
recorridoRouter.put('/:recorridoId/estaciones/:estacionId', updateEstacion); // Actualizar estación
recorridoRouter.delete('/:recorridoId/estaciones/:estacionId', deleteEstacion); // Eliminar estación

// Rutas con parámetros genéricos AL FINAL
recorridoRouter.get('/:id', getRecorridoById);
recorridoRouter.put('/:id', updateRecorrido); // Actualizar solo coordenadas/nombre/descripción
recorridoRouter.delete('/:id', deleteRecorrido)

export default recorridoRouter;