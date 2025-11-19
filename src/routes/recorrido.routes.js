import { Router } from "express";
import RecorridoService from "../services/recorrido.service.js";

const recorridoRouter = Router();

recorridoRouter.post('/', async(req, res) => {
    try{
        const estacion = await RecorridoService.create(req.body);
        res.status(201).json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

recorridoRouter.get('/', async(req, res) => {
    try{
        const estacion = await RecorridoService.getAll();
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

recorridoRouter.get('/:id', async(req, res) => {
    try{
        const estacion = await RecorridoService.getById(req.params.id);
        if(!estacion) return res.status(404).json({error: 'No encontrado'});
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

recorridoRouter.put('/:id', async(req, res) => {
    try{
        const estacion = await RecorridoService.update(req.params.id, req.body);
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

recorridoRouter.delete('/:id', async(req, res) => {
    try{
        const result = await RecorridoService.delete(req.params.id);
        res.json(result);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

export default recorridoRouter;