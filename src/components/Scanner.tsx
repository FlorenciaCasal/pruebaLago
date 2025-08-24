"use client";

import React, { useEffect } from "react";

interface ScannerProps {
  onScan: (dni: string) => void;
}

export default function Scanner({ onScan }: ScannerProps) {
  // Esto es un simulador de escaneo
  useEffect(() => {
    // Simulamos que después de 5 segundos escaneamos un DNI
    const timer = setTimeout(() => {
      const scannedDni = "12345678"; // DNI simulado
      onScan(scannedDni);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onScan]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <p>Escaneando... (simulado)</p>
      {/* Aquí iría la lógica real del lector DS8178 */}
    </div>
  );
}






