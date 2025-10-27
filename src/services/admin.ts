import { CalendarMonthState } from "@/types/admin";
import { BackendReservationDTO } from "@/types/reservation";
import type { AdminReservation } from "@/types/admin";



// Detección server/client + helper para URLs
const IS_SERVER = typeof window === "undefined";
const ORIGIN = IS_SERVER ? (process.env.APP_ORIGIN ?? "http://localhost:3000") : "";
const absolute = (path: string) => (IS_SERVER ? `${ORIGIN}${path}` : path);

// /** En server arma URL absoluta; en client deja la relativa */
// function absolute(path: string) {
//     return IS_SERVER ? `${ORIGIN}${path}` : path;
// }

// ⬇⬇⬇ NUEVO: fetch interno que reenvía cookies en server
async function fetchInternal(path: string, init: RequestInit = {}) {
    const url = absolute(path);
    const headers = new Headers(init.headers ?? undefined);
    if (IS_SERVER) {
        // Import dinámico para evitar usar next/headers en el cliente
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();    // await
        const cookieHeader = cookieStore.toString();   // convierte el store a string "k=v; k2=v2"
        if (cookieHeader) headers.set("cookie", cookieHeader);
    }
    // aseguramos no cachear
    return fetch(url, { cache: "no-store", ...init, headers });
}

export type AdminStatus = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED";

// export type AdminReservation = {
//     id: string;
//     createdAt: string;
//     reservationDate: string;
//     circuito: "A" | "B" | "C" | "D";
//     tipoVisitante: "PARTICULAR" | "INSTITUCION_EDUCATIVA";
//     nombre: string;     // institución o "Nombre Apellido"
//     apellido?: string;
//     telefono?: string;
//     correo?: string;
//     personas: number;   // adults14Plus + minors
//     status: "PENDING" | "CONFIRMED" | "CANCELLED";
// };


// Helper de check
async function ok<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let msg = `Error ${res.status}`;
        try {
            const j = await res.json();
            // if ((j as any)?.message) msg = (j as any).message;
            if (j?.message) msg = j.message;
        } catch { }
        throw new Error(msg);
    }
    return res.json() as Promise<T>;
}

// Headers por defecto para peticiones autenticadas 
// Por ahora no se usa "getAuthHeaders"

// const getAuthHeaders = () => {
//     const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
//     return {
//         'Authorization': token ? `Bearer ${token}` : '',
//         'Content-Type': 'application/json'
//     };
// };

export async function fetchReservations(
    status: AdminStatus = "PENDING",
    date?: string
): Promise<AdminReservation[]> {
    const params = new URLSearchParams();
    if (status && status !== "ALL") params.append("status", status);
    if (date) params.append("date", date);
    const qs = params.toString() ? `?${params}` : "";

    const res = await fetchInternal(`/api/admin/reservations${qs}`);
    const backendData = await ok<BackendReservationDTO[]>(res);

    console.log(`Reservas recibidas del backend: ${backendData.length}`, backendData.map(r => r.visitDate));

    // Mapear del formato backend al formato frontend
    return backendData.map((r) => ({
        id: r.id,
        createdAt: r.createdAt,
        reservationDate: r.visitDate,
        circuito: r.circuit as "A" | "B" | "C" | "D",
        tipoVisitante: r.visitorType === "EDUCATIONAL_INSTITUTION" ? "INSTITUCION_EDUCATIVA" :
            r.visitorType === "EVENT" ? "EVENTO" : "PARTICULAR",
        // "EDUCATIONAL_INSTITUTION" ? "INSTITUCION_EDUCATIVA" : "PARTICULAR",
        nombre: r.firstName,
        apellido: r.lastName,
        telefono: r.phone,
        correo: r.email,
        personas: r.adults18Plus + r.children2To17 + r.babiesLessThan2,
        status: r.status as "PENDING" | "CONFIRMED" | "CANCELLED",
    }));
}

//     return backendData.map((r) => {
//         const personas = r.adults18Plus + r.children2To17 + r.babiesLessThan2;

//         const tipoVisitante =
//             r.visitorType === "EDUCATIONAL_INSTITUTION"
//                 ? "INSTITUCION_EDUCATIVA"
//                 : r.visitorType === "EVENT"
//                     ? "EVENTO"
//                     : "PARTICULAR";

//         return {
//             id: r.id,
//             createdAt: r.createdAt,
//             reservationDate: r.visitDate,
//             circuito: r.circuit as "A" | "B" | "C" | "D",
//             tipoVisitante,
//             nombre: r.firstName,
//             apellido: r.lastName,
//             telefono: r.phone,
//             correo: r.email,
//             personas,
//             status: r.status as "PENDING" | "CONFIRMED" | "CANCELLED",
//         } satisfies AdminReservation;
//     });
// }

export async function confirmReservation(id: string): Promise<void> {

    const res = await fetchInternal(`/api/admin/reservations/${id}/confirm`, { method: "POST" });
    if (!res.ok) throw new Error("Error confirmando reserva");
}

export async function cancelReservation(id: string): Promise<void> {
    const res = await fetchInternal(`/api/admin/reservations/${id}/cancel`, { method: "POST" });
    if (!res.ok) throw new Error("Error cancelando reserva");
}

/* ============== CALENDARIO / DISPONIBILIDAD ============== */

// Carga el estado del mes (usa tu endpoint de Next que proxy al back)
export async function getCalendarState(year: number, month: number): Promise<CalendarMonthState> {
    const res = await fetchInternal(`/api/admin/availability/state?year=${year}&month=${month}`);
    return ok<CalendarMonthState>(res);
}

