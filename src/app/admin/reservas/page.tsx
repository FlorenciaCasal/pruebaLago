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

// const fmtDT = (iso: string) =>
//   new Date(iso).toLocaleString(undefined, { hour12: false });

export default function ReservasPage() {
  const [status, setStatus] = React.useState<AdminStatus>("ALL");
  const [data, setData] = React.useState<AdminReservation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionId, setActionId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [searchDate, setSearchDate] = React.useState<string>("");
  const [searchName, setSearchName] = React.useState<string>("");
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [activePage, setActivePage] = React.useState(0);


  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Pasar la fecha al backend si está presente
      const d = await fetchReservations(status, searchDate || undefined);

      // Filtrar por nombre en el frontend (ya que el backend no lo soporta)
      let filtered = d;
      if (searchName) {
        const query = searchName.toLowerCase();
        filtered = d.filter(r => {
          const fullName = `${r.nombre ?? ""} ${r.apellido ?? ""}`.toLowerCase();
          return fullName.includes(query);
        });
      }

      setData(filtered);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status, searchDate, searchName]);

  React.useEffect(() => { load(); }, [load]);

  const onConfirm = async (id: string) => {
    setActionId(id);
    setError(null);
    setSuccessMsg(null);
    try {
      await confirmReservation(id);
      setSuccessMsg("Reserva confirmada exitosamente");
      // Actualizar la reserva en el estado local
      setData(prev => prev.map(r => r.id === id ? { ...r, status: "CONFIRMED" } : r));
      // Si no estamos en "ALL", remover de la lista después de 1 segundo
      if (status !== "ALL") {
        setTimeout(() => setData(prev => prev.filter(r => r.id !== id)), 1000);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const onCancel = async (id: string) => {
    setActionId(id);
    setError(null);
    setSuccessMsg(null);
    try {
      await cancelReservation(id);
      setSuccessMsg("Reserva cancelada exitosamente");
      // Actualizar la reserva en el estado local
      setData(prev => prev.map(r => r.id === id ? { ...r, status: "CANCELLED" } : r));
      // Si no estamos en "ALL", remover de la lista después de 1 segundo
      if (status !== "ALL") {
        setTimeout(() => setData(prev => prev.filter(r => r.id !== id)), 1000);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  React.useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    const updatePages = () => {
      if (!el) return;
      const totalWidth = el.scrollWidth;
      const visibleWidth = el.clientWidth;
      const count = Math.ceil(totalWidth / visibleWidth);
      setPageCount(count);
    };

    const handleScroll = () => {
      if (!el) return;
      const ratio = el.scrollLeft / (el.scrollWidth - el.clientWidth);
      const currentPage = Math.round(ratio * (pageCount - 1));
      setActivePage(currentPage);
    };

    updatePages();
    handleScroll();

    el.addEventListener("scroll", handleScroll, { passive: true });
    const ro = new ResizeObserver(updatePages);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      ro.disconnect();
    };
  }, [pageCount]);

  function goToPage(i: number) {
    const el = tabsRef.current;
    if (!el) return;
    const viewport = el.clientWidth;           // ancho visible
    const targetLeft = Math.min(i * viewport, el.scrollWidth - viewport);
    el.scrollTo({ left: targetLeft, behavior: "smooth" });
  }

  return (
    <div className="space-y-4 w-full overflow-x-hidden">
      {/* Mensajes de éxito y error */}
      {successMsg && (
        <div className="rounded-xl border border-green-800 bg-green-950/40 p-4 text-green-300 flex items-center justify-between">
          {/* <span>{successMsg}</span> */}
          <span className="min-w-0 truncate">{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-green-400 hover:text-green-200">✕</button>
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-300 flex items-center justify-between">
          {/* <span>{error}</span> */}
          <span className="min-w-0 truncate">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {/* Tabs */}
      {/* <div className="flex flex-wrap gap-2"> */}
      <div
        ref={tabsRef}
        className="flex gap-1 overflow-x-auto no-scrollbar -mx-1 px-1 snap-x snap-mandatory sm:flex-wrap fade-edges-mobile [touch-action:pan-x]"
      >
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={
              "rounded-xl border px-3 py-1.5 text-sm shrink-0 snap-start " +
              (status === t.key
                ? "border-neutral-500 bg-neutral-800 text-white"
                : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-[#8e8e8f]")
            }
          >
            {t.label}
          </button>
        ))}

        <div className="ms-auto shrink-0">
          {/* <button
            onClick={load}
            // className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800 snap-end"
          >
            Refrescar
          </button> */}
          <button
            onClick={load}
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800 snap-end inline-flex items-center gap-2"
          >
            <span className="hidden xs:inline">Refrescar</span>
            <svg className="xs:hidden w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 6v3l4-4-4-4v3a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Indicadores tipo carrusel (solo si hay overflow y en mobile) */}
      {pageCount > 1 && (
        <div className="flex justify-center gap-1 mt-1 sm:hidden" role="tablist" aria-label="Secciones visibles">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              role="tab"
              aria-selected={i === activePage}
              className={
                "h-1.5 w-1.5 rounded-full will-change-transform transition-all duration-200 " +
                (i === activePage ? "bg-neutral-200 scale-110" : "bg-neutral-600/50 scale-90")
              }
              aria-label={`Ir a grupo ${i + 1} de ${pageCount}`}
            />
          ))}
        </div>
      )}


      {/* Búsqueda */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="min-w-0">
            <label className="block text-sm text-white mb-2">Buscar por fecha de visita</label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-white px-3 py-2 text-sm text-black focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div className="min-w-0">
            <label className="block text-sm text-neutral-400 mb-2">Buscar por nombre</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Nombre o apellido..."
              className="w-full rounded-lg border border-neutral-700 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setSearchDate(""); setSearchName(""); }}
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm hover:bg-neutral-800"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
        {(searchDate || searchName) && (
          <div className="mt-3 text-sm text-neutral-400">
            {data.length} reserva{data.length !== 1 ? 's' : ''} encontrada{data.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Lista responsive */}
      {loading ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">Cargando...</div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
          {(searchDate || searchName)
            ? "No se encontraron reservas con los filtros aplicados."
            : "No hay reservas."}
        </div>
      ) : (
        <>
          {/* En pantallas chicas: cards, sin scroll horizontal */}
          <div className="lg:hidden space-y-3">
            {data.map(r => (
              <div key={r.id} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="text-sm text-neutral-400">{new Date(r.reservationDate + "T00:00:00").toLocaleDateString("es-AR")}</div>
                <div className="text-base font-medium">{[r.nombre, r.apellido].filter(Boolean).join(" ") || "-"}</div>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div><dt className="text-neutral-400">Personas</dt><dd>{r.personas ?? "-"}</dd></div>
                  <div><dt className="text-neutral-400">Tipo</dt><dd className="break-words">{r.tipoVisitante ?? "-"}</dd></div>
                  <div><dt className="text-neutral-400">Circuito</dt><dd>{r.circuito ?? "-"}</dd></div>
                  <div><dt className="text-neutral-400">Estado</dt><dd>{r.status}</dd></div>
                  <div className="col-span-2"><dt className="text-neutral-400">Creada</dt><dd className="text-neutral-400">{new Date(r.createdAt).toLocaleDateString("es-AR")}</dd></div>
                </dl>
                <div className="mt-3 flex justify-center sm:justify-end gap-4">
                  {r.status !== "CONFIRMED" && r.status !== "CANCELLED" && (
                    <button
                      onClick={() => onConfirm(r.id)}
                      disabled={actionId === r.id}
                      className="inline-flex w-28 items-center justify-center rounded-lg bg-green-600/90 px-3 py-2 text-white hover:bg-green-600 disabled:opacity-60"
                    >
                      {actionId === r.id ? "..." : "Confirmar"}
                    </button>
                  )}
                  {r.status !== "CANCELLED" && (
                    <button
                      onClick={() => onCancel(r.id)}
                      disabled={actionId === r.id}
                      className="inline-flex w-28 items-center justify-center rounded-lg bg-red-600/90 px-3 py-1.5 text-white hover:bg-red-600 disabled:opacity-60"
                    >
                      {actionId === r.id ? "..." : "Cancelar"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* En md+ : tabla (ya no debería generar scroll del body) */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-gray-800">
              <div className="overflow-x-hidden"> {/* mantenemos sin scroll del body */}
                <table className="w-full text-[13px] table-auto">
                  <thead className="bg-neutral-950/80">
                    <tr className="[&>th]:px-2 [&>th]:py-2 [&>th]:text-left text-neutral-400">
                      <th className="w-32">Fecha reserva</th>
                      <th className="w-44">Nombre</th>
                      <th className="w-20">Personas</th>
                      {/* Tipo puede crecer pero con límite y rompiendo palabras */}
                      <th className="max-w-[14rem]">Tipo</th>
                      <th className="w-20">Circuito</th>
                      <th className="w-28">Estado</th>
                      {/* “Creada” solo en xl, para priorizar Acciones en lg */}
                      <th className="w-44 hidden xl:table-cell">Creada</th>
                      {/* Acciones con ancho fijo y sin shrink */}
                      <th className="w-[220px] shrink-0 text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-800">
                    {data.map(r => (
                      <tr key={r.id} className="[&>td]:px-2 [&>td]:py-2 align-top">
                        <td className="whitespace-nowrap">
                          {new Date(r.reservationDate + "T00:00:00").toLocaleDateString("es-AR")}
                        </td>
                        <td className="truncate">{[r.nombre, r.apellido].filter(Boolean).join(" ") || "-"}</td>
                        <td className="whitespace-nowrap">{r.personas ?? "-"}</td>
                        <td className="break-words">{r.tipoVisitante ?? "-"}</td>
                        <td className="whitespace-nowrap">{r.circuito ?? "-"}</td>
                        <td className="whitespace-nowrap">{r.status}</td>
                        {/* 👇 Creada: OCULTA en lg, visible en xl (misma regla que el th) */}
                        <td className="text-neutral-400 whitespace-nowrap hidden xl:table-cell">
                          {new Date(r.createdAt).toLocaleDateString("es-AR")}
                        </td>
                        <td>
                          <div className="flex flex-wrap justify-center gap-2">
                            {r.status !== "CONFIRMED" && r.status !== "CANCELLED" && (
                              <button
                                onClick={() => onConfirm(r.id)}
                                disabled={actionId === r.id}
                                className="inline-flex w-24 md:w-28 items-center justify-center rounded-lg bg-green-600/90 px-3 py-1.5 text-white hover:bg-green-600 disabled:opacity-60 text-sm"
                              >
                                {actionId === r.id ? "..." : "Confirmar"}
                              </button>
                            )}
                            {r.status !== "CANCELLED" && (
                              <button
                                onClick={() => onCancel(r.id)}
                                disabled={actionId === r.id}
                                className="inline-flex w-24 md:w-28 items-center justify-center rounded-lg bg-red-600/90 px-3 py-1.5 text-white hover:bg-red-600 disabled:opacity-60 text-sm"
                              >
                                {actionId === r.id ? "..." : "Cancelar"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}