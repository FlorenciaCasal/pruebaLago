'use client';
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, isBefore, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

type Props = {
    selectedISO?: string;                         // "YYYY-MM-DD"
    onSelectISO: (iso: string) => void;           // callback al seleccionar
};

function toISO(d: Date) {
    // YYYY-MM-DD (sin hora)
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// --- fetch disponibilidad de un mes ---
type DayDTO = {
    availableDate: string;              // "YYYY-MM-DD"
    totalCapacity: number | null;
    remainingCapacity: number | null;
};

async function fetchDisabledForMonth(year: number, month: number): Promise<Set<string>> {
    const mm = String(month).padStart(2, '0');
    const res = await fetch(`/api/admin/availability-proxy?month=${year}-${mm}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo cargar disponibilidad');

    const data: DayDTO[] = await res.json();
    // Deshabilitamos si no hay cupo total o no queda cupo
    const disabled = data
        .filter(d => (d.totalCapacity ?? 0) <= 0 || (d.remainingCapacity ?? 0) <= 0)
        .map(d => d.availableDate);

    return new Set(disabled);
}

export default function CalendarPicker({ selectedISO, onSelectISO }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const [month, setMonth] = useState(new Date());
    const [monthsToShow, setMonthsToShow] = useState(6);

    // // selected Date derivado de selectedISO
    // const selectedDate = selectedISO ? new Date(selectedISO) : undefined;

    // selected Date derivado de selectedISO (LOCAL, no UTC)
    function fromISODateLocal(iso: string) {
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(y, m - 1, d);
    }
    // días deshabilitados combinados (de todos los meses visibles)
    const [disabledSet, setDisabledSet] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(false);

    const selectedDate = selectedISO ? fromISODateLocal(selectedISO) : undefined;

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Cargar disponibilidad para los meses visibles
    useEffect(() => {
        const months: Date[] = isMobile
            ? Array.from({ length: monthsToShow }, (_, i) => addMonths(new Date(), i))
            : [month, addMonths(month, 1)]; // desktop: mes actual y siguiente

        setLoading(true);
        Promise.all(
            months.map(d => fetchDisabledForMonth(d.getFullYear(), d.getMonth() + 1))
        )
            .then(list => {
                const merged = new Set<string>();
                for (const s of list) for (const iso of s) merged.add(iso);
                setDisabledSet(merged);
            })
            .finally(() => setLoading(false));
    }, [isMobile, monthsToShow, month]);

    const handleSelect = (date: Date | undefined) => {
        if (!date) return;
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        const iso = toISO(normalized);
        // si el día está deshabilitado, no dejamos seleccionar
        if (disabledSet.has(iso)) return;
        onSelectISO(iso);
    };

    const goPrevious = () => {
        const prev = subMonths(month, 1);
        if (!isBefore(prev, startOfMonth(new Date()))) setMonth(prev);
    };

    const goNext = () => setMonth(addMonths(month, 1));

    const isPrevDisabled = isBefore(subMonths(month, 1), startOfMonth(new Date()));

    // matcher función para react-day-picker
    const isDisabledMatcher = (d: Date) => disabledSet.has(toISO(d));

    return (
        <div className="flex justify-center">
            <div
                className={`
          bg-black rounded-xl w-full 
          ${isMobile ? 'px-4 overflow-y-scroll h-[80vh] [&_.rdp-weekday]:hidden' : 'p-4 flex items-center justify-center gap-1 overflow-x-hidden'}
        `}
            >
                {isMobile ? (
                    <>
                        {Array.from({ length: monthsToShow }, (_, i) => {
                            const thisMonth = addMonths(new Date(), i);
                            return (
                                <div key={i} className="flex bg-black justify-center relative max-w-full sm:max-w-md">
                                    <DayPicker
                                        className="custom-daypicker"
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleSelect}
                                        month={thisMonth}
                                        showOutsideDays
                                        components={{ Nav: () => <></> }}
                                        locale={es}
                                        disabled={[
                                            { before: new Date() },
                                            { dayOfWeek: [0, 6] }, // fds
                                            isDisabledMatcher,      // 👈 cupo 0 desde backend
                                        ]}
                                    />
                                </div>
                            );
                        })}
                        <div className="flex justify-center w-full mt-4">
                            <button
                                onClick={() => setMonthsToShow(prev => prev + 3)}
                                className="px-4 pt-2 pb-4 w-full max-w-xs rounded-lg cursor-pointer bg-white text-gray-900 hover:opacity-90 transition"
                                disabled={loading}
                            >
                                {loading ? 'Cargando…' : 'Cargar más fechas'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <button
                            onClick={goPrevious}
                            aria-label="Mes anterior"
                            className={`p-2 ${isPrevDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            disabled={isPrevDisabled}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleSelect}
                            numberOfMonths={2}
                            month={month}
                            onMonthChange={setMonth}
                            showOutsideDays
                            pagedNavigation
                            components={{ Nav: () => <></> }}
                            className="custom-daypicker"
                            locale={es}
                            disabled={[
                                { before: new Date() },
                                { dayOfWeek: [0, 6] },
                                isDisabledMatcher,        // 👈 cupo 0 desde backend
                            ]}
                        />

                        <button
                            onClick={goNext}
                            aria-label="Mes siguiente"
                            className="p-2 hover:bg-gray-200"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
