"use client";
import React from "react";
import { fetchReservations, confirmReservation, cancelReservation, type AdminStatus, } from "@/services/admin";
import type { AdminReservation } from "@/types/admin";
import CompanionsDisclosure from "@/components/admin/CompanionsDisclosure";
import { exportReservationsBackend } from "@/services/admin";


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

const STATUS_ES: Record<Exclude<AdminStatus, "ALL">, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

// por si llega en minúsculas/mixto:
function statusToEs(s: string) {
  const key = s.trim().toUpperCase() as keyof typeof STATUS_ES;
  return STATUS_ES[key] ?? s; // fallback por si aparece otro valor
}

const TIPO_ES: Record<string, string> = {
  PARTICULAR: "Particular",
  INSTITUCION_EDUCATIVA: "Institución educativa",
};

// Fallback genérico por si mañana aparece otro valor:
function tipoToEs(v?: string) {
  if (!v) return "-";
  const key = v.trim().toUpperCase();
  if (TIPO_ES[key]) return TIPO_ES[key];
  // genérico: "ALGO_MAS" -> "Algo mas"
  return v
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\p{L}/gu, (ch) => ch.toUpperCase());
}


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
  const [showFilters, setShowFilters] = React.useState(false);
  const [searchDni, setSearchDni] = React.useState<string>(""); // nuevo
  const activeCount = [searchDate, searchName, searchDni].filter(Boolean).length;
  const [openRows, setOpenRows] = React.useState<Record<string, boolean>>({});
  const toggleRow = (id: string) => setOpenRows(s => ({ ...s, [id]: !s[id] }));
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches) {
      setShowFilters(true); // sm+: arrancá abierto
    }
  }, []);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Pasar la fecha al backend si está presente
      // const d = await fetchReservations(status, searchDate || undefined);
      const res = await fetchReservations(
        status,
        searchDate || undefined,
        searchDni || undefined,
        searchName || undefined,
        page,
        20
      );

      // setData(filtered);
      // setData(d);
      setData(res.items);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status, searchDate, searchName, searchDni, page]);

  React.useEffect(() => {
    setPage(0);
  }, [status, searchDate, searchName, searchDni]);

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


  const handleBackendExport = async () => {
    try {
      const { blob, filename } = await exportReservationsBackend({
        date: searchDate || undefined,
        status: status !== "ALL" ? status : undefined,
        dni: searchDni || undefined,
        name: searchName || undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("No se pudo exportar el archivo.");
    }
  };


  return (
    <div className="space-y-4 w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl pt-4 font-semibold">Reservas</h1>
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
        className="flex gap-1 overflow-x-auto no-scrollbar -mx-1 px-1 snap-x snap-mandatory sm:flex-wrap fade-edges-mobile [touch-action:pan-x] mt-[16px] xl:mt-0"
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

        {/* <div className="ms-auto shrink-0"> */}
        <div className="ms-auto shrink-0 flex items-center gap-2">
          <button
            onClick={load}
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800 snap-end inline-flex items-center gap-2"
          >
            <span className="hidden sm:inline">Actualizar</span>
            <svg className="xs:hidden w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 6v3l4-4-4-4v3a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6z" />
            </svg>
          </button>

          {/* <button
            onClick={() => exportToExcel(data)}
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
          >
            Exportar a Excel
          </button> */}
          <button
            onClick={handleBackendExport}
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
          >
            Exportar a Excel
          </button>

          {/* Nuevo: toggle de filtros para sm+ */}
          {/* <button
            onClick={() => setShowFilters(v => !v)}
            className="hidden sm:inline-flex rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
          >
            {showFilters ? "Ocultar filtros" : `Filtros${activeCount ? ` (${activeCount})` : ""}`}
          </button> */}
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


      {/* Chips activos (mobile) */}
      {
        activeCount > 0 && (
          <div className="sm:hidden mt-2 flex flex-wrap gap-2">
            {searchDate && (
              <button
                onClick={() => setSearchDate("")}
                className="inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2.5 py-1 text-xs"
              >
                Fecha: {searchDate.split("-").reverse().join("/")} <span>×</span>
              </button>
            )}
            {searchName && (
              <button
                onClick={() => setSearchName("")}
                className="inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2.5 py-1 text-xs"
              >
                Nombre: “{searchName}” <span>×</span>
              </button>
            )}
            {searchDni && (
              <button
                onClick={() => setSearchDni("")}
                className="inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2.5 py-1 text-xs"
              >
                DNI: {searchDni} <span>×</span>
              </button>
            )}
          </div>
        )
      }


      <div
        className={
          // en mobile: esconder si está cerrado y no hay activos; en sm+ siempre visible
          `rounded-2xl border border-neutral-800 bg-neutral-950 ${showFilters ? "block" : "hidden"} p-3 sm:p-4`
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Fecha */}
          <div className="min-w-0">
            <label className="hidden sm:block text-sm text-neutral-300 mb-2">Buscar por fecha de visita</label>
            {/* <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              placeholder="Fecha de visita"
              className="w-full rounded-lg border border-neutral-700 bg-white px-3 h-[40px] text-sm text-black placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none appearance-none"
            /> */}
            <div className="relative">
              {!searchDate && (
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                  Fecha de visita
                </span>
              )}

              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full h-[40px] appearance-none rounded-lg border border-neutral-700 bg-white px-3 text-sm text-black focus:border-neutral-500 focus:outline-none" />
            </div>

          </div>

          {/* Nombre */}
          <div className="min-w-0">
            <label className="hidden sm:block text-sm text-neutral-300 mb-2">Buscar por nombre o apellido</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Nombre o apellido..."
              className="w-full rounded-lg border border-neutral-700 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
            />
          </div>

          {/* DNI — NUEVO */}
          <div className="min-w-0">
            <label className="hidden sm:block text-sm text-neutral-300 mb-2">Buscar por DNI</label>
            <input
              type="text"
              inputMode="numeric"
              value={searchDni}
              onChange={(e) => setSearchDni(e.target.value.replace(/\D+/g, "").slice(0, 10))}
              placeholder="DNI"
              className="w-full rounded-lg border border-neutral-700 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>

        {/* acciones abajo a la derecha en sm+; centrado en mobile */}
        <div className="mt-3 flex justify-center sm:justify-end gap-2">
          <button
            onClick={() => setShowFilters(false)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm hover:bg-neutral-800"
          >
            Ocultar filtros
          </button>

          <button
            onClick={() => { setSearchDate(""); setSearchName(""); setSearchDni(""); }}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm hover:bg-neutral-800"
          >
            Limpiar filtros
          </button>
        </div>

        {(searchDate || searchName || searchDni) && (
          <div className="mt-3 text-sm text-neutral-400">
            {data.length} reserva{data.length !== 1 ? "s" : ""} encontrada{data.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Mostrar botón para volver a abrir filtros cuando están ocultos (solo en sm+)  */}
      {!showFilters && (
        <div className="flex justify-start">
          <button
            onClick={() => setShowFilters(true)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm hover:bg-neutral-800"
          >
            {`Mostrar filtros${activeCount ? ` (${activeCount})` : ""}`}
          </button>
        </div>
      )}

      {/* Lista responsive */}
      {loading ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">Cargando...</div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
          {(searchDate || searchName || searchDni)
            ? "No se encontraron reservas con los filtros aplicados."
            : "No hay reservas."}
        </div>
      ) : (
        <>
          {/* En pantallas chicas: cards, sin scroll horizontal */}

          <div className="lg:hidden space-y-3">
            {data.map(r => (
              <div key={r.id} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="flex gap-1 text-sm text-neutral-400">
                  <dt className="text-neutral-400">Creada: </dt>
                  <dd className="text-neutral-400">{new Date(r.createdAt).toLocaleDateString("es-AR")}</dd>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div> <dt className="text-neutral-400">Nombre y apellido</dt><dd>{[r.nombre, r.apellido].filter(Boolean).join(" ") || "-"}</dd></div>
                  <div> <dt className="text-neutral-400">DNI</dt><dd>{r.dni ?? "-"}</dd></div>
                  {/* <div><dt className="text-neutral-400">Pax</dt><dd>{r.personas ?? "-"}</dd></div> */}
                  <div>
                    <dt className="text-neutral-400">Pax</dt>
                    <dd>
                      {r.personas ?? "-"}
                      {typeof r.adultos === "number" && (
                        <span className="block text-xs text-neutral-400">
                          {r.adultos} adultos · {r.ninos} niños · {r.bebes} bebés
                        </span>
                      )}
                    </dd>
                  </div>

                  <div><dt className="text-neutral-400">Tipo</dt><dd className="break-words">{tipoToEs(r.tipoVisitante)}</dd></div>
                  {/* <div><dt className="text-neutral-400">Circuito</dt><dd>{r.circuito ?? "-"}</dd></div> */}
                  <div><dt className="text-neutral-400">Ciudad</dt><dd>{r.originLocation ?? "-"}</dd></div>
                  {/* <div><dt className="text-neutral-400">Estado</dt><dd>{r.status}</dd></div> */}
                  <div> <dt className="text-neutral-400">Estado</dt><dd>{statusToEs(r.status)}</dd></div>
                  <div> <dt className="text-neutral-400">Email</dt><dd className="break-words">{r.correo ?? "-"}</dd></div>
                  <div> <dt className="text-neutral-400">Teléfono</dt><dd>{r.telefono ?? "-"}</dd></div>
                  <div><dt className="text-neutral-400">Fecha de visita</dt> <div className="text-sm text-white">{new Date(r.reservationDate + "T00:00:00").toLocaleDateString("es-AR")}</div></div>

                  {/* 👇 Movilidad reducida */}
                  <div className="mt-2 col-span-2">
                    <dt className="text-neutral-400">Movilidad reducida</dt>
                    <dd className="text-sm">
                      {r.movilidadReducida > 0 ? (
                        <span className="block">
                          {r.movilidadReducida} persona{r.movilidadReducida > 1 ? "s" : ""} con movilidad reducida
                        </span>
                      ) : (
                        <span className="text-neutral-500">-</span>
                      )}
                    </dd>
                  </div>

                  {/* 👇 NUEVO: Comentarios */}
                  <div className="col-span-2">
                    <dt className="text-neutral-400">Comentarios</dt>
                    <dd className="text-sm text-neutral-300">
                      {r.comentarios && r.comentarios.trim()
                        ? r.comentarios
                        : <span className="text-neutral-500">-</span>}
                    </dd>
                  </div>

                  {/* Acompañantes (desplegable) */}
                  {/* <div className="mt-3 col-span-2">
                    <CompanionsDisclosure companions={r.companions} dense />
                  </div> */}
                  <div className="mt-4 -mx-4 border-t border-neutral-800 pt-3">
                    <CompanionsDisclosure companions={r.companions} dense />
                  </div>

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
            <div className=" border border-gray-800 overflow-x-auto lg:overflow-y-auto lg:max-h-[70vh]">
              <table className="w-full text-[13px] table-auto">
                {/* <thead className="bg-neutral-950/80"> */}
                <thead className="bg-neutral-950/95 lg:sticky lg:top-0 lg:z-20">
                  {/* <tr className="[&>th]:px-2 [&>th]:py-2 [&>th]:text-left text-neutral-400"> */}
                  <tr className="[&>th]:px-2 [&>th]:py-2 [&>th]:text-left text-neutral-400 [&>th]:bg-neutral-950/95 lg:[&>th]:sticky lg:[&>th]:top-0">
                    {/* “Creada” solo en xl, para priorizar Acciones en lg */}
                    {/* <th className="w-44 xl:table-cell">Creada</th> */}
                    <th className="w-32">Creada</th>
                    <th className="w-32">Fecha de visita</th>
                    <th className="w-44">Nombre y apellido</th>
                    <th className="w-20">DNI</th>
                    <th className="w-20">Pax</th>
                    {/* Tipo puede crecer pero con límite y rompiendo palabras */}
                    <th className="max-w-[14rem]">Tipo</th>
                    <th className="w-20">Ciudad origen</th>
                    <th className="w-28">Estado</th>

                    {/* Acciones con ancho fijo y sin shrink */}
                    <th >Email</th>
                    <th >Teléfono</th>
                    <th className="w-40">Mov. reducida</th>
                    <th className="w-56">Comentarios</th>
                    <th className="w-40 text-center">Visitantes</th>
                    <th className="w-[220px] shrink-0 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-800">
                  {data.map(r => (
                    <React.Fragment key={r.id}>
                      <tr className="[&>td]:px-2 [&>td]:py-2 align-center">
                        <td className="text-neutral-400 whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString("es-AR")}
                        </td>
                        <td className="whitespace-nowrap">
                          {new Date(r.reservationDate + "T00:00:00").toLocaleDateString("es-AR")}
                        </td>
                        <td className="truncate">{[r.nombre, r.apellido].filter(Boolean).join(" ") || "-"}</td>
                        <td className="text-neutral-400">{r.dni ?? "-"}</td>
                        {/* <td className="whitespace-nowrap">{r.personas ?? "-"}</td> */}
                        <td className="whitespace-nowrap">
                          {r.personas ?? "-"}
                          {typeof r.adultos === "number" && typeof r.ninos === "number" && typeof r.bebes === "number" && (
                            <span className="ml-1 text-[11px] text-neutral-400">
                              ({r.adultos}A / {r.ninos}N / {r.bebes}B)
                            </span>
                          )}
                        </td>

                        <td className="break-words">{tipoToEs(r.tipoVisitante)}</td>
                        {/* <td className="whitespace-nowrap">{r.circuito ?? "-"}</td> */}
                        <td className="whitespace-nowrap">{r.originLocation ?? "-"}</td>
                        <td className="whitespace-nowrap">{statusToEs(r.status)}</td>


                        <td className="whitespace-nowrap">{r.correo ?? "-"}</td>
                        <td className="whitespace-nowrap">{r.telefono ?? "-"}</td>


                        {/* 👇 Columna Movilidad reducida */}
                        <td className="text-xs leading-snug align-top">
                          {r.movilidadReducida > 0 ? (
                            <div>{r.movilidadReducida} mov. reducida</div>
                          ) : (
                            <span className="text-neutral-500">-</span>
                          )}
                        </td>

                        {/* 👇 Columna Comentarios */}
                        <td className="text-xs leading-snug align-top">
                          {r.comentarios && r.comentarios.trim() ? (
                            <div
                              className="text-neutral-400 line-clamp-2"
                              title={r.comentarios}
                            >
                              {r.comentarios}
                            </div>
                          ) : (
                            <span className="text-neutral-500">-</span>
                          )}
                        </td>

                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => toggleRow(r.id)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm hover:text-[#8e8e8f]"
                            aria-expanded={!!openRows[r.id]}
                          >
                            Ver {r.companions?.length ?? 0}
                            <svg
                              className={"w-4 h-4 transition-transform " + (openRows[r.id] ? "rotate-180" : "")}
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M7 10l5 5 5-5H7z" />
                            </svg>
                          </button>
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

                      {openRows[r.id] && (
                        <tr>
                          <td colSpan={14} className="px-2 py-2 bg-neutral-950">
                            <CompanionsDisclosure companions={r.companions} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 sm:gap-2 mt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            className="px-2 sm:px-3 py-1 rounded-md border border-neutral-700 text-xs sm:text-sm disabled:opacity-40 hover:bg-neutral-800"
          >
            ←
            <span className="hidden sm:inline ml-1">Anterior</span>
          </button>

          <span className="text-xs sm:text-sm text-neutral-400 min-w-[4rem] text-center">
            <span className="sm:hidden">
              {page + 1} / {totalPages}
            </span>
            <span className="hidden sm:inline">
              Página {page + 1} de {totalPages}
            </span>
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            className="px-2 sm:px-3 py-1 rounded-md border border-neutral-700 text-xs sm:text-sm disabled:opacity-40 hover:bg-neutral-800">
            <span className="hidden sm:inline mr-1">Siguiente</span>
            →
          </button>
        </div>
      )}
    </div>

  );
}
