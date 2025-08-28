"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RegisterForm from "../../components/RegisterForm"

function FormularioContent() {
  const searchParams = useSearchParams();
  const fechaParam = searchParams.get("fecha");
  const fechaSeleccionada = fechaParam ? new Date(fechaParam) : null;

  return (
      <RegisterForm fechaSeleccionada={fechaSeleccionada} />   
  );
}

export default function FormularioPage() {

  return (
       <main className="min-h-screen flex flex-col items-center justify-center overflow-x-hidden">
      <Suspense fallback={<div>Cargando...</div>}>
        <FormularioContent />
      </Suspense>
   </main>
  );
}
