"use client";
import React, { Suspense, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ReservationWizard from "@/components/reservation/ReservationWizard";
import RegisterForm from "@/components/register/RegisterForm";

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [showForm, setShowForm] = useState(false);
  const [submittedType, setSubmittedType] = useState<"PARTICULAR" | "INSTITUCION_EDUCATIVA" | null>(null);

  return (
    <main className="min-h-screen flex flex-col bg-gray-900 items-center justify-center overflow-x-hidden p-4">
      <Suspense fallback={<div className="text-white">Cargando...</div>}>
        {!showForm ? (
          <ReservationWizard
            // onComplete={({ visitorType, circuitId, dateISO, visitors }) => {
            onComplete={({ visitorType, dateISO, visitors }) => {
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
              setShowForm(true);
            }}
          />
        ) : (
          <RegisterForm
            key={`rf-${submittedType ?? "PARTICULAR"}`}
            initialTipo={submittedType ?? "PARTICULAR"}
            onCancel={() => {
              // Opcional: podés limpiar la URL si querés
              // router.replace(pathname, { scroll: false });
              setShowForm(false);
            }}
          />
        )}
      </Suspense>
    </main>
  );
}



