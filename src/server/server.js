import app from "./app.js";
import { env } from "../config/env.config.js";

app.listen(env.port, () => {
    console.log(`🚀 Servidor corriendo en puerto ${env.port}`);
});
