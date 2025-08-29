"use client";
import React, { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-900 items-center justify-center overflow-x-hidden">
      <Suspense fallback={<div>Cargando...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}


