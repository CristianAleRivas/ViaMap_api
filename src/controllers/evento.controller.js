import EventoService from '../services/evento.service.js';

export const createEvento = async (req, res) => {
    try {
        const evento = await EventoService.create(req.body);
        res.status(201).json({ ok: true, data: evento });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const getAllEventos = async (req, res) => {
    try {
        const eventos = await EventoService.getAll();
        res.json({ ok: true, data: eventos });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const getUpcomingEventos = async (req, res) => {
    try {
        const eventos = await EventoService.getUpcoming();
        res.json({ ok: true, data: eventos });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const getEventoById = async (req, res) => {
    try {
        const evento = await EventoService.getById(req.params.id);
        if (!evento) {
            return res.status(404).json({ ok: false, error: 'Evento no encontrado' });
        }
        res.json({ ok: true, data: evento });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

export const updateEvento = async (req, res) => {
    try {
        const evento = await EventoService.update(req.params.id, req.body);
        res.json({ ok: true, data: evento });
    } catch (error) {
        res.status(400).json({ ok: false, error: error.message });
    }
};

export const deleteEvento = async (req, res) => {
    try {
        const evento = await EventoService.delete(req.params.id);
        res.json({ ok: true, data: evento });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};
