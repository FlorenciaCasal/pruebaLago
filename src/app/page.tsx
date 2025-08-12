'use client';
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths, isBefore, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';


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
    <main className="flex-columns px-4 py-6 bg-gray-100 min-h-screen overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-4 text-center">Seleccioná tu fecha</h1>

      <div className="flex justify-center">
        <div
          className={`
            bg-white rounded-xl pt-4 max-w-full overflow-x-hidden
            ${isMobile ? 'overflow-y-scroll h-[80vh] [&_.rdp-weekday]:hidden' : 'flex items-start md:[&_.rdp-head]:table-header-group'} 
          `}
        >
          {/* Encabezado fijo de días (solo en mobile) */}
          {isMobile && (
            <div className="sticky top-0 z-10 bg-white">
              <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Flecha izquierda a la izquierda del primer mes */}
          {!isMobile && (
            <button
              onClick={goPrevious}
              aria-label="Mes anterior"
              className={`p-2 ${isPrevDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'
                }`}
              disabled={isPrevDisabled}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Calendario */}
          {isMobile ? (
            // MOBILE: varios meses con scroll
            <>
              {Array.from({ length: monthsToShow }, (_, i) => {
                const thisMonth = addMonths(new Date(), i);
                return (
                  <div key={i} className="flex bg-white relative max-w-full overflow-x-hidden sm:max-w-md">
                    <DayPicker
                      key={i}
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
              < div className="flex justify-center">
                <button
                  onClick={() => setMonthsToShow(prev => prev + 3)} // agrega 3 meses más
                  className="text-sm text-gray-700 border-gray-700 w-full border-2 border-solid p-4 mt-4 mb-4 rounded-lg cursor-pointer "
                >
                  Cargar más fechas
                </button>
              </div>
            </>
          ) : (
            // DESKTOP: 2 meses con flechas
            <>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                numberOfMonths={2}
                month={month}              // mes inicial controlado
                onMonthChange={setMonth}
                // fixedWeeks
                showOutsideDays
                pagedNavigation
                components={{ Nav: () => <></> }}
                className="custom-daypicker"
                locale={es}
                disabled={[
                  { before: new Date() },
                  { dayOfWeek: [0, 6] }
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
      </div >
    </main >
  );
}

