import { db } from "../db/firebaseConfig.js";

export const GrupQueryServices = async (procesionId) => {

    const procesionSnap = await db.collection("procesiones").doc(procesionId).get();
    if (!procesionSnap.exists) {
        throw new Error("No existe una procesión con ese ID");
    }

    const procesionData = procesionSnap.data();
    const grupoRef = procesionData.grupoActual;

    if (!grupoRef) {
        throw new Error("La procesión no tiene un grupo asignado");
    }

    const grupoSnap = await grupoRef.get();
    if (!grupoSnap.exists) {
        throw new Error("El grupo referenciado no existe");
    }

    const grupoData = grupoSnap.data();
    const imagenRef = grupoData.idImagen;

    if (!imagenRef) {
        throw new Error("El grupo no tiene una imagen religiosa asignada");
    }

    const imagenSnap = await imagenRef.get();
    if (!imagenSnap.exists) {
        throw new Error("La imagen religiosa referenciada no existe");
    }

    const imagenData = imagenSnap.data();

    const ultimaActualizacion = procesionData.ultimaActualizacion?.toDate?.();
    const fechaFormateada = ultimaActualizacion
        ? ultimaActualizacion.toLocaleString("es-SV", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "America/El_Salvador"
        })
        : null;

    return {
        imagenUri: imagenData.imgURL ?? null,
        groupNumber: grupoData.numeroGrupo ?? null,
        headLine: imagenData.nombre ?? null,
        leader: grupoData.jefeGrupo ?? null,
        lastUpdateText: fechaFormateada
    };
};

