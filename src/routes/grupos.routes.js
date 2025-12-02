import { Router } from "express";
import GruposService from "../services/grupos.service.js";

const gruposRouter = Router();

gruposRouter.post('/', async(req, res) => {
    try{
        const grupos = await GruposService.create(req.body);
        res.status(201).json(grupos);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

gruposRouter.get('/', async(req, res) => {
    try{
        const grupos = await GruposService.getAll();
        res.json({ ok: true, data: grupos });
    }catch (err){
        res.status(500).json({ ok: false, error: err.message });
    }
});

gruposRouter.get('/categoria/:categoria', async(req, res) => {
    try{
        const grupos = await GruposService.getByCategoria(req.params.categoria);
        res.json({ ok: true, data: grupos });
    }catch (err){
        res.status(400).json({ ok: false, error: err.message });
    }
});

gruposRouter.get('/hermandad/:nombreHermandad/categoria/:categoria', async(req, res) => {
    try{
        const grupos = await GruposService.getByHermandadAndCategoria(
            decodeURIComponent(req.params.nombreHermandad),
            req.params.categoria
        );
        res.json({ ok: true, data: grupos });
    }catch (err){
        res.status(400).json({ ok: false, error: err.message });
    }
});

gruposRouter.get('/hermandad/:nombreHermandad', async(req, res) => {
    try{
        const grupos = await GruposService.getByHermandad(decodeURIComponent(req.params.nombreHermandad));
        res.json({ ok: true, data: grupos });
    }catch (err){
        res.status(400).json({ ok: false, error: err.message });
    }
});

gruposRouter.get('/:id', async(req, res) => {
    try{
        const grupos = await GruposService.getById(req.params.id);
        if(!grupos) return res.status(404).json({ ok: false, error: 'No encontrado' });
        res.json({ ok: true, data: grupos });
    }catch (err){
        res.status(500).json({ ok: false, error: err.message });
    }
});

gruposRouter.put('/:id', async(req, res) => {
    try{
        const grupos = await GruposService.update(req.params.id, req.body);
        res.json(grupos);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

gruposRouter.delete('/:id', async(req, res) => {
    try{
        const result = await GruposService.delete(req.params.id);
        res.json(result);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

export default gruposRouter;