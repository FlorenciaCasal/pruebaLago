// app/api/home-status/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-41.87&longitude=-71.50&current_weather=true&timezone=America/Argentina/Buenos_Aires",
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("weather error");

    const data = await res.json();

    const temp = data.current_weather.temperature;
    const code = data.current_weather.weathercode;
    const wind = data.current_weather.windspeed;

    // Heurística simple de riesgo
    const fireRisk =
      temp >= 30 && wind >= 30 ? "ALTO" :
      temp >= 25 ? "MODERADO" :
      "BAJO";

    return NextResponse.json({
      ok: true,
      weather: {
        temperature: temp,
        code,
      },
      alerts: {
        fireRisk,
      },
    });
  } catch {
    return NextResponse.json({
      ok: false,
    });
  }
}
