import { Router } from "express";
import EstacionService from "../services/estacion.service.js";

const estacionRouter = Router();

estacionRouter.post('/', async(req, res) => {
    try{
        const estacion = await EstacionService.create(req.body);
        res.status(201).json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

estacionRouter.get('/', async(req, res) => {
    try{
        const estacion = await EstacionService.getAll();
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

estacionRouter.get('/:id', async(req, res) => {
    try{
        const estacion = await EstacionService.getById(req.params.id);
        if(!estacion) return res.status(404).json({error: 'No encontrado'});
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

estacionRouter.put('/:id', async(req, res) => {
    try{
        const estacion = await EstacionService.update(req.params.id, req.body);
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

estacionRouter.delete('/:id', async(req, res) => {
    try{
        const result = await EstacionService.delete(req.params.id);
        res.json(result);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

export default estacionRouter;