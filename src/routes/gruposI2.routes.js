import { Router } from "express";
import GrupoI2Service from "../services/gruposI2.service.js";

const grupoImg2Router = Router();

grupoImg2Router.post('/', async(req, res) => {
    try{
        const estacion = await GrupoI2Service.create(req.body);
        res.status(201).json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

grupoImg2Router.get('/', async(req, res) => {
    try{
        const estacion = await GrupoI2Service.getAll();
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

grupoImg2Router.get('/:id', async(req, res) => {
    try{
        const estacion = await GrupoI2Service.getById(req.params.id);
        if(!estacion) return res.status(404).json({error: 'No encontrado'});
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

grupoImg2Router.put('/:id', async(req, res) => {
    try{
        const estacion = await GrupoI2Service.update(req.params.id, req.body);
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

grupoImg2Router.delete('/:id', async(req, res) => {
    try{
        const result = await GrupoI2Service.delete(req.params.id);
        res.json(result);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

export default grupoImg2Router;