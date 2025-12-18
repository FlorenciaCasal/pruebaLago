"use client";
import { useEffect, useState } from "react";

type FireRiskLevel = "BAJO" | "MODERADO" | "ALTO";

type HomeStatusResponse =
  | {
    ok: true;
    weather: {
      temperature: number;
    };
    alerts: {
      fireRisk: FireRiskLevel;
    };
  }
  | {
    ok: false;
  };

export default function HomeStatus() {
  const [data, setData] = useState<HomeStatusResponse | null>(null);

  useEffect(() => {
    fetch("/api/home-status")
      .then(r => r.json() as Promise<HomeStatusResponse>)
      .then(setData)
      .catch(() => setData({ ok: false }));
  }, []);

  if (!data) return null;

  return (
    <section className="rounded-xl border border-neutral-800 bg-white p-4">
      <h2 className="font-medium">Clima y alertas · Lago Escondido</h2>

      {!data.ok ? (
        <p className="text-sm text-neutral-400 mt-2">
          Información no disponible en este momento.
        </p>
      ) : (
        <div className="mt-6 space-y-4 text-sm">
          <div>
            🌡️ Temperatura: <strong>{data.weather.temperature}°C</strong>
          </div>

          <div>
            🔥 Riesgo de incendio:{" "}
            <strong
              className={
                data.alerts.fireRisk === "ALTO"
                  ? "text-red-400"
                  : data.alerts.fireRisk === "MODERADO"
                    ? "text-yellow-400"
                    : "text-green-400"
              }
            >
              {data.alerts.fireRisk}
            </strong>
          </div>

          <p className="text-xs text-neutral-500 mt-2">
            Información de referencia. Consultar fuentes oficiales ante alertas.
          </p>
        </div>
      )}
    </section>
  );
}
