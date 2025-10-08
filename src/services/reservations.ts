import type { ReservationFormData, ComoNosConociste } from "@/types/reservation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function mapVisitorType(t?: ReservationFormData["tipoVisitante"]) {
  return t === "INSTITUCION_EDUCATIVA" ? "EDUCATIONAL_INSTITUTION" : "INDIVIDUAL";
}

function mapHowHeard(v?: ComoNosConociste) {
  switch (v) {
    case "redes": return "SOCIAL";
    case "recomendacion": return "RECOMMENDATION";
    case "sitio": return "WEBSITE";
    case "publicidad": return "ADS";
    default: return "OTHER";
  }
}

export async function submitReservation(data: ReservationFormData): Promise<{ id: string; status: string }> {
  const adultos = Number(data.adultos ?? 0);
  const ninos = Number(data.ninos ?? 0);
  const bebes = Number(data.bebes ?? 0);
  const isSchool = data.tipoVisitante === "INSTITUCION_EDUCATIVA";
  const originLocation = (isSchool ? data.institucionLocalidad : data.origenVisita)?.trim() ?? "";

  if (!data.fechaISO) throw new Error("Falta la fecha de la reserva (fechaISO)");

  // 👇 elegir origen de los campos de RESPONSABLE según el tipo
  const firstName = (isSchool ? data.responsableNombre : data.nombre)?.trim() ?? "";
  const lastName = (isSchool ? data.responsableApellido : data.apellido)?.trim() ?? "";
  const dni = (isSchool ? data.responsableDni : data.dni)?.trim() ?? "";
  const phone = (isSchool ? data.institucionTelefono : data.telefono)?.trim() ?? "";
  const email = (isSchool ? data.institucionEmail : data.correo)?.trim() ?? "";

  // Front -> Backend (CreateReservationRequest)
  const payload = {
    visitDate: data.fechaISO,                 // YYYY-MM-DD
    firstName,
    lastName,
    dni,
    phone,
    email,

    circuit: "A",                                     // mientras no elijas circuitos en el UI
    visitorType: mapVisitorType(data.tipoVisitante),

    institutionName: isSchool ? (data.institucion ?? null) : null,
    institutionStudents: isSchool ? (adultos + ninos + bebes) : null,

    adults14Plus: adultos,
    minors: ninos + bebes,
    reducedMobility: Number(data.movilidadReducida ?? 0),
    allergies: (data.alergias ?? "no") === "si",

    comment: data.comentarios ?? "—",
    originLocation,
    howHeard: mapHowHeard(data.comoNosConociste),
    acceptedPolicies: !!data.aceptaReglas,
  };

  // Mapear datos del frontend al formato del backend
  const backendData = {
    visitDate: data.reservationDate,
    firstName: data.nombre || "",
    lastName: data.apellido || "",
    dni: data.dni || "",
    phone: data.telefono || "",
    email: data.correo || "",
    circuit: "A" as const, // Por defecto circuito A
    visitorType: data.tipoVisitante === "INSTITUCION_EDUCATIVA" ? "EDUCATIONAL_INSTITUTION" : "INDIVIDUAL",
    institutionName: data.institucion || null,
    institutionStudents: data.tipoVisitante === "INSTITUCION_EDUCATIVA" ? (data.adultos + data.ninos + data.bebes) : null,
    adults18Plus: data.adultos,
    children2To17: data.ninos,
    babiesLessThan2: data.bebes,
    reducedMobility: data.movilidadReducida || 0,
    allergies: data.alergias === "si" ? 1 : 0,
    comment: data.comentarios || "",
    originLocation: data.origenVisita || "",
    howHeard: mapComoNosConociste(data.comoNosConociste),
    acceptedPolicies: data.aceptaReglas
  };

  const res = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendData),
  });

  if (!res.ok) {
    let msg = `Error HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch { }
    throw new Error(msg);
  }
  return res.json();
}

// (Opcional) para corroborar que se guardó:
export async function getReservation(id: string) {
  const res = await fetch(`${API_URL}/api/reservations/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error obteniendo reserva ${id}`);
  return res.json();
}

// Función para mapear ComoNosConociste al enum del backend
function mapComoNosConociste(como?: string): string {
  const mapping: Record<string, string> = {
    "redes": "SOCIAL",
    "recomendacion": "RECOMMENDATION", 
    "sitio": "WEBSITE",
    "publicidad": "ADS",
    "otro": "OTHER"
  };
  return mapping[como || ""] || "OTHER";
}
