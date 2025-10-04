import type { ReservationFormData } from "@/types/reservation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MOCK_SUBMIT = !API_URL;

export async function submitReservation(data: ReservationFormData & { reservationDate: string; totalPersonas: number; }): Promise<void> {
  if (MOCK_SUBMIT) {
    await new Promise((r) => setTimeout(r, 700));
    return;
  }

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
    adults14Plus: data.adultos,
    minors: data.ninos + data.bebes,
    reducedMobility: data.movilidadReducida || 0,
    allergies: data.alergias === "si",
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
    let msg = "Error creando reserva";
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
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
