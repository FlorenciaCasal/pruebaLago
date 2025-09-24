"use client";
import React, { Suspense, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ReservationWizard from "@/components/reservation/ReservationWizard";
import RegisterForm from "@/components/register/RegisterForm";

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [showForm, setShowForm] = useState(false);
  const search = useSearchParams();                         // 👈 nuevo
  const visitorType = (search.get("visitorType") as "PARTICULAR" | "INSTITUCION_EDUCATIVA") ?? "PARTICULAR";

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

              router.replace(url, { scroll: false });
              setShowForm(true);
            }}
          />
        ) : (
          // 👇 clave para forzar remount + pasamos visitorType como prop
          <RegisterForm key={`rf-${visitorType}`} />
        )}
      </Suspense>
    </main>
  );
}



