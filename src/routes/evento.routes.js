import express from 'express';
import EventoService from '../services/evento.service.js';

const router = express.Router();

router.post('/', async (requestAnimationFrame, res) => {
    try{
        const evento = await EventoService.create(requestAnimationFrame.body);
        res.status(201).json(evento);
    }catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.get('/', async (req, res)=>{
    try{
        const evento = await EventoService.getAll();
        res.json(evento);
    }catch (err){
        res.status(500).json({erro: err.message});
    }
});

router.get('/:id', async (req, res)=>{
    try{
        const evento = await EventoService.getById(req.params.id);
        if (!evento) return res.status(404).json({error: 'No encontrado'});
        res.json(evento);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

router.put('/:id', async (req, res) => {
    try{
        const evento = await EventoService.update(req.params.id, req.body);
        res.json(evento);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

router.delete('/:id', async(req, res) => {
    try{
        const result = await EventoService.delete(req.params.id);
        res.json(result);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

export default router;