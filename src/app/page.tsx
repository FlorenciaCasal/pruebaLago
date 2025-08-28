'use client';
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, isBefore, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight } from "lucide-react";


export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isMobile, setIsMobile] = useState(false);
  // Estado que controla el mes inicial visible
  const [month, setMonth] = useState(new Date());
  const [monthsToShow, setMonthsToShow] = useState(6); // Mostrar 6 meses al inicio


  // Detectar si es mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      window.location.href = `/formulario?fecha=${date.toISOString()}`;
    }
  };

  // Funciones para navegar
  const goPrevious = () => {
    const prevMonth = subMonths(month, 1);
    // Solo cambiamos si el mes anterior no es menor al mes actual
    if (!isBefore(prevMonth, startOfMonth(new Date()))) {
      setMonth(prevMonth);
    }
  };

  const goNext = () => setMonth(addMonths(month, 1));

  const isPrevDisabled = isBefore(subMonths(month, 1), startOfMonth(new Date()));


  return (
    <main className="flex flex-col items-center justify-center bg-gray-800 min-h-screen">
  <div className="flex flex-col items-center justify-center w-full max-w-4xl px-4">
    {/* Título con número y flecha */}
    <div className="flex items-center gap-2 mb-6 text-white">
      <span className="text-2xl font-semibold">{1}</span>
      <ArrowRight className="w-5 h-5" />
      <h1 className="text-2xl font-semibold text-center">Seleccioná la fecha de tu visita</h1>
    </div>

    {/* Calendario */}
    <div className="flex justify-center w-full">
      <div
        className={`
          bg-white rounded-xl p-4 max-w-full
          ${isMobile ? 'overflow-y-scroll h-[80vh] [&_.rdp-weekday]:hidden' : 'flex items-start'}
        `}
      >
        {/* Calendario para mobile */}
        {isMobile ? (
          <>
            {Array.from({ length: monthsToShow }, (_, i) => {
              const thisMonth = addMonths(new Date(), i);
              return (
                <div key={i} className="flex bg-white relative max-w-full sm:max-w-md">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    month={thisMonth}
                    showOutsideDays
                    components={{ Nav: () => <></> }}
                    disabled={[
                      { before: new Date() },
                      { dayOfWeek: [0, 6] },
                    ]}
                  />
                </div>
              );
            })}
            <div className="flex justify-center w-full mt-4">
              <button
                onClick={() => setMonthsToShow(prev => prev + 3)}
                className="text-sm text-gray-700 border-2 border-gray-700 w-full max-w-xs p-4 rounded-lg"
              >
                Cargar más fechas
              </button>
            </div>
          </>
        ) : (
          // Calendario desktop
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
  </div>
</main>

  );
}

