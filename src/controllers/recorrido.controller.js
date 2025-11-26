import RecorridoService from '../services/recorrido.service.js';

export const createRecorrido = async (req, res) => {
    try {
        const recorrido = await RecorridoService.create(req.body);
        res.status(201).json({ ok: true, data: recorrido });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const getAllRecorridos = async (req, res) => {
    try {
        const recorridos = await RecorridoService.getAll();
        res.json({ ok: true, data: recorridos });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const getRecorridoById = async (req, res) => {
    try {
        const recorrido = await RecorridoService.getById(req.params.id);
        if (!recorrido) {
            return res.status(404).json({ ok: false, error: 'Recorrido no encontrado' });
        }
        res.json({ ok: true, data: recorrido });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const duplicateRecorrido = async (req, res) => {
    try {
        const recorrido = await RecorridoService.duplicate(req.params.id);
        res.status(201).json({ ok: true, data: recorrido });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const updateRecorrido = async (req, res) => {
    try {
        const recorrido = await RecorridoService.update(req.params.id, req.body);
        res.json({ ok: true, data: recorrido });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const deleteRecorrido = async (req, res) => {
    try {
        const recorrido = await RecorridoService.delete(req.params.id);
        res.json({ ok: true, data: recorrido });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const createRecorridoWithEstaciones = async (req, res) => {
    try {
        const recorrido = await RecorridoService.createWithEstaciones(req.body);
        res.status(201).json({ ok: true, data: recorrido });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const addEstacion = async (req, res) => {
    try {
        const estacion = await RecorridoService.addEstacion(req.params.id, req.body);
        res.status(201).json({ ok: true, data: estacion });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const getEstaciones = async (req, res) => {
    try {
        const estaciones = await RecorridoService.getEstaciones(req.params.id);
        res.json({ ok: true, data: estaciones });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const deleteEstacion = async (req, res) => {
    try {
        const estacion = await RecorridoService.deleteEstacion(req.params.recorridoId, req.params.estacionId);
        res.json({ ok: true, data: estacion });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const getRecorridoCompleto = async (req, res) => {
    try {
        const recorrido = await RecorridoService.getRecorridoCompleto(req.params.id);
        res.json({ ok: true, data: recorrido });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const updateEstacion = async (req, res) => {
    try {
        const estacion = await RecorridoService.updateEstacion(
            req.params.recorridoId, 
            req.params.estacionId, 
            req.body
        );
        res.json({ ok: true, data: estacion });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const updateRecorridoCompleto = async (req, res) => {
    try {
        const recorrido = await RecorridoService.updateRecorridoCompleto(req.params.id, req.body);
        res.json({ ok: true, data: recorrido });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};
