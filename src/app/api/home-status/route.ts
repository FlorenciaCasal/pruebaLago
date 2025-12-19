// app/api/home-status/route.ts
import { NextResponse } from "next/server";

export type FireRiskLevel = "BAJO" | "MODERADO" | "ALTO";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-41.87&longitude=-71.50&current_weather=true&timezone=America/Argentina/Buenos_Aires",
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("weather fetch failed");

    const data = await res.json();
    const current = data.current_weather;

    if (!current) throw new Error("no current_weather");

    const temperature: number = current.temperature;
    const windSpeed: number = current.windspeed;

    // Indicador heurístico simple (NO alerta oficial)
    let fireRisk: FireRiskLevel = "BAJO";

    if (temperature >= 30 && windSpeed >= 30) {
      fireRisk = "ALTO";
    } else if (temperature >= 25 && windSpeed >= 20) {
      fireRisk = "MODERADO";
    }

    return NextResponse.json({
      ok: true,
      weather: {
        temperature,
        windSpeed,
      },
      indicator: {
        fireRisk,
        methodology: "heuristic-temp-wind-v1",
      },
      meta: {
        source: "open-meteo.com",
        updatedAt: current.time,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false },
      { status: 200 } // intencional: UI simple
    );
  }
}

