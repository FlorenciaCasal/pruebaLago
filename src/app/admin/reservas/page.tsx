// "use client";
// import React from "react";
// import {
//   fetchReservations,
//   confirmReservation,
//   cancelReservation,
//   type AdminStatus,
// } from "@/services/admin";
// import type { AdminReservation } from "@/types/admin";

// function getErrorMessage(err: unknown): string {
//   if (err instanceof Error) return err.message;
//   if (typeof err === "string") return err;
//   const m = (err as { message?: string } | null)?.message;
//   return m ?? "Ocurrió un error";
// }


// const TABS: { key: AdminStatus; label: string }[] = [
//   { key: "ALL", label: "Todas" },
//   { key: "PENDING", label: "Pendientes" },
//   { key: "CONFIRMED", label: "Confirmadas" },
//   { key: "CANCELLED", label: "Canceladas" },
// ];

// export default function ReservasPage() {
//   const [status, setStatus] = React.useState<AdminStatus>("PENDING");
//   const [data, setData] = React.useState<AdminReservation[]>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [actionId, setActionId] = React.useState<string | null>(null);
//   const [error, setError] = React.useState<string | null>(null);

//   const load = React.useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const d = await fetchReservations({ status });
//       setData(d);
//     } catch (err: unknown) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [status]);

//   React.useEffect(() => { load(); }, [load]);

//   const onConfirm = async (id: string) => {
//     setActionId(id);
//     try {
//       await confirmReservation(id);
//       setData(prev => status === "ALL" ? prev : prev.filter(r => r.id !== id));
//       if (status === "ALL") load();
//     } catch (err: unknown) {
//       alert(getErrorMessage(err));
//     } finally {
//       setActionId(null);
//     }
//   };

//   const onCancel = async (id: string) => {
//     setActionId(id);
//     try {
//       await cancelReservation(id);
//       setData(prev => status === "ALL" ? prev : prev.filter(r => r.id !== id));
//       if (status === "ALL") load();
//     } catch (err: unknown) {
//       alert(getErrorMessage(err));
//     } finally {
//       setActionId(null);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Tabs */}
//       <div className="flex gap-2">
//         {TABS.map(t => (
//           <button
//             key={t.key}
//             onClick={() => setStatus(t.key)}
//             className={
//               "rounded-xl border px-3 py-1.5 text-sm " +
//               (status === t.key
//                 ? "border-neutral-500 bg-neutral-800 text-white"
//                 : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-900")
//             }
//           >
//             {t.label}
//           </button>
//         ))}
//         <div className="ml-auto">
//           <button onClick={load} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800">
//             Refrescar
//           </button>
//         </div>
//       </div>

//       {/* Tabla */}
//       {loading ? (
//         <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">Cargando...</div>
//       ) : error ? (
//         <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-300">{error}</div>
//       ) : data.length === 0 ? (
//         <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">No hay reservas.</div>
//       ) : (
//         <div className="overflow-x-auto rounded-2xl border border-neutral-800">
//           <table className="min-w-full text-sm">
//             <thead className="bg-neutral-950/80">
//               <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left text-neutral-400">
//                 <th>Fecha reserva</th>
//                 <th>Nombre</th>
//                 <th>Personas</th>
//                 <th>Tipo</th>
//                 <th>Circuito</th>
//                 <th>Estado</th>
//                 <th>Creada</th>
//                 <th className="text-right w-[210px]">Acciones</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-neutral-800">
//               {data.map(r => (
//                 <tr key={r.id} className="[&>td]:px-4 [&>td]:py-3">
//                   <td>{new Date(r.reservationDate).toLocaleString()}</td>
//                   <td>{[r.nombre, r.apellido].filter(Boolean).join(" ") || "-"}</td>
//                   <td>{r.personas ?? "-"}</td>
//                   <td>{r.tipoVisitante ?? "-"}</td>
//                   <td>{r.circuito ?? "-"}</td>
//                   <td>{r.status}</td>
//                   <td className="text-neutral-400">{new Date(r.createdAt).toLocaleString()}</td>
//                   <td className="text-right">
//                     <div className="inline-flex items-center justify-end gap-2 whitespace-nowrap">
//                       <button
//                         onClick={() => onConfirm(r.id)}
//                         disabled={actionId === r.id}
//                         className="rounded-lg bg-green-600/90 px-3 py-1.5 text-white hover:bg-green-600 disabled:opacity-60"
//                       >
//                         {actionId === r.id ? "..." : "Confirmar"}
//                       </button>
//                       <button
//                         onClick={() => onCancel(r.id)}
//                         disabled={actionId === r.id}
//                         className="rounded-lg bg-red-600/90 px-3 py-1.5 text-white hover:bg-red-600 disabled:opacity-60"
//                       >
//                         {actionId === r.id ? "..." : "Cancelar"}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
// app/admin/reservas/page.tsx
"use client";
import React from "react";
import {
  fetchReservations,
  confirmReservation,
  cancelReservation,
  type AdminStatus,
} from "@/services/admin";
import type { AdminReservation } from "@/types/admin";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return (err as { message?: string } | null)?.message ?? "Ocurrió un error";
}
const TABS: { key: AdminStatus; label: string }[] = [
  { key: "ALL", label: "Todas" },
  { key: "PENDING", label: "Pendientes" },
  { key: "CONFIRMED", label: "Confirmadas" },
  { key: "CANCELLED", label: "Canceladas" },
];
const fmtDT = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { hour12: false });

