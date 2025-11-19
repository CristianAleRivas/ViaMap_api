import { Router } from "express";
import ImagenRService from "../services/imagenReligiosa.service.js";

const imagenesReliRouter = Router();

imagenesReliRouter.post('/', async(req, res) => {
    try{
        const imagenReli = await ImagenRService.create(req.body);
        res.status(201).json(imagenReli);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

imagenesReliRouter.get('/', async(req, res) => {
    try{
        const imagenReli = await ImagenRService.getAll();
        res.json(imagenReli);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

imagenesReliRouter.get('/:id', async(req, res) => {
    try{
        const imagenReli = await ImagenRService.getById(req.params.id);
        if(!imagenReli) return res.status(404).json({error: 'No encontrado'});
        res.json(imagenReli);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

imagenesReliRouter.put('/:id', async(req, res) => {
    try{
        const imagenReli = await ImagenRService.update(req.params.id, req.body);
        res.json(imagenReli);
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