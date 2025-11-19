import { Router } from "express";
import ProcesionService from "../services/procesion.service.js";

const procesionRouter = Router();

procesionRouter.post('/', async(req, res) => {
    try{
        const procesion = await ProcesionService.create(req.body);
        res.status(201).json(procesion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

procesionRouter.get('/', async(req, res) => {
    try{
        const procesion = await ProcesionService.getAll();
        res.json(procesion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

procesionRouter.get('/:id', async(req, res) => {
    try{
        const procesion = await ProcesionService.getById(req.params.id);
        if(!procesion) return res.status(404).json({error: 'No encontrado'});
        res.json(procesion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

procesionRouter.put('/:id', async(req, res) => {
    try{
        const procesion = await ProcesionService.update(req.params.id, req.body);
        res.json(procesion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

procesionRouter.delete('/:id', async(req, res) => {
    try{
        const result = await ProcesionService.delete(req.params.id);
        res.json(result);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

export default procesionRouter;