export default function ReservasPage() {
  const [status, setStatus] = React.useState<AdminStatus>("PENDING");
  const [data, setData] = React.useState<AdminReservation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionId, setActionId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await fetchReservations({ status });
      setData(d);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status]);

  React.useEffect(() => { load(); }, [load]);

  const onConfirm = async (id: string) => {
    setActionId(id);
    try {
      await confirmReservation(id);
      setData(prev => status === "ALL" ? prev : prev.filter(r => r.id !== id));
      if (status === "ALL") load();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const onCancel = async (id: string) => {
    setActionId(id);
    try {
      await cancelReservation(id);
      setData(prev => status === "ALL" ? prev : prev.filter(r => r.id !== id));
      if (status === "ALL") load();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={
              "rounded-xl border px-3 py-1.5 text-sm " +
              (status === t.key
                ? "border-neutral-500 bg-neutral-800 text-white"
                : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-900")
            }
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto">
          <button
            onClick={load}
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
          >
            Refrescar
          </button>
        </div>
      </div>

      {/* Estados */}
      {loading && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">Cargando...</div>
      )}
      {!loading && error && (
        <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-300">{error}</div>
      )}
      {!loading && !error && data.length === 0 && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">No hay reservas.</div>
      )}

      {/* Cards mobile (sin scroll horizontal) */}
      {!loading && !error && data.length > 0 && (
        <>
          <div className="lg:hidden space-y-3">
            {data.map(r => (
              <div key={r.id} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium truncate">{r.nombre || "-"}</div>
                  <span className="text-xs rounded-full px-2 py-0.5 border
                    {r.status === 'CONFIRMED' ? 'bg-green-900/30 text-green-300 border-green-700/60'
                    : r.status === 'CANCELLED' ? 'bg-red-900/30 text-red-300 border-red-700/60'
                    : 'bg-yellow-900/30 text-yellow-300 border-yellow-700/60'}">
                    {r.status}
                  </span>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div><dt className="text-neutral-400">Fecha</dt><dd className="font-medium">{fmtDT(r.reservationDate)}</dd></div>
                  <div><dt className="text-neutral-400">Creada</dt><dd className="text-neutral-300">{fmtDT(r.createdAt)}</dd></div>
                  <div><dt className="text-neutral-400">Personas</dt><dd>{r.personas ?? "-"}</dd></div>
                  <div><dt className="text-neutral-400">Tipo</dt><dd>{r.tipoVisitante}</dd></div>
                  <div><dt className="text-neutral-400">Circuito</dt><dd>{r.circuito}</dd></div>
                </dl>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onConfirm(r.id)}
                    disabled={actionId === r.id}
                    className="rounded-lg bg-green-600/90 px-3 py-1.5 text-white hover:bg-green-600 disabled:opacity-60"
                  >
                    {actionId === r.id ? "..." : "Confirmar"}
                  </button>
                  <button
                    onClick={() => onCancel(r.id)}
                    disabled={actionId === r.id}
                    className="rounded-lg bg-red-600/90 px-3 py-1.5 text-white hover:bg-red-600 disabled:opacity-60"
                  >
                    {actionId === r.id ? "..." : "Cancelar"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla desktop (md+) sin overflow */}
          <div className="hidden lg:block rounded-2xl border border-neutral-800 overflow-hidden">
            <table className="w-full table-fixed text-xs md:text-sm">
              <colgroup>
                <col className="w-[130px] xl:w-[160px]" /> {/* Fecha reserva */}
                <col />                                     {/* Nombre */}
                <col className="w-[70px]" />                {/* Personas */}
                <col className="w-[150px]" />               {/* Tipo */}
                <col className="hidden xl:table-column w-[80px]" />  {/* Circuito */}
                <col className="w-[110px]" />               {/* Estado */}
                <col className="hidden xl:table-column w-[160px]" /> /* Creada */
                <col className="w-[170px] xl:w-[200px]" />  {/* Acciones */}
              </colgroup>

              <thead className="bg-neutral-950/80">
                <tr className="[&>th]:px-2 md:[&>th]:px-3 [&>th]:py-2 [&>th]:text-left text-neutral-400">
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>Pers.</th>
                  <th>Tipo</th>
                  <th className="hidden xl:table-cell">Circuito</th>
                  <th>Estado</th>
                  <th className="hidden xl:table-cell">Creada</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-800">
                {data.map(r => (
                  <tr key={r.id} className="[&>td]:px-2 md:[&>td]:px-3 [&>td]:py-2">
                    <td className="whitespace-nowrap">{new Date(r.reservationDate).toLocaleString(undefined, { hour12: false })}</td>
                    <td className="truncate">{r.nombre || "-"}</td>
                    <td className="whitespace-nowrap">{r.personas ?? "-"}</td>
                    <td className="truncate">{r.tipoVisitante ?? "-"}</td>
                    <td className="hidden xl:table-cell whitespace-nowrap">{r.circuito ?? "-"}</td>
                    <td className="whitespace-nowrap">{r.status}</td>
                    <td className="hidden xl:table-cell whitespace-nowrap text-neutral-400">
                      {new Date(r.createdAt).toLocaleString(undefined, { hour12: false })}
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-2 whitespace-nowrap">
                        <button
                          onClick={() => onConfirm(r.id)}
                          disabled={actionId === r.id}
                          className="rounded-lg bg-green-600/90 px-3 py-1.5 text-white hover:bg-green-600 disabled:opacity-60"
                        >
                          {actionId === r.id ? "..." : "Confirmar"}
                        </button>
                        <button
                          onClick={() => onCancel(r.id)}
                          disabled={actionId === r.id}
                          className="rounded-lg bg-red-600/90 px-3 py-1.5 text-white hover:bg-red-600 disabled:opacity-60"
                        >
                          {actionId === r.id ? "..." : "Cancelar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

