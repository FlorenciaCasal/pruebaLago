"use client";
import React from "react";
import { getCalendarState, setDayEnabled, setMonthEnabled } from "@/services/admin";
import type { CalendarMonthState } from "@/types/admin";

function ym(d: Date) {
    return { y: d.getFullYear(), m: (d.getMonth() + 1) as number };
}

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    try {
        // por si vino como Response JSON ya parseado
        const maybe = err as { message?: string };
        if (maybe?.message) return maybe.message;
    } catch { }
    return "Ocurrió un error";
}

export default function CalendarioAdminPage() {
    const today = new Date();
    const [{ y, m }, setYM] = React.useState(ym(today));
    const [state, setState] = React.useState<CalendarMonthState | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [busy, setBusy] = React.useState<boolean>(false);

    const load = React.useCallback(
        async (yy: number = y, mm: number = m): Promise<void> => {
            setLoading(true);
            try {
                const s = await getCalendarState(yy, mm);
                setState(s);
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

    const toggleMonth = async (): Promise<void> => {
        if (!state) return;
        setBusy(true);
        try {
            await setMonthEnabled(state.year, state.month, state.disabled);
            setState(prev => (prev ? { ...prev, disabled: !prev.disabled } : prev));
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Calendario</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const d = new Date(y, m - 2, 1);
                            setYM(ym(d));
                            void load(d.getFullYear(), d.getMonth() + 1);
                        }}
                        className="rounded-lg border border-neutral-700 px-3 py-1.5 hover:bg-neutral-800"
                    >
                        ◀
                    </button>
                    <div className="rounded-lg border border-neutral-700 px-3 py-1.5 bg-neutral-950">
                        {monthLabel}
                    </div>
                    <button
                        onClick={() => {
                            const d = new Date(y, m, 1);
                            setYM(ym(d));
                            void load(d.getFullYear(), d.getMonth() + 1);
                        }}
                        className="rounded-lg border border-neutral-700 px-3 py-1.5 hover:bg-neutral-800"
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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => void toggleMonth()}
                            disabled={busy}
                            className={
                                "rounded-lg px-4 py-2 text-white disabled:opacity-60 " +
                                (state.disabled
                                    ? "bg-green-600/90 hover:bg-green-600"
                                    : "bg-red-600/90 hover:bg-red-600")
                            }
                        >
                            {busy ? "..." : state.disabled ? "Habilitar mes completo" : "Deshabilitar mes completo"}
                        </button>
                        <span className="text-sm text-neutral-400">
                            Hacé clic en un día para alternar su estado.
                        </span>
                    </div>

                    <div className="grid grid-cols-7 gap-2 rounded-2xl border border-neutral-800 p-4 bg-neutral-950">
                        {["Do","Lu","Ma","Mi","Ju","Vi","Sa"].map(h => (
                            <div key={h} className="text-center text-neutral-400 text-xs">
                                {h}
                            </div>
                        ))}
                        {buildDays.map((d, i) => {
                            if (!d) return <div key={i} />;
                            const dateISO = d.toISOString().slice(0, 10);
                            const disabled = state.disabled || state.disabledDays.includes(dateISO);
                            return (
                                <button
                                    key={i}
                                    onClick={() => void toggleDay(dateISO)}
                                    disabled={busy}
                                    className={
                                        "aspect-square w-full rounded-lg border px-1 py-1 text-sm " +
                                        (disabled
                                            ? "border-red-900 bg-red-950/40 text-red-300"
                                            : "border-neutral-800 bg-neutral-900 text-neutral-100")
                                    }
                                    title={dateISO}
                                >
                                    <div className="text-right">{d.getDate()}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

