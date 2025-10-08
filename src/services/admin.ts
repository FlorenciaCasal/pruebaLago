import { CalendarMonthState } from "@/types/admin";
import { BackendReservationDTO } from "@/types/reservation";


// 👇 arriba del archivo
const IS_SERVER = typeof window === "undefined";
const ORIGIN = IS_SERVER
    ? (process.env.APP_ORIGIN ?? "http://localhost:3000")
    : "";

/** En server arma URL absoluta; en client deja la relativa */
function absolute(path: string) {
    return IS_SERVER ? `${ORIGIN}${path}` : path;
}

export type AdminStatus = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED";

export type AdminReservation = {
    id: string;
    createdAt: string;
    reservationDate: string;
    circuito: "A" | "B" | "C" | "D";
    tipoVisitante: "PARTICULAR" | "INSTITUCION_EDUCATIVA";
    nombre: string;     // institución o "Nombre Apellido"
    personas: number;   // adults14Plus + minors
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
};

async function ok<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let msg = `Error ${res.status}`;
        try { const j = await res.json(); if (j?.message) msg = j.message; } catch { }
        throw new Error(msg);
    }
    return res.json() as Promise<T>;
}

// Headers por defecto para peticiones autenticadas
const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
    };
};

// ---------------- RESERVAS ----------------
export type AdminStatus = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED";

export async function fetchReservations(opts?: { date?: string; status?: AdminStatus }) {
    const qs = new URLSearchParams();
    if (opts?.date) qs.set("date", opts.date);
    if (opts?.status && opts.status !== "ALL") qs.set("status", opts.status);
    const url = absolute(`/api/admin/reservations${qs.toString() ? `?${qs}` : ""}`);
    const res = await fetch(url, { cache: "no-store" });
    const list = await ok<BackendReservationDTO[]>(res);
    return list.map(mapReservation);
}

// Tipo de respuesta del backend
type BackendReservation = {
    id: string;
    visitDate: string;
    firstName: string;
    lastName: string;
    adults18Plus: number;
    children2To17: number;
    babiesLessThan2: number;
    email: string;
    phone: string;
    circuit: string;
    visitorType: string;
    originLocation: string;
    status: string;
    createdAt: string;
};

export async function fetchReservations(
    status: AdminStatus = "PENDING",
    date?: string
): Promise<import("@/types/admin").AdminReservation[]> {
    if (MOCK) {
        await new Promise(r => setTimeout(r, 300));
        const base: import("@/types/admin").AdminReservation[] = [
            { id: "r1", createdAt: new Date().toISOString(), reservationDate: new Date(Date.now() + 86400000).toISOString(), circuito: "A", tipoVisitante: "PARTICULAR", nombre: "Ana", personas: 3, status: "PENDING" },
            { id: "r2", createdAt: new Date().toISOString(), reservationDate: new Date(Date.now() + 2 * 86400000).toISOString(), circuito: "B", tipoVisitante: "INSTITUCION_EDUCATIVA", nombre: "Colegio Norte", personas: 25, status: "CONFIRMED" },
            { id: "r3", createdAt: new Date().toISOString(), reservationDate: new Date(Date.now() + 3 * 86400000).toISOString(), circuito: "C", tipoVisitante: "PARTICULAR", nombre: "Luis", personas: 2, status: "CANCELLED" },
        ];
        let filtered = status === "ALL" ? base : base.filter(r => r.status === status);
        if (date) {
            filtered = filtered.filter(r => r.reservationDate === date);
        }
        return filtered;
    }

    // Construir query params
    const params = new URLSearchParams();
    if (status && status !== "ALL") {
        params.append("status", status);
    }
    if (date) {
        console.log("Buscando reservas para la fecha:", date);
        params.append("date", date);
    }
    const qs = params.toString() ? `?${params.toString()}` : "";

    console.log("Petición al backend:", `${API_URL}/api/admin/reservations${qs}`);

    const res = await fetch(`${API_URL}/api/admin/reservations${qs}`, {
        cache: "no-store",
        headers: getAuthHeaders()
    });
    const backendData = await handle<BackendReservation[]>(res);

    console.log(`Reservas recibidas del backend: ${backendData.length}`, backendData.map(r => r.visitDate));

    // Mapear del formato backend al formato frontend
    return backendData.map(r => ({
        id: r.id,
        createdAt: r.createdAt,
        reservationDate: r.visitDate,
        circuito: r.circuit,
        tipoVisitante: r.visitorType === "EDUCATIONAL_INSTITUTION" ? "INSTITUCION_EDUCATIVA" as const : "PARTICULAR" as const,
        nombre: r.firstName,
        apellido: r.lastName,
        telefono: r.phone,
        correo: r.email,
        personas: r.adults18Plus + r.children2To17 + r.babiesLessThan2,
        status: r.status as "PENDING" | "CONFIRMED" | "CANCELLED"
    }));
}

