// "use client";
// import React, { Suspense } from "react";
// import RegisterForm from "@/components/RegisterForm";
// import ReservationWizard from "@/components/ReservationWizard";

// export default function HomePage() {
//   return (
//     <main className="min-h-screen flex flex-col bg-gray-900 items-center justify-center overflow-x-hidden">
//       <Suspense fallback={<div>Cargando...</div>}>
//         {/* <RegisterForm /> */}
//         <ReservationWizard />
//       </Suspense>
//     </main>
//   );
// }

"use client";
import React, { Suspense, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ReservationWizard from "@/components/ReservationWizard";
import RegisterForm from "@/components/RegisterForm";

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-gray-900 items-center justify-center overflow-x-hidden p-4">
      <Suspense fallback={<div className="text-white">Cargando...</div>}>
        {!showForm ? (
          <ReservationWizard
            onComplete={({ visitorType, circuitId, dateISO, visitors }) => {
              const url = `${pathname}?step=0` +
                `&visitorType=${visitorType}` +
                `&circuito=${circuitId}` +
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
          <RegisterForm />
        )}
      </Suspense>
    </main>
  );
}



