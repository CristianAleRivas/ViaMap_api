import ProcesionService from '../services/procesion.service.js';

export const createProcesion = async (req, res) => {
    try {
        const procesion = await ProcesionService.create(req.body);
        res.status(201).json({ ok: true, data: procesion });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const getAllProcesiones = async (req, res) => {
    try {
        const procesiones = await ProcesionService.getAll();
        res.json({ ok: true, data: procesiones });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const getProcesionById = async (req, res) => {
    try {
        const procesion = await ProcesionService.getById(req.params.id);
        if (!procesion) {
            return res.status(404).json({ ok: false, error: 'Procesión no encontrada' });
        }
        res.json({ ok: true, data: procesion });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const updateProcesion = async (req, res) => {
    try {
        const procesion = await ProcesionService.update(req.params.id, req.body);
        res.json({ ok: true, data: procesion });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const deleteProcesion = async (req, res) => {
    try {
        const procesion = await ProcesionService.delete(req.params.id);
        res.json({ ok: true, data: procesion });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const getUpcomingProcesiones = async (req, res) => {
    try {
        const procesiones = await ProcesionService.getUpcoming();
        res.json({ ok: true, data: procesiones });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const getActivasProcesiones = async (req, res) => {
    try {
        const procesiones = await ProcesionService.getActivas();
        res.json({ ok: true, data: procesiones });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const getActivasIdsProcesiones = async (req, res) => {
    try {
        const ids = await ProcesionService.getActivasIds();
        res.json({ ok: true, data: ids });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};
