import BaseEstacionService from '../services/baseEstacion.service.js';

export const createBaseEstacion = async (req, res) => {
    try {
        const baseEstacion = await BaseEstacionService.create(req.body);
        res.status(201).json({ ok: true, data: baseEstacion });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const getAllBaseEstaciones = async (req, res) => {
    try {
        const baseEstaciones = await BaseEstacionService.getAll();
        res.json({ ok: true, data: baseEstaciones });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const getBaseEstacionById = async (req, res) => {
    try {
        const baseEstacion = await BaseEstacionService.getById(req.params.id);
        if (!baseEstacion) {
            return res.status(404).json({ ok: false, error: 'Base de estación no encontrada' });
        }
        res.json({ ok: true, data: baseEstacion });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const updateBaseEstacion = async (req, res) => {
    try {
        const baseEstacion = await BaseEstacionService.update(req.params.id, req.body);
        res.json({ ok: true, data: baseEstacion });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const deleteBaseEstacion = async (req, res) => {
    try {
        const baseEstacion = await BaseEstacionService.delete(req.params.id);
        res.json({ ok: true, data: baseEstacion });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};
