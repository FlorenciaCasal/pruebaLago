// app/admin/page.tsx

import Link from "next/link";
import { getAdminSummary, fetchRecentReservations } from "@/services/admin";

function StatusBadge({ s }: { s: "PENDING" | "CONFIRMED" | "CANCELLED" }) {
  const cls =
    s === "CONFIRMED"
      ? "bg-green-900/30 text-green-300 border-green-700/60"
      : s === "CANCELLED"
      ? "bg-red-900/30 text-red-300 border-red-700/60"
      : "bg-yellow-900/30 text-yellow-300 border-yellow-700/60";
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full border ${cls}`}>
      {s === "PENDING" ? "Pendiente" : s === "CONFIRMED" ? "Confirmada" : "Cancelada"}
    </span>
  );
}

function fmt(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default async function AdminDashboard() {
  const [summary, recent] = await Promise.all([
    getAdminSummary(),
    fetchRecentReservations(10),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Panel de Administración</h1>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="text-neutral-400 text-sm">Visitas Totales</div>
          <div className="text-3xl font-semibold mt-1">{summary.total}</div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="text-neutral-400 text-sm">Visitas de Hoy</div>
          <div className="text-3xl font-semibold mt-1">{summary.today}</div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="text-neutral-400 text-sm">Visitas Pendientes</div>
          <div className="text-3xl font-semibold mt-1">{summary.pending}</div>
        </div>
      </div>

      {/* Tabla de recientes */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950">
        <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="font-medium">Visitas Recientes</h2>
          <Link
            href="/admin/reservas"
            className="text-sm text-neutral-300 underline hover:text-white"
          >
            Ver todas
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-900/60">
              <tr className="[&>th]:px-4 [&>th]:py-2 text-left text-neutral-400">
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Fecha de visita</th>
                <th>Creada</th>
                <th>Personas</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-t border-neutral-800">
                  <td className="px-4 py-2">{r.nombre}</td>
                  <td className="px-4 py-2">
                    {r.tipoVisitante === "INSTITUCION_EDUCATIVA" ? "Institución" : "Particular"}
                  </td>
                  <td className="px-4 py-2">{fmt(r.reservationDate)}</td>
                  <td className="px-4 py-2">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-2">{r.personas}</td>
                  <td className="px-4 py-2"><StatusBadge s={r.status} /></td>
                  <td className="px-4 py-2">
                    <Link
                      href="/admin/reservas"
                      className="text-sm text-neutral-300 underline hover:text-white"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-neutral-400" colSpan={7}>
                    No hay reservas todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