const DEFAULT_CAPACITY = Number(process.env.NEXT_PUBLIC_DEFAULT_CAPACITY ?? 30);

// Alterna un día: si hoy está deshabilitado, lo habilita; si está habilitado, lo deshabilita.
// En tu UI llamás: setDayEnabled(dateISO, isDisabled)  → el body manda { disabled: !isDisabled }
export async function setDayEnabled(dateISO: string, isDisabled: boolean): Promise<void> {
    // si hoy está deshabilitado (isDisabled=true) → habilitarlo => poner capacidad > 0
    // si hoy está habilitado          (isDisabled=false) → deshabilitar => capacidad 0
    const nextCapacity = isDisabled ? DEFAULT_CAPACITY : 0;

    const res = await fetchInternal(`/api/admin/availability/${dateISO}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capacity: nextCapacity }),
    });
    if (!res.ok) throw new Error(`Error ${res.status} al actualizar el día`);
}

// Alterna todo el mes
export async function setMonthEnabled(year: number, month: number, disabled: boolean): Promise<void> {
    const res = await fetchInternal(`/api/admin/availability/state?year=${year}&month=${month}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: !disabled }),
    });
    if (!res.ok) throw new Error(`Error ${res.status} al actualizar el mes`);
}


// === Dashboard helpers ===
export type AdminSummary = {
    all: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    today: number; // reservas con fecha de visita = hoy
};

export async function getAdminSummary(): Promise<AdminSummary> {
    const all = await fetchReservations("ALL");

    const counts = all.reduce(
        (acc, r) => {
            acc.all++;
            acc[r.status]++; // r.status: "PENDING" | "CONFIRMED" | "CANCELLED"
            return acc;
        },
        // keys en MAYÚSCULA para que coincidan con r.status
        { all: 0, PENDING: 0, CONFIRMED: 0, CANCELLED: 0 } as
        { all: number } & Record<AdminReservation["status"], number>
    );

    const todayISO = new Date().toISOString().slice(0, 10);
    const today = all.filter(r => r.reservationDate.slice(0, 10) === todayISO).length;

    // devolvemos en minúscula como pide AdminSummary
    return {
        all: counts.all,
        pending: counts.PENDING,
        confirmed: counts.CONFIRMED,
        cancelled: counts.CANCELLED,
        today,
    };
}

export async function fetchRecentReservations(limit = 10) {
    const all = await fetchReservations("ALL");
    return all
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
}


// Eventos

export type CreateEventInput = {
    titulo: string;
    // Guardamos en el form como string UTC con 'Z', porque es lo que pide el back
    // Ej: "2025-11-15T17:00:00.000Z"
    fechaISO: string;
    circuito?: string | null;
    cupo?: number | undefined;
    notas?: string | null;
};

// Helpers de fecha
// v: "YYYY-MM-DDTHH:mm" (hora local)  ->  "YYYY-MM-DDTHH:mm:ss.sssZ" (UTC)
export function localInputToUtcZ(v: string): string {
    return v ? new Date(v).toISOString() : "";
}

// utcZ: "YYYY-MM-DDTHH:mm:ss.sssZ" -> "YYYY-MM-DDTHH:mm" (para <input type="datetime-local">)
export function utcZToLocalInput(utcZ: string): string {
    if (!utcZ) return "";
    const d = new Date(utcZ); // ese instante
    const pad = (n: number) => String(n).padStart(2, "0");
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${y}-${m}-${day}T${hh}:${mm}`;
}

// Mapea a los nombres EXACTOS del backend
function mapToCreateEventRequest(input: CreateEventInput) {
    return {
        titulo: input.titulo.trim(),
        fechaISO: input.fechaISO,                     // ya en UTC con Z
        circuito: input.circuito?.trim() || null,
        cupo: input.cupo ?? null,
        notas: input.notas?.trim() || null,
    };
}

export async function createEventReservation(
    input: CreateEventInput
): Promise<{ id: string }> {
    const payload = mapToCreateEventRequest(input);

    const res = await fetch("/api/admin/eventos", {
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


export type BookingFlags = { individualEnabled: boolean; schoolEnabled: boolean };

// PÚBLICO (sitio)
export async function getPublicBookingFlags(): Promise<BookingFlags> {
    const r = await fetch("/api/booking-flags", { cache: "no-store" });
    if (!r.ok) throw new Error("No se pudo leer flags");
    // const j = await r.json(); // { enabled: boolean }
    // return {
    //     individualEnabled: true,    // hoy siempre habilitado (no hay endpoint)
    //     schoolEnabled: !!j.enabled, // mapeo desde el back
    // };
    return r.json();
}


// ADMIN (panel)
export async function getAdminBookingFlags(): Promise<BookingFlags> {
    const r = await fetch("/api/admin/booking-flags", { cache: "no-store" });
    if (!r.ok) throw new Error("No se pudo leer flags (admin)");
    const j = await r.json(); // { enabled: boolean }
    return {
        individualEnabled: true,
        schoolEnabled: !!j.enabled,
    };
}

export async function setAdminBookingFlags(f: BookingFlags): Promise<void> {
    // ⚠️ el back espera { enabled: boolean }
    const r = await fetch("/api/admin/booking-flags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !!f.schoolEnabled }),
    });
    if (!r.ok) throw new Error("No se pudo guardar flags");
}
