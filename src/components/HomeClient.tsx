"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ReservationWizard from "@/components/reservation/ReservationWizard";
import RegisterForm from "@/components/register/RegisterForm";
import { getPublicBookingFlags } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import Image from "next/image";
import { isVisitante } from "@/utils/visitante";



export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  // 👇 Si la URL viene con ?step=..., al refrescar limpiamos y volvemos al wizard
  useEffect(() => {
    if (searchParams.get("step") !== null) {
      router.replace(pathname, { scroll: false });
      setShowForm(false);
      setSubmittedType(null);
      setFormInstanceId((n) => n + 1); // por si quedaba algo montado
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sólo una vez al montar

  // 👉 Si la URL trae step, forzamos el formulario
  const stepQS = searchParams.get("step");
  const forceForm = stepQS !== null;
  const vtQS = searchParams.get("visitorType");
  const tipoFromQS =
    isVisitante(vtQS ?? "") ? (vtQS as "PARTICULAR" | "INSTITUCION_EDUCATIVA") : undefined;

  return (
    // <main className="min-h-screen flex flex-col bg-gray-900 items-center justify-center overflow-x-hidden p-4">
    <main className="bg-rose-50 overflow-x-hidden flex-1 flex flex-col min-h-0 h-full">
      {/* HERO SPLIT */}
      {/* <section className="mx-auto grid grid-cols-1 lg:grid-cols-2"> */}
      <section className="flex-1 flex flex-col h-full lg:flex-row items-stretch min-h-0">
        {/* Izquierda: imagen */}
        {/* <div className="relative h-[40vh] lg:h-[calc(100vh-64px)]"> */}
        <div className="relative flex-1 flex min-h-[40vh] lg:min-h-0 ">
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
        {/* <div className="flex items-center justify-center pt-6 lg:pt-10"> */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-8 min-h-0">
          {/* <div className="w-full max-w-md rounded-2xl bg-white border border-emerald-200/60 shadow-xl p-6 md:p-7"> */}
          {/* <div className=" w-[90vw] max-w-xl lg:max-w-md rounded-2xl md:p-6 "> */}
          <div className="w-[90vw] max-w-xl lg:max-w-md">
            {/* <h2 className="text-2xl text-center font-semibold text-neutral-900 mb-4">
              Reserva tu visita
            </h2> */}

            <Suspense fallback={<div className="text-white">Cargando...</div>}>
              {!(showForm || forceForm) ? (
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
                  // si venimos con ?step en la URL, priorizar tipo de la URL
                  key={`rf-${(forceForm ? (tipoFromQS ?? "PARTICULAR") : (submittedType ?? "PARTICULAR"))}-${formInstanceId}`}
                  initialTipo={(forceForm ? (tipoFromQS ?? "PARTICULAR") : (submittedType ?? "PARTICULAR"))}
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
