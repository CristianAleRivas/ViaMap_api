import RelevoService from '../services/relevo.service.js';

export const createRelevo = async (req, res) => {
    try {
        const relevo = await RelevoService.create(req.body);
        res.status(201).json({ ok: true, data: relevo });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const getAllRelevos = async (req, res) => {
    try {
        const relevos = await RelevoService.getAll();
        res.json({ ok: true, data: relevos });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const getRelevoById = async (req, res) => {
    try {
        const relevo = await RelevoService.getById(req.params.id);
        res.json({ ok: true, data: relevo });
    } catch (error) {
        res.status(404).json({ ok: false, error: error.message });
    }
};

export const getRelevosByProcesion = async (req, res) => {
    try {
        const relevos = await RelevoService.getByProcesion(req.params.procesionId);
        res.json({ ok: true, data: relevos });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const updateRelevo = async (req, res) => {
    try {
        const relevo = await RelevoService.update(req.params.id, req.body);
        res.json({ ok: true, data: relevo });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const deleteRelevo = async (req, res) => {
    try {
        const relevo = await RelevoService.delete(req.params.id);
        res.json({ ok: true, data: relevo });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};
