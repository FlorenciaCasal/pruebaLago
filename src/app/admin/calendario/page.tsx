"use client";
import React from "react";
import { getCalendarState, setDayEnabled, setMonthEnabled, fetchReservations } from "@/services/admin";
import type { CalendarMonthState, AdminReservation } from "@/types/admin";
import BookingFlagsInline from "@/components/admin/BookingFlagsInline";

// const DEFAULT_CAPACITY =
//   Number(process.env.NEXT_PUBLIC_DEFAULT_CAPACITY ?? 30); // mismo que app.defaultCapacity

function ym(d: Date) {
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
}

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    try { const j = err as { message?: string }; if (j?.message) return j.message; } catch { }
    return "Ocurrió un error";
}


export default function CalendarioAdminPage() {
    const today = new Date();
    const [{ y, m }, setYM] = React.useState(ym(today));
    const [state, setState] = React.useState<CalendarMonthState | null>(null);
    const [reservations, setReservations] = React.useState<AdminReservation[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [busy, setBusy] = React.useState<boolean>(false);
    const [selectedDay, setSelectedDay] = React.useState<string | null>(null);

    const load = React.useCallback(
        async (yy: number = y, mm: number = m): Promise<void> => {
            setLoading(true);
            try {
                const s = await getCalendarState(yy, mm);
                setState(s);
                // Obtener reservas confirmadas
                const allReservations = await fetchReservations("CONFIRMED");
                setReservations(allReservations);
            } catch (e: unknown) {
                alert(getErrorMessage(e));
            } finally {
                setLoading(false);
            }
        },
        [y, m]
    );

    React.useEffect(() => {
        void load();
    }, [load]);

    const toggleDay = async (dateISO: string): Promise<void> => {
        if (!state) return;
        setBusy(true);
        const isDisabled = state.disabledDays.includes(dateISO);
        try {
            await setDayEnabled(dateISO, isDisabled); // si está deshabilitado -> habilitar
            setState(prev =>
                prev
                    ? {
                        ...prev,
                        disabledDays: isDisabled
                            ? prev.disabledDays.filter(d => d !== dateISO)
                            : [...prev.disabledDays, dateISO],
                    }
                    : prev
            );
        } catch (e: unknown) {
            alert(getErrorMessage(e));
        } finally {
            setBusy(false);
        }
    };

    const allDateISOsOfMonth = (yy: number, mm: number) => {
        const last = new Date(yy, mm, 0).getDate(); // mm 1..12
        const pad = (n: number) => String(n).padStart(2, "0");
        const arr: string[] = [];
        for (let d = 1; d <= last; d++) arr.push(`${yy}-${pad(mm)}-${pad(d)}`);
        return arr;
    };

    const toggleMonth = async (): Promise<void> => {
        if (!state) return;
        setBusy(true);
        try {
            await setMonthEnabled(state.year, state.month, state.disabled);
            const allDays = allDateISOsOfMonth(state.year, state.month);

            setState(prev =>
                prev
                    ? {
                        ...prev,
                        // si antes estaba habilitado -> ahora deshabilitado (llenamos todos)
                        // si antes estaba deshabilitado -> ahora habilitado (vaciamos todos)
                        disabled: !prev.disabled,
                        disabledDays: prev.disabled ? [] : allDays,
                    }
                    : prev
            );
        } catch (e: unknown) {
            alert(getErrorMessage(e));
        } finally {
            setBusy(false);
        }
    };

    // Build month grid
    const buildDays: Array<Date | null> = React.useMemo(() => {
        const first = new Date(y, m - 1, 1);
        const startDay = first.getDay(); // 0 = Domingo
        const daysInMonth = new Date(y, m, 0).getDate();
        const cells: Array<Date | null> = [];
        for (let i = 0; i < startDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m - 1, d));
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    }, [y, m]);

    const monthLabel = new Date(y, m - 1, 1).toLocaleString(undefined, {
        month: "long",
        year: "numeric",
    });

    // Contar reservas por día
    const getReservationsForDay = (dateISO: string): number => {
        return reservations.filter(r => r.reservationDate === dateISO).length;
    };

    return (
        // <div className="space-y-4">
        <div className="space-y-3 md:space-y-4">
            {/* <div className="flex items-center justify-between"> */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl sm:text-2xl font-semibold">Calendario</h2>
                {/* <div className="flex gap-2"> */}
                <div className="flex gap-2 items-center sm:ml-auto justify-between sm:justify-normal">
                    <button
                        onClick={() => {
                            const d = new Date(y, m - 2, 1);
                            setYM(ym(d));
                            void load(d.getFullYear(), d.getMonth() + 1);
                        }}
                        // className="rounded-lg border border-neutral-700 px-3 py-1.5 hover:bg-neutral-800"
                        className="size-9 rounded-full border border-neutral-700 hover:bg-neutral-800 grid place-items-center"
                    >
                        ◀
                    </button>
                    {/* <div className="rounded-lg border border-neutral-700 px-1.5 md:px-3 py-1.5 bg-neutral-950">
                        {monthLabel}
                    </div> */}
                    <div className="max-w-[12rem] sm:max-w-none rounded-lg border border-neutral-700 px-2 md:px-3 py-1.5 bg-neutral-950 text-center capitalize truncate mx-auto sm:mx-0 text-sm md:text-base">
                        {monthLabel}
                    </div>
                    <button
                        onClick={() => {
                            const d = new Date(y, m, 1);
                            setYM(ym(d));
                            void load(d.getFullYear(), d.getMonth() + 1);
                        }}
                        // className="rounded-lg border border-neutral-700 px-3 py-1.5 hover:bg-neutral-800"
                        className="size-9 rounded-full border border-neutral-700 hover:bg-neutral-800 grid place-items-center"
                    >
                        ▶
                    </button>
                </div>
            </div>

            {loading || !state ? (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
                    Cargando...
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-3">
                        {/* <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"> */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* Izquierda: botón rojo + texto */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => void toggleMonth()}
                                    disabled={busy}
                                    // className={
                                    //     "rounded-lg px-2 md:px-4 py-2 text-white disabled:opacity-60 " +
                                    //     (state.disabled ? "bg-green-600/90 hover:bg-green-600" : "bg-red-600/90 hover:bg-red-600")
                                    // }
                                    className={"w-full rounded-lg px-3 md:px-4 py-2 text-white disabled:opacity-60 " + (state.disabled ? "bg-green-600/90 hover:bg-green-600" : "bg-red-600/90 hover:bg-red-600")}
                                >
                                    {busy ? "..." : state.disabled ? "Habilitar mes completo" : "Deshabilitar mes completo"}
                                </button>
                                {/* <span className="text-sm text-neutral-400">
                                    Hacé clic en un día para alternar su estado.
                                </span> */}
                                <span className="text-xs sm:text-sm text-neutral-400 sm:ml-1">
                                    Tocá un día para alternar su estado.
                                </span>
                            </div>

                            {/* Derecha: NUEVO toggle de instituciones */}
                            <BookingFlagsInline />
                        </div>

                        {/* Leyenda */}
                        {/* <div className="flex items-center gap-4 text-sm"> */}
                        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-blue-600" />
                                <span className="text-neutral-300">Número de reservas confirmadas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border border-red-900 bg-red-950/40" />
                                <span className="text-neutral-300">Día deshabilitado</span>
                            </div>
                        </div>
                    </div>
                    {/* <div className="grid grid-cols-7 gap-2 rounded-2xl border border-neutral-800 p-4 bg-neutral-950"> */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 rounded-2xl border border-neutral-800 p-2 sm:p-4 bg-neutral-950">
                        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map(h => (
                            // <div key={h} className="text-center text-neutral-400 text-xs">
                            <div key={h} className="text-center text-neutral-400 text-[11px] sm:text-xs">
                                {h}
                            </div>
                        ))}
                        {buildDays.map((d, i) => {
                            if (!d) return <div key={i} />;
                            const dateISO = d.toISOString().slice(0, 10);
                            const disabled = state.disabledDays.includes(dateISO);
                            const reservationCount = getReservationsForDay(dateISO);
                            const isSelected = selectedDay === dateISO;
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (reservationCount > 0) {
                                            setSelectedDay(isSelected ? null : dateISO);
                                        } else {
                                            void toggleDay(dateISO);
                                        }
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        void toggleDay(dateISO);
                                    }}
                                    disabled={busy}
                                    // className={
                                    //     "aspect-square w-full rounded-lg border px-2 py-2 text-sm relative " +
                                    className={
                                        // en xs: más padding a la derecha para que no tape el número
                                        "w-full rounded-lg border px-1.5 pr-6 py-1.5 text-xs sm:text-sm relative min-h-10 sm:min-h-0 aspect-square " +
                                        (isSelected
                                            ? "border-blue-500 bg-blue-900/40 text-blue-100 ring-2 ring-blue-500"
                                            : disabled
                                                ? "border-red-900 bg-red-950/40 text-red-300"
                                                : "border-neutral-800 bg-neutral-900 text-neutral-100")
                                    }
                                    title={`${dateISO} - ${reservationCount} reserva${reservationCount !== 1 ? 's' : ''} confirmada${reservationCount !== 1 ? 's' : ''}\nClick izquierdo: ${reservationCount > 0 ? 'Ver reservas' : 'Habilitar/Deshabilitar'}\nClick derecho: Habilitar/Deshabilitar`}
                                >
                                    {/* <div className="text-right font-medium">{d.getDate()}</div> */}
                                    {/* número del día en la esquina superior izquierda para alejarlo del badge */}
                                    <div className="absolute left-1 top-1 font-medium leading-none">{d.getDate()}</div>
                                    {reservationCount > 0 && (
                                        // <div className="mt-1 text-xs text-center">
                                        //     <span className="inline-block px-1.5 py-0.5 rounded bg-blue-600 text-white font-semibold">
                                        //         {reservationCount}
                                        //     </span>
                                        // </div>
                                        <span
                                            className="absolute bottom-1 right-1 inline-flex items-center justify-center min-w-[14px] h-[14px] text-[9px] px-[2px] sm:min-w-5 sm:h-5 sm:text-xs sm:px-1 rounded bg-blue-600 text-white font-semibold"
                                        >
                                            {reservationCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Lista de reservas del día seleccionado */}
                    {selectedDay && (
                        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">
                                    Reservas del {new Date(selectedDay + 'T00:00:00').toLocaleDateString('es-AR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </h3>
                                <button
                                    onClick={() => setSelectedDay(null)}
                                    className="text-neutral-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                {/* <table className="min-w-full text-sm"> */}
                                <table className="min-w-full text-xs sm:text-sm">
                                    <thead className="bg-white/5">
                                        <tr className="[&>th]:px-4 [&>th]:py-2 [&>th]:text-left text-neutral-400">
                                            <th>Nombre y apellido</th>
                                            <th>Pax</th>
                                            <th>Tipo</th>
                                            <th>Circuito</th>
                                            {/* <th className="hidden md:table-cell">Email</th>
                                            <th className="hidden md:table-cell">Teléfono</th> */}
                                            <th>Email</th>
                                            <th>Teléfono</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800">
                                        {reservations
                                            .filter(r => r.reservationDate === selectedDay)
                                            .map(r => (
                                                <tr key={r.id} className="[&>td]:px-4 [&>td]:py-3">
                                                    <td>{[r.nombre, r.apellido].filter(Boolean).join(" ") || "-"}</td>
                                                    <td>{r.personas ?? "-"}</td>
                                                    <td>{r.tipoVisitante ?? "-"}</td>
                                                    <td>{r.circuito ?? "-"}</td>
                                                    {/* <td className="text-neutral-400">{r.correo ?? "-"}</td>
                                                    <td className="text-neutral-400">{r.telefono ?? "-"}</td> */}
                                                    <td>{r.correo ?? "-"}</td>
                                                    <td>{r.telefono ?? "-"}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}


