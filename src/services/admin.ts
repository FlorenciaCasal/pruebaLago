const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MOCK = !API_URL;


// Helpers
async function handle<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let msg = "Error en la solicitud";
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

// ---------------- EVENTOS ----------------
export type CreateEventInput = {
    titulo: string;
    fechaISO: string;   // full ISO date-time
    circuito?: string;
    cupo?: number;
    notas?: string;
};

export async function createEventReservation(input: CreateEventInput): Promise<{ id: string }> {
    if (MOCK) {
        await new Promise(r => setTimeout(r, 500));
        return { id: "evt_" + Math.random().toString(36).slice(2, 8) };
    }
    const res = await fetch(`${API_URL}/api/admin/eventos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    return handle(res);
}

// --------------- CALENDARIO ---------------
export async function getCalendarState(year: number, month: number): Promise<import("../types/admin").CalendarMonthState> {
    if (MOCK) {
        await new Promise(r => setTimeout(r, 250));
        return { year, month, disabled: false, disabledDays: [] };
    }
    const mm = String(month).padStart(2, "0");
    const res = await fetch(`${API_URL}/api/availability?month=${year}-${mm}`, { cache: "no-store" });
    if (!res.ok) {
        let msg = "Error en la solicitud";
        try { const j = await res.json(); if (j?.message) msg = j.message; } catch { }
        throw new Error(msg);
    }

    // Lo que devuelve el back
    type AvailabilityDTO = {
        availableDate: string;          // "YYYY-MM-DD"
        totalCapacity: number | null;
        remainingCapacity: number | null;
    };

    const data = (await res.json()) as AvailabilityDTO[];

    // Opción sencilla: día deshabilitado si remainingCapacity <= 0
    const disabledDays = data
        .filter(d => (d.remainingCapacity ?? 0) <= 0)
        .map(d => d.availableDate);

    // Si querés considerar deshabilitado todo día que NO venga en la respuesta,
    // descomentá este bloque y usalo en lugar del de arriba:
    /*
    const daysInMonth = new Date(year, month, 0).getDate();
    const present = new Set(data.map(d => d.availableDate));
    const disabledDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${mm}-${String(d).padStart(2,"0")}`;
      const dto = data.find(x => x.availableDate === iso);
      const remaining = dto?.remainingCapacity ?? 0;
      if (!present.has(iso) || remaining <= 0) disabledDays.push(iso);
    }
    */

    return { year, month, disabled: false, disabledDays };
}

export async function setDayEnabled(dateISO: string, enabled: boolean): Promise<void> {
    // Hoy no hay endpoint admin para esto; dejalo como NOOP para que el UI no rompa.
    //     if (MOCK) { await new Promise(r => setTimeout(r, 250)); }
    //     return;
    // }
    if (MOCK) { await new Promise(r => setTimeout(r, 250)); return; }
    const res = await fetch(`${API_URL}/api/admin/calendario/dia`, {
        method: enabled ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateISO }),
    });
    await handle(res);
}

export async function setMonthEnabled(year: number, month: number, enabled: boolean): Promise<void> {
    if (MOCK) { await new Promise(r => setTimeout(r, 250)); return; }
    const res = await fetch(`${API_URL}/api/admin/calendario/mes`, {
        method: enabled ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, month }),
    });
    await handle(res);
}
// Hoy no hay endpoint admin para esto; dejalo como NOOP para que el UI no rompa.
//     if (MOCK) { await new Promise(r => setTimeout(r, 250)); }
//     return;
// }