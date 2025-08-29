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

export default function CalendarPicker({ selectedISO, onSelectISO }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const [month, setMonth] = useState(new Date());
    const [monthsToShow, setMonthsToShow] = useState(6);

    // selected Date derivado de selectedISO
    const selectedDate = selectedISO ? new Date(selectedISO) : undefined;

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const handleSelect = (date: Date | undefined) => {
        if (date) onSelectISO(toISO(date));
    };

    const goPrevious = () => {
        const prev = subMonths(month, 1);
        if (!isBefore(prev, startOfMonth(new Date()))) setMonth(prev);
    };
    const goNext = () => setMonth(addMonths(month, 1));
    const isPrevDisabled = isBefore(subMonths(month, 1), startOfMonth(new Date()));

    return (
        <div className="flex justify-center w-full">
            <div
                className={`
        bg-black rounded-xl p-4 max-w-full
        ${isMobile ? 'overflow-y-scroll h-[80vh] [&_.rdp-weekday]:hidden' : 'flex items-center justify-center gap-3'} 
      `}
            >
                {isMobile ? (
                    <>
                        {Array.from({ length: monthsToShow }, (_, i) => {
                            const thisMonth = addMonths(new Date(), i);
                            return (
                                <div key={i} className="flex bg-black relative max-w-full sm:max-w-md">
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
                                            { dayOfWeek: [0, 6] }, // deshabilitar fines de semana
                                        ]}
                                    />
                                </div>
                            );
                        })}
                        <div className="flex justify-center w-full mt-4">
                            <button
                                onClick={() => setMonthsToShow((prev) => prev + 3)}
                                className="px-4 pt-2 pb-4 w-full max-w-xs rounded-lg bg-white text-gray-900 hover:opacity-90 transition"
                            >
                                Cargar más fechas
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
