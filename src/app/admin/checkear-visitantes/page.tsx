"use client";
import React, { useState } from "react";
import Scanner from "../../../components/Scanner"
import ControlAcceso from "@/components/ControlAcceso";


export default function ScannerPage() {
  const [dniEscaneado, setDniEscaneado] = useState("");

  const handleScan = (dni: string) => {
    setDniEscaneado(dni);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Checkear usuario</h1>

      <Scanner onScan={handleScan} />

      {dniEscaneado && <ControlAcceso dniInicial={dniEscaneado} />}
    </main>
  );
}