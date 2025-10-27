"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import ReservationWizard from "@/components/reservation/ReservationWizard";
import RegisterForm from "@/components/register/RegisterForm";
import { getPublicBookingFlags } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import Image from "next/image";



export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  const [flags, setFlags] = useState<{ individualEnabled: boolean; schoolEnabled: boolean } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submittedType, setSubmittedType] = useState<"PARTICULAR" | "INSTITUCION_EDUCATIVA" | null>(null);
  //  id de instancia para forzar remount del RegisterForm
  const [formInstanceId, setFormInstanceId] = useState(0);

  // Cargar flags una vez
  useEffect(() => {
    getPublicBookingFlags()
      .then(setFlags)
      .catch(() => setFlags({ individualEnabled: true, schoolEnabled: true })); // fallback permisivo
  }, []);

  return (
    // <main className="min-h-screen flex flex-col bg-gray-900 items-center justify-center overflow-x-hidden p-4">
    <main className="min-h-screen bg-rose-50 overflow-x-hidden">
      {/* HERO SPLIT */}
      <section className="mx-auto grid grid-cols-1 lg:grid-cols-2">
        {/* Izquierda: imagen */}
        <div className="relative h-[40vh] lg:h-[calc(100vh-64px)]">
          <Image
            src="/img/form.png"            // ⚠️ poné tu imagen real
            alt="Lago Escondido"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>

        {/* Derecha: tarjeta clara */}
        <div className="flex items-center justify-center py-6 lg:p-10">
          {/* <div className="w-full max-w-md rounded-2xl bg-white border border-emerald-200/60 shadow-xl p-6 md:p-7"> */}
            <div className=" w-[90vw] max-w-xl lg:max-w-md rounded-2xl md:p-6 ">
            <h2 className="text-2xl text-center font-semibold text-neutral-900 mb-4">
              Reserva tu visita
            </h2>

            <Suspense fallback={<div className="text-white">Cargando...</div>}>
              {!showForm ? (
                <ReservationWizard
                  // onComplete={({ visitorType, circuitId, dateISO, visitors }) => {
                  onComplete={({ visitorType, dateISO, visitors }) => {

                    // 🚧 Guardia extra: si escuela está deshabilitada, no avancemos
                    if (
                      visitorType === "INSTITUCION_EDUCATIVA" &&
                      flags && !flags.schoolEnabled
                    ) {
                      // toast("Por ahora no se aceptan reservas para instituciones educativas.");
                      toast("En este momento no tenemos disponibilidad para instituciones educativas.");
                      return; // no abrir el form ni tocar la URL
                    }

                    const url = `${pathname}?step=0` +
                      `&visitorType=${visitorType}` +
                      // `&circuito=${circuitId}` +
                      `&fecha=${dateISO}` +
                      `&adults=${visitors.adults}` +
                      `&kids=${visitors.kids}` +
                      `&babies=${visitors.babies}`;
                    console.log("visitorType enviado:", visitorType);

                    setSubmittedType(visitorType);
                    router.replace(url, { scroll: false });
                    // 👇 forzá remount aun cuando el tipo sea el mismo
                    setFormInstanceId((n) => n + 1);
                    setShowForm(true);
                  }}

                />
              ) : (
                <RegisterForm
                  key={`rf-${submittedType ?? "PARTICULAR"}-${formInstanceId}`} //  cambia siempre
                  initialTipo={submittedType ?? "PARTICULAR"}
                  onCancel={() => {
                    // Opcional: podés limpiar la URL si querés
                    // router.replace(pathname, { scroll: false });
                    setShowForm(false);
                  }}
                />
              )}
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}



