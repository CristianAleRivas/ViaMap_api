import express from "express";
import cors from "cors";
//import { env } from "../config/env.config.js";
import routes from "../routes/index.routes.js";
import { errorHandler } from "../middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export default app;