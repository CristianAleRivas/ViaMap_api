import express from "express";
import { env } from "../config/env.config.js";
import routes from "../routes/index.routes.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import {eventoRoutes} from "../routes/evento.routes.js";

const app = express();

app.use(express.json());
app.use('/api', routes);
app.use('/evento', eventoRoutes);
app.use(errorHandler);

export default app;