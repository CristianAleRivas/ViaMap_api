import { Router } from "express";
import { GrupQueryServices } from "../services/grupQuery.service.js";

const grupQueryRouter = Router();

grupQueryRouter.get('/:id/', async(req, res) => {
    const { id } = req.params;
    try{
        const grupQuery = await GrupQueryServices(id);
        if(!grupQuery) return res.status(404).json({error: 'No encontrado'});
        res.json(grupQuery);
    }catch (err){
        res.status(500).json({error: err.message});
    }
});

export default grupQueryRouter;

