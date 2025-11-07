import { Router } from "express";
import GrupoI1Service from "../services/gruposI1.service.js"

const grupoImg1Router = Router();

grupoImg1Router.post('/', async(req, res) => {
    try{
        const estacion = await GrupoI1Service.create(req.body);
        res.status(201).json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

grupoImg1Router.get('/', async(req, res) => {
    try{
        const estacion = await GrupoI1Service.getAll();
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

grupoImg1Router.get('/:id', async(req, res) => {
    try{
        const estacion = await GrupoI1Service.getById(req.params.id);
        if(!estacion) return res.status(404).json({error: 'No encontrado'});
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

grupoImg1Router.put('/:id', async(req, res) => {
    try{
        const estacion = await GrupoI1Service.update(req.params.id, req.body);
        res.json(estacion);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

grupoImg1Router.delete('/:id', async(req, res) => {
    try{
        const result = await GrupoI1Service.delete(req.params.id);
        res.json(result);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

export default grupoImg1Router;