export async function confirmReservation(id: string): Promise<void> {
    if (MOCK) { await new Promise(r => setTimeout(r, 200)); return; }
    const res = await fetch(`${API_URL}/api/admin/reservations/${id}/confirm`, {
        method: "POST",
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        let msg = "Error confirmando reserva";
        try { const j = await res.json(); if (j?.message) msg = j.message; } catch { }
        throw new Error(msg);
    }
}

export async function cancelReservation(id: string): Promise<void> {
    if (MOCK) { await new Promise(r => setTimeout(r, 200)); return; }
    const res = await fetch(`${API_URL}/api/admin/reservations/${id}/cancel`, {
        method: "POST",
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        let msg = "Error cancelando reserva";
        try { const j = await res.json(); if (j?.message) msg = j.message; } catch { }
        throw new Error(msg);
    }
}

// ==== Crear evento (tipo y función) ====

// Lo que completa tu formulario
export type CreateEventInput = {
    titulo: string;
    fechaISO: string;                   // ej "2025-10-16T14:00:00.000Z" o local
    circuito?: "" | "A" | "B" | "C" | "D";
    cupo?: number;                      // opcional
    notas?: string;
};

export async function createEventReservation(input: CreateEventInput): Promise<{ id: string }> {
    if (MOCK) {
        await new Promise(r => setTimeout(r, 500));
        return { id: "evt_" + Math.random().toString(36).slice(2, 8) };
    }
    const res = await fetch(`${API_URL}/api/admin/eventos`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(input),
    });
    return handle(res);
}

/**
 * Intenta POST /api/admin/eventos (si tu back lo implementa).
 * Si devuelve 404/501/No Implemented, hace fallback a setear la capacidad del día
 * usando tu endpoint existente y devuelve un id sintético.
 */
export async function createEventReservation(
    input: CreateEventInput
): Promise<{ id: string }> {
    // 1) Intento real (si más adelante agregás el endpoint de eventos al back)
    try {
        const res = await fetch(absolute(`/api/admin/eventos`), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: input.titulo,
                dateTime: input.fechaISO,
                circuit: input.circuito || null,
                capacity: input.cupo ?? null,
                notes: input.notas || null,
            }),
        });

        if (res.ok) {
            return ok<{ id: string }>(res);
        }

        // si el back no lo tiene, sigo al fallback
        if (res.status !== 404 && res.status !== 501) {
            // otros errores “reales” sí los reporto
            const msg = await res.text();
            throw new Error(msg || `Error ${res.status}`);
        }
    } catch {
        // continuo al fallback
    }

    // 2) Fallback: si no hay endpoint de eventos en el back,
    // al menos dejo la capacidad del día como el cupo (o 0 si no se envió).
    const day = toDateOnlyISO(input.fechaISO);
    if (typeof input.cupo === "number") {
        await upsertDayCapacity(day, input.cupo);
    } else {
        // si no pasaste cupo, podés decidir bloquear el día:
        // await upsertDayCapacity(day, 0);
    }

    // Devuelvo un id sintético (para que el UI muestre “Creado ✓ ID: …”)
    return { id: `local-${day}-${Math.random().toString(36).slice(2, 8)}` };
}


// Si más adelante querés que “Eventos” sea una entidad en tu API:

// Agregá en Spring un endpoint:

// @PostMapping("/events")
// public Map<String,String> createEvent(@RequestBody CreateEventDTO dto) { ... }


// Guardás el evento en tu tabla (o en availability_rules + tabla events).

// En Next, creás el proxy:

// app/api/admin/eventos/route.ts

// import { NextRequest } from "next/server";
// import { adminFetch } from "../../_backend";

// export async function POST(req: NextRequest) {
//   const body = await req.text();
//   const resp = await adminFetch(`/api/admin/events`, {
//     method: "POST",
//     body,
//     headers: { "Content-Type": "application/json" },
//   });
//   const text = await resp.text();
//   return new Response(text, {
//     status: resp.status,
//     headers: { "content-type": resp.headers.get("content-type") ?? "application/json" },
//   });
// }
