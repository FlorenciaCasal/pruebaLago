"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ReservationWizard from "@/components/reservation/ReservationWizard";
import RegisterForm from "@/components/register/RegisterForm";
import { getPublicBookingFlags } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";
import Image from "next/image";
import { isVisitante } from "@/utils/visitante";

export default function VisitaPage() {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (searchParams.get("step") !== null) {
      router.replace(pathname, { scroll: false });
      setShowForm(false);
      setSubmittedType(null);
      setFormInstanceId((n) => n + 1); // por si quedaba algo montado
    }
  }, []); // sólo una vez al montar

  // 👉 Si la URL trae step, forzamos el formulario
  const stepQS = searchParams.get("step");
  const forceForm = stepQS !== null;
  const vtQS = searchParams.get("visitorType");
  const tipoFromQS =
    isVisitante(vtQS ?? "") ? (vtQS as "PARTICULAR" | "INSTITUCION_EDUCATIVA") : undefined;

  return (
    <main className="bg-[#f5f5f5] overflow-x-hidden flex-1 flex flex-col min-h-0 h-full">
      <section className="flex-1 flex flex-col h-full lg:flex-row items-stretch min-h-0">
        <div className="relative flex-1 flex min-h-[40vh] lg:min-h-0 ">
          <Image
            src="/img/form.jpeg"
            alt="Lago Escondido"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>

        {/* Derecha: tarjeta clara */}
        {/* <div className="flex-1 flex items-center justify-center p-6 lg:p-8 min-h-0"> */}
         <div className="flex-1 flex items-center justify-center px-2 py-6 lg:p-8 min-h-0">
          <div className="w-[90vw] max-w-xl lg:max-w-md">
            <Suspense fallback={<div className="text-white">Cargando...</div>}>
              {!(showForm || forceForm) ? (
                <ReservationWizard
                  onComplete={({ visitorType, dateISO, visitors }) => {
                    // 🚧 Guardia extra: si escuela está deshabilitada, no avancemos
                    if (
                      visitorType === "INSTITUCION_EDUCATIVA" &&
                      flags && !flags.schoolEnabled
                    ) {
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
                  key={`rf-${(forceForm ? (tipoFromQS ?? "PARTICULAR") : (submittedType ?? "PARTICULAR"))}-${formInstanceId}`}
                  initialTipo={(forceForm ? (tipoFromQS ?? "PARTICULAR") : (submittedType ?? "PARTICULAR"))}
                  onCancel={() => {
                    setShowForm(false);
                    router.replace("/", { scroll: true });
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
