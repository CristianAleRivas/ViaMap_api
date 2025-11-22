import { db } from "../db/firebaseConfig.js";

export const GrupQueryServices = async (procesionIds = []) => {

    if (!Array.isArray(procesionIds) || procesionIds.length === 0) {
        throw new Error("Debes enviar un array de IDs de procesiones");
    }

    // Procesamos todas las IDs en paralelo
    const resultados = await Promise.all(
        procesionIds.map(async (procesionId) => {

            const procesionSnap = await db.collection("procesiones").doc(procesionId).get();
            if (!procesionSnap.exists) {
                return { error: `No existe la procesión con ID: ${procesionId}` }; 
            }

            const procesionData = procesionSnap.data();
            const grupoRef = procesionData.grupoActual;

            if (!grupoRef) {
                return { error: `La procesión ${procesionId} no tiene un grupo asignado` };
            }

            const grupoSnap = await grupoRef.get();
            if (!grupoSnap.exists) {
                return { error: `El grupo referenciado no existe para procesión ${procesionId}` };
            }

            const grupoData = grupoSnap.data();
            const imagenRef = grupoData.idImagen;

            if (!imagenRef) {
                return { error: `El grupo de la procesión ${procesionId} no tiene imagen religiosa` };
            }

            const imagenSnap = await imagenRef.get();
            if (!imagenSnap.exists) {
                return { error: `La imagen religiosa no existe para procesión ${procesionId}` };
            }

            const imagenData = imagenSnap.data();

            const ultimaActualizacion = procesionData.ultimaActualizacion?.toDate?.();
            const fechaFormateada = ultimaActualizacion
                ? ultimaActualizacion.toLocaleString("es-SV", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "America/El_Salvador",
                  })
                : null;

            return {
                procesionId,
                imagenUri: imagenData.imgURL ?? null,
                groupNumber: grupoData.numeroGrupo ?? null,
                headLine: imagenData.nombre ?? null,
                leader: grupoData.jefeGrupo ?? null,
                lastUpdateText: fechaFormateada,
            };
        })
    );

    return resultados;
};
