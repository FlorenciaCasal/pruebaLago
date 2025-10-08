import { CalendarMonthState } from "@/types/admin";


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

function mapReservation(r: any): AdminReservation {
    return {
        id: r.id,
        createdAt: r.createdAt ?? r.created_at,
        reservationDate: r.visitDate ?? r.visit_date,
        circuito: r.circuit,
        tipoVisitante: r.visitorType === "EDUCATIONAL_INSTITUTION" ? "INSTITUCION_EDUCATIVA" : "PARTICULAR",
        nombre: r.institutionName || `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim(),
        personas: (r.adults14Plus ?? 0) + (r.minors ?? 0),
        status: r.status,
    };
}

export async function fetchReservations(opts?: { date?: string; status?: AdminStatus }) {
    const qs = new URLSearchParams();
    if (opts?.date) qs.set("date", opts.date);
    if (opts?.status && opts.status !== "ALL") qs.set("status", opts.status);
    const url = absolute(`/api/admin/reservations${qs.toString() ? `?${qs}` : ""}`);
    const res = await fetch(url, { cache: "no-store" });
    const list = await ok<any[]>(res);
    return list.map(mapReservation);
}

export async function confirmReservation(id: string) {
    const res = await fetch(absolute(`/api/admin/reservations/${id}/confirm`), { method: "POST" });
    if (!res.ok) throw new Error("No se pudo confirmar");
}

export async function cancelReservation(id: string) {
    const res = await fetch(absolute(`/api/admin/reservations/${id}/cancel`), { method: "POST" });
    if (!res.ok) throw new Error("No se pudo cancelar");
}

// export async function upsertDayCapacity(dateISO: string, capacity: number) {
//   const res = await fetch(`/api/admin/availability/${dateISO}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ capacity }),
//   });
//   if (!res.ok) throw new Error("No se pudo guardar la capacidad");
// }
// Obtiene el estado del mes desde el endpoint público /api/availability?month=YYYY-MM
export async function getCalendarState(year: number, month: number): Promise<CalendarMonthState> {
    const mm = String(month).padStart(2, "0");
    const res = await fetch(`/api/admin/availability-proxy?month=${year}-${mm}`, { cache: "no-store" });
    // ↑ Si ya tenés un proxy directo, usalo. Si no, podés llamar a NEXT_PUBLIC_API_URL + /api/availability
    if (!res.ok) throw new Error("No se pudo cargar el mes");

    // respuesta del back (ejemplo)
    type AvailabilityDTO = { availableDate: string; totalCapacity: number | null; remainingCapacity: number | null; };
    const data: AvailabilityDTO[] = await res.json();

    // Día se considera "deshabilitado" si totalCapacity === 0
    const disabledDays = data.filter(d => (d.totalCapacity ?? 0) <= 0).map(d => d.availableDate);

    return { year, month, disabled: false, disabledDays } as const;
}

// Upsert real: PUT /api/admin/availability/{date}  con { capacity }
export async function upsertDayCapacity(dateISO: string, capacity: number) {
    const res = await fetch(`/api/admin/availability/${dateISO}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capacity }),
    });
    if (!res.ok) throw new Error("No se pudo guardar la capacidad");
}

export async function downloadCsv(params: { date: string; status?: "PENDING" | "CONFIRMED" | "CANCELLED"; visitorType?: "INDIVIDUAL" | "EDUCATIONAL_INSTITUTION"; mask?: boolean }) {
    const qs = new URLSearchParams({ date: params.date });
    if (params.status) qs.set("status", params.status);
    if (params.visitorType) qs.set("visitorType", params.visitorType);
    if (params.mask) qs.set("mask", "true");

    const res = await fetch(`/api/admin/reservations/export?${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo exportar CSV");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservas_${params.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function todayISO(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/** Resumen para el dashboard: totales, hoy, pendientes */
export async function getAdminSummary(): Promise<{ total: number; today: number; pending: number }> {
    const tISO = todayISO();

    const [allRes, todayRes, pendingRes] = await Promise.all([
        fetch(absolute(`/api/admin/reservations`), { cache: "no-store" }),
        fetch(absolute(`/api/admin/reservations?date=${tISO}`), { cache: "no-store" }),
        fetch(absolute(`/api/admin/reservations?status=PENDING`), { cache: "no-store" }),
    ]);

    const all = await ok<any[]>(allRes);
    const today = await ok<any[]>(todayRes);
    const pending = await ok<any[]>(pendingRes);

    return { total: all.length, today: today.length, pending: pending.length };
}

/** Últimas N reservas ordenadas por creación (o visita si no viniera createdAt) */
export async function fetchRecentReservations(limit = 10) {
    const res = await fetch(absolute(`/api/admin/reservations`), { cache: "no-store" });
    const list = await ok<any[]>(res);
    const mapped = list.map(mapReservation);

    mapped.sort((a, b) => {
        const aKey = a.createdAt ?? a.reservationDate;
        const bKey = b.createdAt ?? b.reservationDate;
        return (bKey || "").localeCompare(aKey || "");
    });

    return mapped.slice(0, limit);
}

