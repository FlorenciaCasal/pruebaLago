"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RegisterForm from "../../components/RegisterForm"

function FormularioContent() {
  const searchParams = useSearchParams();
  const fechaParam = searchParams.get("fecha");
  const fechaSeleccionada = fechaParam ? new Date(fechaParam) : null;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Reservá tu visita</h1>
      <RegisterForm fechaSeleccionada={fechaSeleccionada} />
    </main>
  );
}

export default function FormularioPage() {
  // const searchParams = useSearchParams();
  // const fechaParam = searchParams.get("fecha");

  // // Convertir a objeto Date si existe fecha
  // const fechaSeleccionada = fechaParam ? new Date(fechaParam) : null;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Reservá tu visita</h1>
      <Suspense fallback={<div>Cargando...</div>}>
        <FormularioContent />
      </Suspense>
    </main>
  );
}
