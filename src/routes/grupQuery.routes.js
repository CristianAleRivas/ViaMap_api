import { Router } from "express";
import { getGruposDeProcesiones } from "../controllers/grupQuery.controller.js";
const grupQueryRouter = Router();

grupQueryRouter.post("/procesiones", getGruposDeProcesiones);

export default grupQueryRouter;