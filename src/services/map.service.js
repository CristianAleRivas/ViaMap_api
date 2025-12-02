import { db } from "../db/firebaseConfig.js";

export const obtenerRecorridoYEstaciones = async (procesionId) => {
  // Obtener procesión por ID
  const procesionSnap = await db
    .collection("procesiones")
    .doc(procesionId)
    .get();

  if (!procesionSnap.exists) {
    throw new Error("No existe una procesión con ese ID");
  }

  const procesionData = procesionSnap.data();

  // El campo 'recorrido' es una DocumentReference
  const recorridoRef = procesionData.recorrido;
  if (!recorridoRef) {
    throw new Error("La procesión no tiene referencia a recorrido");
  }

  // Obtener el recorrido
  const recorridoSnap = await recorridoRef.get();
  const recorridoData = recorridoSnap.data();

  const recorrido = recorridoData.coordenadas ?? [];

  // Leer subcolección de estaciones
  const estacionesSnap = await recorridoRef.collection("estaciones").get();

  const estaciones = [];

  for (const doc of estacionesSnap.docs) {
    const est = doc.data();

    // Obtener datos de la base de la estación
    const baseRef = est.baseRef;
    const baseData = baseRef ? (await baseRef.get()).data() : {};

    estaciones.push({
      idEstacion: doc.id,
      nombreEstacion: baseData.nombre,
      imagenEstacion: baseData.imagen,
      numeroEstacion: est.numero,
      ubicacionEstacion: est.ubicacion,
    });
  }

  // Obtener relevos de esta procesión
  const procesionRef = db.collection("procesiones").doc(procesionId);
  const relevosSnap = await db
    .collection("relevos")
    .where("idProcesion", "==", procesionRef)
    .get();

  const relevos = [];

  for (const doc of relevosSnap.docs) {
    const relevoData = doc.data();

    // Expandir referencias
    const grupoAnterior = relevoData.grupoAnterior ? await relevoData.grupoAnterior.get() : null;
    const grupoNuevo = relevoData.grupoNuevo ? await relevoData.grupoNuevo.get() : null;
    const imagen = relevoData.idImagen ? await relevoData.idImagen.get() : null;

    relevos.push({
      id: doc.id,
      grupoAnterior: grupoAnterior?.exists ? { id: grupoAnterior.id, ...grupoAnterior.data() } : null,
      grupoNuevo: grupoNuevo?.exists ? { id: grupoNuevo.id, ...grupoNuevo.data() } : null,
      idImagen: imagen?.exists ? { id: imagen.id, ...imagen.data() } : null,
      ubicacion: relevoData.ubicacion ? {
        latitude: relevoData.ubicacion._latitude,
        longitude: relevoData.ubicacion._longitude
      } : null,
      completado: relevoData.completado || false
    });
  }

  return {
    recorrido,
    estaciones,
    relevos,
    activo: procesionData.activo || false,
  };
};
