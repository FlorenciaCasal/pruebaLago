"use client";

import { useEffect, useMemo, useState } from "react";

type Acompaniante = {
  dni: string;
  nacimiento: string;
};

type Reserva = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  nacimiento: string;
  reservationDate: string;
  tipoVisitante: string;
  cantidadAcompaniantes?: number;
  acompaniantes?: Acompaniante[];
  cantidadEstudiantes?: number;
  comentario?: string;
  status: "pendiente" | "confirmada" | "rechazada";
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const fmtDate = (iso: string) => {
  // Ajustá el locale si preferís otro formato
  try {
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export default function AdministrarVisitas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/reservations`, { cache: "no-store" });
      if (!res.ok) throw new Error("Error al cargar las reservas");

      const data: unknown = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Respuesta inesperada del servidor");
      }

      // Si querés ser extra estricto, podrías validar cada item acá.
      setReservas(data as Reserva[]);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchReservas();
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: "confirmada" | "rechazada") => {
    try {
      const res = await fetch(`${API_URL}/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nuevoEstado }),
      });
      if (!res.ok) throw new Error("Error actualizando el estado");

      // Opción A: refrescar todo desde el server
      // await fetchReservas();

      // Opción B (más rápido): actualizar localmente
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: nuevoEstado } as Reserva : r))
      );
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error al actualizar el estado");
    }
  };

  const pendientes = useMemo(() => reservas.filter((r) => r.status === "pendiente"), [reservas]);
  const confirmadas = useMemo(() => reservas.filter((r) => r.status === "confirmada"), [reservas]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Administrar Visitas</h1>

      {loading && <p>Cargando reservas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* PENDIENTES */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Reservas Pendientes</h2>
        {pendientes.length === 0 ? (
          <p className="text-gray-600">No hay reservas pendientes.</p>
        ) : (
          <ul className="space-y-4">
            {pendientes.map((reserva) => (
              <li
                key={reserva.id}
                className="border rounded p-4 bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div className="space-y-1">
                  <p>
                    <strong>
                      {reserva.nombre} {reserva.apellido}
                    </strong>{" "}
                    — DNI: {reserva.dni}
                  </p>
                  <p>Fecha visita: {fmtDate(reserva.reservationDate)}</p>
                  <p>Tipo visitante: {reserva.tipoVisitante}</p>
                  {typeof reserva.cantidadAcompaniantes === "number" && (
                    <p>Acompañantes: {reserva.cantidadAcompaniantes}</p>
                  )}
                  {typeof reserva.cantidadEstudiantes === "number" && (
                    <p>Estudiantes: {reserva.cantidadEstudiantes}</p>
                  )}
                  {reserva.comentario && <p>Comentario: {reserva.comentario}</p>}
                </div>

                <div className="flex gap-2 mt-3 md:mt-0">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => actualizarEstado(reserva.id, "confirmada")}
                  >
                    Confirmar
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => actualizarEstado(reserva.id, "rechazada")}
                  >
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CONFIRMADAS */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Reservas Confirmadas</h2>
        {confirmadas.length === 0 ? (
          <p className="text-gray-600">No hay reservas confirmadas.</p>
        ) : (
          <ul className="space-y-4">
            {confirmadas.map((reserva) => (
              <li key={reserva.id} className="border rounded p-4 bg-green-50">
                <p>
                  <strong>
                    {reserva.nombre} {reserva.apellido}
                  </strong>{" "}
                  — DNI: {reserva.dni}
                </p>
                <p>Fecha visita: {fmtDate(reserva.reservationDate)}</p>
                <p>Tipo visitante: {reserva.tipoVisitante}</p>
                {typeof reserva.cantidadAcompaniantes === "number" && (
                  <p>Acompañantes: {reserva.cantidadAcompaniantes}</p>
                )}
                {typeof reserva.cantidadEstudiantes === "number" && (
                  <p>Estudiantes: {reserva.cantidadEstudiantes}</p>
                )}
                {reserva.comentario && <p>Comentario: {reserva.comentario}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

