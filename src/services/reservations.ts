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

  const res = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
