import type { ReservationFormData } from "@/types/reservation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type BackendError = { code?: string; message?: string; detail?: string };
type AppError = Error & { code?: string };

function makeError(message: string, code?: string): AppError {
  const e = new Error(message) as AppError;
  if (code) e.code = code;
  return e;
}

function mapVisitorType(t?: ReservationFormData["tipoVisitante"]) {
  return t === "INSTITUCION_EDUCATIVA" ? "EDUCATIONAL_INSTITUTION" : "INDIVIDUAL";
}

// function mapHowHeard(v?: ComoNosConociste) {
//   switch (v) {
//     case "redes": return "SOCIAL";
//     case "recomendacion": return "RECOMMENDATION";
//     case "sitio": return "WEBSITE";
//     case "publicidad": return "ADS";
//     default: return "OTHER";
//   }
// }

async function tryParseJson(res: Response): Promise<BackendError | null> {
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    try { return await res.json(); } catch { }
  }
  return null;
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
  const reducedMobility = Number(data.movilidadReducida ?? 0);

  const visitors = (data.visitantes ?? []).map(v => ({
    firstName: v.nombre,
    lastName: v.apellido,
    dni: v.dni,
    phone: v.telefono?.trim() || null,
  }));


  // Mapear datos del frontend al formato del backend
  const backendData = {
    visitDate: data.fechaISO,                 // YYYY-MM-DD
    firstName,
    lastName,
    dni,
    phone,
    email,
    circuit: "A", // Por defecto circuito A
    visitorType: mapVisitorType(data.tipoVisitante),
    institutionName: isSchool ? (data.institucion ?? null) : null,
    institutionStudents: isSchool ? (adultos + ninos + bebes) : null,
    adults18Plus: data.adultos,
    children2To17: data.ninos,
    babiesLessThan2: data.bebes,
    reducedMobility,
    comment: data.comentarios || "",
    originLocation,
    howHeard: "OTHER",
    acceptedPolicies: data.aceptaReglas,
    visitors,
  };

  const res = await fetch(`/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendData),
  });

  if (!res.ok) {
    const server = await tryParseJson(res); // null si no es JSON
    const retryAfter = res.headers.get("retry-after");
    const defaultMsg = `Error HTTP ${res.status}`;

    // 409: duplicado DNI+fecha
    if (res.status === 409) {
      throw makeError(
        server?.message ?? "Ya existe una reserva para ese DNI en esa fecha.",
        server?.code ?? "DUPLICATE_DNI_DATE"
      );
    }

    // 403: escuelas deshabilitadas
    if (res.status === 403) {
      throw makeError(
        server?.message ?? " En este momento no tenemos disponibilidad para instituciones educativas.",
        server?.code ?? "SCHOOL_DISABLED"
      );
    }

    // 400/422: validaciones de negocio
    if (res.status === 400 || res.status === 422) {
      throw makeError(server?.message ?? server?.detail ?? "Datos inválidos.", server?.code ?? "VALIDATION");
    }

    // 429: rate limiting (por si algún día lo agregás)
    if (res.status === 429) {
      const extra = retryAfter ? ` Intentalo de nuevo en ${retryAfter}s.` : "";
      throw makeError(server?.message ?? `Demasiadas solicitudes.${extra}`, server?.code ?? "RATE_LIMIT");
    }

    // Fallback genérico
    throw makeError(server?.message ?? defaultMsg, server?.code);
  }

  return res.json();
}


// (Opcional) para corroborar que se guardó:
export async function getReservation(id: string) {
  const res = await fetch(`${API_URL}/api/reservations/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Error obteniendo reserva ${id}`);
  return res.json();
}

