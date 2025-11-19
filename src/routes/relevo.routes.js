import { Router } from "express";
import RelevoService from "../services/relevo.service.js";

const relevoRouter = Router();

relevoRouter.post('/', async(req, res) => {
    try{
        const relevo = await RelevoService.create(req.body);
        res.status(201).json(relevo);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

relevoRouter.get('/', async(req, res) => {
    try{
        const relevo = await RelevoService.getAll();
        res.json(relevo);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

relevoRouter.get('/:id', async(req, res) => {
    try{
        const relevo = await RelevoService.getById(req.params.id);
        if(!relevo) return res.status(404).json({error: 'No encontrado'});
        res.json(relevo);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

relevoRouter.put('/:id', async(req, res) => {
    try{
        const relevo = await RelevoService.update(req.params.id, req.body);
        res.json(relevo);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

relevoRouter.delete('/:id', async(req, res) => {
    try{
        const result = await RelevoService.delete(req.params.id);
        res.json(result);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

export default relevoRouter;