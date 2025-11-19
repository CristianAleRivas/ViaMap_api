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

  return {
    recorrido,
    estaciones,
  };
};
