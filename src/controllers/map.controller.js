import { obtenerRecorridoYEstaciones } from "../services/map.service.js";

export const getMap = async (req, res) => {
  try {
    const { procesionId } = req.params;

    const data = await obtenerRecorridoYEstaciones(procesionId);

    return res.json({
      ok: true,
      data
    });

  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: "Error al obtener el mapa completo",
      error: error.message
    });
  }
};

