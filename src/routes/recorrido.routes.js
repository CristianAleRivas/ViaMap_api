import { Router } from "express";
import RecorridoService from "../services/recorrido.service.js";

const recorridoRouter = Router();

recorridoRouter.post('/', async(req, res) => {
    try{
        const recorrido = await RecorridoService.create(req.body);
        res.status(201).json(recorrido);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

recorridoRouter.get('/', async(req, res) => {
    try{
        const recorrido = await RecorridoService.getAll();
        res.json(recorrido);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

recorridoRouter.get('/:id', async(req, res) => {
    try{
        const recorrido = await RecorridoService.getById(req.params.id);
        if(!recorrido) return res.status(404).json({error: 'No encontrado'});
        res.json(recorrido);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

recorridoRouter.put('/:id', async(req, res) => {
    try{
        const recorrido = await RecorridoService.update(req.params.id, req.body);
        res.json(recorrido);
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