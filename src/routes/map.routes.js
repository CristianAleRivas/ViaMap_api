import { Router } from "express";
import { getMap } from "../controllers/map.controller.js";

const mapRouter = Router();

mapRouter.get("/:procesionId", getMap);
export default mapRouter;
