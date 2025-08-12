"use client";

import { useState } from "react";

export default function ControlAcceso() {
  const [dni, setDni] = useState("");
  const [resultado, setResultado] = useState<null | string>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dni.trim()) return;

    try {
      const res = await fetch(`/api/visitas-confirmadas?dni=${dni}`);
      if (!res.ok) throw new Error("Error de conexión");

      const data = await res.json();

      if (data?.permitido) {
        setResultado(`✅ Acceso permitido a ${data.nombre}`);
      } else {
        setResultado(`❌ Acceso denegado`);
      }
    } catch (err) {
      setResultado("⚠️ Error validando DNI");
    }

    // Limpia el campo para el próximo escaneo
    setDni("");
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






