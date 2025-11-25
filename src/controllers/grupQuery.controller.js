import { GrupQueryServices } from "../services/grupQuery.service.js";

export const getGruposDeProcesiones = async (req, res) => {
    try {
        console.log('Body recibido:', JSON.stringify(req.body));
        console.log('IDs recibidos:', req.body?.ids);
        
        const ids = req.body?.ids;

        if (!Array.isArray(ids) || ids.length === 0) {
            console.error('IDs inválidos o vacíos');
            return res.status(400).json({
                ok: false,
                message: "Debes enviar un array de IDs en 'ids'."
            });
        }

        console.log(`Procesando ${ids.length} IDs:`, ids);
        const resultados = await GrupQueryServices(ids);

        return res.status(200).json({
            ok: true,
            count: resultados.length,
            data: resultados
        });

    } catch (err) {
        console.error("Error en getGruposDeProcesiones:", err);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: err.message
        });
    }
};
