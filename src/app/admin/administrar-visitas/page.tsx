"use client";

import { useEffect, useState } from "react";

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
  acompaniantes?: Array<{ dni: string; nacimiento: string }>;
  cantidadEstudiantes?: number;
  comentario?: string;
  status: "pendiente" | "confirmada" | "rechazada";
};

export default function AdministrarVisitas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/reservations");
      if (!res.ok) throw new Error("Error al cargar las reservas");
      const data = await res.json();
      setReservas(data);
    } catch (e: any) {
      setError(e.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: "confirmada" | "rechazada") => {
    try {
      const res = await fetch(`http://localhost:8080/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nuevoEstado }),
      });
      if (!res.ok) throw new Error("Error actualizando el estado");
      // Refrescar lista
      await fetchReservas();
    } catch (e) {
      alert("Error al actualizar el estado");
    }
  };

  const pendientes = reservas.filter((r) => r.status === "pendiente");
  const confirmadas = reservas.filter((r) => r.status === "confirmada");

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Administrar Visitas</h1>

      {loading && <p>Cargando reservas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Reservas Pendientes</h2>
        {pendientes.length === 0 && <p>No hay reservas pendientes.</p>}
        <ul className="space-y-4">
          {pendientes.map((reserva) => (
            <li
              key={reserva.id}
              className="border rounded p-4 bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div>
                <p>
                  <strong>{reserva.nombre} {reserva.apellido}</strong> - DNI: {reserva.dni}
                </p>
                <p>Fecha visita: {new Date(reserva.reservationDate).toLocaleDateString()}</p>
                <p>Tipo visitante: {reserva.tipoVisitante}</p>
                {reserva.cantidadAcompaniantes !== undefined && (
                  <p>Acompañantes: {reserva.cantidadAcompaniantes}</p>
                )}
                {reserva.cantidadEstudiantes !== undefined && (
                  <p>Estudiantes: {reserva.cantidadEstudiantes}</p>
                )}
                {reserva.comentario && <p>Comentario: {reserva.comentario}</p>}
              </div>

              <div className="flex space-x-2 mt-3 md:mt-0">
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
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Reservas Confirmadas</h2>
        {confirmadas.length === 0 && <p>No hay reservas confirmadas.</p>}
        <ul className="space-y-4">
          {confirmadas.map((reserva) => (
            <li
              key={reserva.id}
              className="border rounded p-4 bg-green-50"
            >
              <p>
                <strong>{reserva.nombre} {reserva.apellido}</strong> - DNI: {reserva.dni}
              </p>
              <p>Fecha visita: {new Date(reserva.reservationDate).toLocaleDateString()}</p>
              <p>Tipo visitante: {reserva.tipoVisitante}</p>
              {reserva.cantidadAcompaniantes !== undefined && (
                <p>Acompañantes: {reserva.cantidadAcompaniantes}</p>
              )}
              {reserva.cantidadEstudiantes !== undefined && (
                <p>Estudiantes: {reserva.cantidadEstudiantes}</p>
              )}
              {reserva.comentario && <p>Comentario: {reserva.comentario}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
