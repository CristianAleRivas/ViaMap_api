import { Router } from "express";
import ImagenRService from "../services/imagenReligiosa.service.js";

const imagenesReliRouter = Router();

imagenesReliRouter.post('/', async(req, res) => {
    try{
        const estacion = await ImagenRService.create(req.body);
        res.status(201).json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

imagenesReliRouter.get('/', async(req, res) => {
    try{
        const estacion = await ImagenRService.getAll();
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

imagenesReliRouter.get('/:id', async(req, res) => {
    try{
        const estacion = await ImagenRService.getById(req.params.id);
        if(!estacion) return res.status(404).json({error: 'No encontrado'});
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

imagenesReliRouter.put('/:id', async(req, res) => {
    try{
        const estacion = await ImagenRService.update(req.params.id, req.body);
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

imagenesReliRouter.delete('/:id', async(req, res) => {
    try{
        const result = await ImagenRService.delete(req.params.id);
        res.json(result);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

export default imagenesReliRouter;