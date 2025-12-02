import HermandadService from '../services/hermandad.service.js';

const HermandadController = {
    // GET /api/hermandades
    async getAll(req, res, next) {
        try {
            const hermandades = await HermandadService.getAll();
            res.json({
                ok: true,
                data: hermandades
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/hermandades/:id
    async getById(req, res, next) {
        try {
            const {id} = req.params;
            const hermandad = await HermandadService.getById(id);
            res.json({
                ok: true,
                data: hermandad
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/hermandades
    async create(req, res, next) {
        try {
            const hermandad = await HermandadService.create(req.body);
            res.status(201).json({
                ok: true,
                data: hermandad
            });
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/hermandades/:id
    async update(req, res, next) {
        try {
            const {id} = req.params;
            const hermandad = await HermandadService.update(id, req.body);
            res.json({
                ok: true,
                data: hermandad
            });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/hermandades/:id
    async delete(req, res, next) {
        try {
            const {id} = req.params;
            await HermandadService.delete(id);
            res.json({
                ok: true,
                message: 'Hermandad eliminada correctamente'
            });
        } catch (error) {
            next(error);
        }
    }
};

export default HermandadController;
