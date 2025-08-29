"use client";

import { useEffect, useState } from "react";

interface ControlAccesoProps {
  dniInicial?: string;
}

export default function ControlAcceso({ dniInicial = "" }: ControlAccesoProps) {
  const [dni, setDni] = useState(dniInicial);
  const [resultado, setResultado] = useState<null | string>(null);

  // Cada vez que cambia dniInicial, actualizamos el dni y validamos
  useEffect(() => {
    if (dniInicial.trim()) {
      setDni(dniInicial);
      validarDni(dniInicial);
    }
  }, [dniInicial]);

  const validarDni = async (dniVal: string) => {
    try {
      const res = await fetch(`/api/visitas-confirmadas?dni=${dniVal}`);
      if (!res.ok) throw new Error("Error de conexión");

      const data = await res.json();

      if (data?.permitido) {
        setResultado(`✅ Acceso permitido a ${data.nombre}`);
      } else {
        setResultado(`❌ Acceso denegado`);
      }
    } catch {
      setResultado("⚠️ Error validando DNI");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dni.trim()) return;

    validarDni(dni);

    setDni(""); // limpia input para próximo escaneo o ingreso manual
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto", textAlign: "center" }}>
      <h1>Control de Acceso</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          autoFocus
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Escanear DNI..."
          style={{
            padding: 10,
            width: "100%",
            fontSize: 18,
            marginBottom: 10,
            textAlign: "center",
          }}
        />
      </form>

      {resultado && (
        <div
          style={{
            marginTop: 20,
            fontSize: 20,
            fontWeight: "bold",
            color: resultado.startsWith("✅") ? "green" : "red",
          }}
        >
          {resultado}
        </div>
      )}
    </div>
  );
}
