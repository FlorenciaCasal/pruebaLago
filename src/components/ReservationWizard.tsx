"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CalendarPicker from "@/components/CalendarPicker";
import { radioCard, radioHidden, radioBadge } from "@/styles/ui"; // ← tus estilos

type VisitorType = "PARTICULAR" | "INSTITUCION_EDUCATIVA";

type FormValues = {
  visitorType?: VisitorType;
  circuitId?: string;   // usamos la "key" de abajo
  date?: string;        // ISO YYYY-MM-DD
  visitors: { adults: number; kids: number; babies: number };
};

const schema: yup.ObjectSchema<FormValues> = yup
  .object({
    visitorType: yup.mixed<VisitorType>().oneOf(["PARTICULAR", "INSTITUCION_EDUCATIVA"]).required(),
    circuitId: yup.string().required(),
    date: yup.string().required(),
    visitors: yup
      .object({
        adults: yup.number().min(0).required(),
        kids: yup.number().min(0).required(),
        babies: yup.number().min(0).required(),
      })
      .required(),
  })
  .required();

// Misma estructura que usás en RegisterForm
const CIRCUITS = [
  { key: "A", titulo: "Circuito Panorámico", summary: "Vistas y estaciones clave.", img: "/img/circuito1.jpg" },
  { key: "B", titulo: "Circuito de Senderos", summary: "Recorrido por senderos guiados.", img: "/img/circuito2.jpg" },
  { key: "C", titulo: "Circuito de Senderos", summary: "Ideal para ir con chicos.", img: "/img/circuito3.jpg" },
  { key: "D", titulo: "Circuito de Senderos", summary: "Para grupos con más tiempo.", img: "/img/circuito4.jpg" },
] as const;

export default function ReservationWizard({
  onComplete,
}: {
  onComplete?: (data: {
    visitorType: "PARTICULAR" | "INSTITUCION_EDUCATIVA";
    circuitId: string;
    dateISO: string;
    visitors: { adults: number; kids: number; babies: number };
  }) => void;
}) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: { visitors: { adults: 0, kids: 0, babies: 0 } },
  });

  const [open, setOpen] = useState<null | "TYPE" | "CIRCUIT" | "DATE" | "VISITORS">(null);

  const visitorType = watch("visitorType");
  const circuitId = watch("circuitId");
  const date = watch("date");
  const visitors = watch("visitors");
  const circuit = useMemo(() => CIRCUITS.find((c) => c.key === circuitId), [circuitId]);

  const onSubmit = (data: FormValues) => {
    if (onComplete && data.circuitId && typeof data.date === "string" && data.visitorType) {
      onComplete({
        visitorType: data.visitorType,
        circuitId: data.circuitId,
        dateISO: data.date,
        visitors: data.visitors, // ← NUEVO
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Reserva tu visita</h1>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Step
          label="Tipo de visitante"
          value={visitorType ? (visitorType === "PARTICULAR" ? "Particular" : "Institución educativa") : undefined}
          onClick={() => setOpen("TYPE")}
          error={!!errors.visitorType}
        />
        <Step
          label="Circuito"
          value={circuit?.titulo}
          onClick={() => setOpen("CIRCUIT")}
          disabled={!visitorType}
          error={!!errors.circuitId}
        />
        <Step label="Fecha" value={date} onClick={() => setOpen("DATE")} disabled={!circuitId} error={!!errors.date} />
        <Step label="Visitantes" value={formatVisitors(visitors)} onClick={() => setOpen("VISITORS")} disabled={!date} />
      </div>

      {/* Panel: Tipo */}
      <SidePanel open={open === "TYPE"} title="Tipo de visitante" onClose={() => setOpen(null)}>
        <OptionButton
          title="Particular"
          subtitle="Reserva individual, familia o amigos."
          onSelect={() => {
            setValue("visitorType", "PARTICULAR", { shouldValidate: true });
            setOpen(null);
          }}
        />
        <OptionButton
          title="Institución educativa"
          subtitle="Escuelas, universidades o grupos educativos."
          onSelect={() => {
            setValue("visitorType", "INSTITUCION_EDUCATIVA", { shouldValidate: true });
            setOpen(null);
          }}
        />
      </SidePanel>

      {/* Panel: Circuito (estilo igual al RegisterForm) */}
      <SidePanel open={open === "CIRCUIT"} title="Elegí un circuito" onClose={() => setOpen(null)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CIRCUITS.map(({ key, titulo, img }, i) => {
            const letter = String.fromCharCode(65 + i); // A, B, C, D
            const checked = key === circuitId;
            return (
              <label key={key} className={`${radioCard} flex-col items-center text-center gap-3`}>
                {/* input radio oculto pero accesible */}
                <input
                  type="radio"
                  value={key}
                  checked={checked}
                  onChange={() => {
                    setValue("circuitId", key, { shouldValidate: true });
                    setOpen(null);
                  }}
                  className={radioHidden}
                />

                {/* Contenido en 2 filas: imagen / texto */}
                <div
                  className="w-full grid grid-rows-[1fr_auto] gap-2
                             peer-checked:[&_.badge]:bg-white peer-checked:[&_.badge]:text-gray-900 peer-checked:[&_.badge]:border-gray-900"
                >
                  {/* IMAGEN */}
                  <div className="h-44 sm:h-56 md:h-64 flex items-center justify-center overflow-hidden rounded-lg p-1 md:p-1.5">
                    <Image
                      src={img}
                      alt={`Imagen del ${titulo}`}
                      className="block max-w-full max-h-full object-contain mx-auto"
                      width={160}
                      height={160}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* LETRA + NOMBRE */}
                  <div className="inline-flex items-center justify-center gap-2">
                    <span className={`${radioBadge} badge`} aria-hidden="true">
                      {letter}
                    </span>
                    <span className="font-medium">{titulo}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </SidePanel>

      {/* Panel: Fecha */}
      <SidePanel open={open === "DATE"} title="Elegí una fecha" onClose={() => setOpen(null)}>
        <div className="space-y-3">
          <CalendarPicker
            selectedISO={typeof date === "string" ? date : undefined}
            onSelectISO={(iso) => {
              setValue("date", iso, { shouldValidate: true });
              setOpen(null);
            }}
          />
          <p className="text-sm text-white/70">{date ? `Fecha seleccionada: ${date}` : "Elegí un día del calendario"}</p>
        </div>
      </SidePanel>

      {/* Panel: Visitantes */}
      <SidePanel open={open === "VISITORS"} title="Visitantes" onClose={() => setOpen(null)}>
        <CounterRow
          title="Adultos"
          subtitle="18 años o más"
          value={visitors.adults}
          onChange={(n) => setValue("visitors", { ...visitors, adults: Math.max(0, n) }, { shouldValidate: true })}
        />
        <CounterRow
          title="Niños"
          subtitle="2 a 17 años"
          value={visitors.kids}
          onChange={(n) => setValue("visitors", { ...visitors, kids: Math.max(0, n) }, { shouldValidate: true })}
        />
        <CounterRow
          title="Bebés"
          subtitle="menores de 2 años"
          value={visitors.babies}
          onChange={(n) => setValue("visitors", { ...visitors, babies: Math.max(0, n) }, { shouldValidate: true })}
        />
        <div className="flex justify-end pt-3">
          <button className="rounded-md bg-white text-gray-900 px-4 py-2" onClick={() => setOpen(null)} type="button">
            Confirmar
          </button>
        </div>
      </SidePanel>

      {/* CTA */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex items-center justify-between">
        <div className="text-sm text-red-300 space-x-3">
          {errors.visitorType && <span>Elegí el tipo de visitante</span>}
          {errors.circuitId && <span>Elegí un circuito</span>}
          {errors.date && <span>Elegí una fecha</span>}
        </div>
        <button className="rounded-md bg-white px-5 py-2 text-gray-900 disabled:opacity-40" disabled={!isValid}>
          Continuar
        </button>
      </form>
    </div>
  );
}

/* ---- Subcomponentes estilizados para Dark ---- */
function Step({
  label,
  value,
  onClick,
  disabled,
  error,
}: {
  label: string;
  value?: string;
  onClick: () => void;
  disabled?: boolean;
  error?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex w-full items-center justify-between rounded-lg border p-3 text-left transition",
        "bg-white/5 border-white/20 hover:bg-white/10",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        error ? "border-red-400" : "",
      ].join(" ")}
    >
      <span className="truncate">{value || label}</span>
      <span className="ml-3">▾</span>
    </button>
  );
}

function SidePanel({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 md:items-center md:justify-center" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md md:max-w-full bg-gray-900 text-white shadow-xl border-l border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <button className="rounded p-1 hover:bg-white/10" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">{children}</div>
      </div>
    </div>
  );
}

function OptionButton({
  title,
  subtitle,
  onSelect,
  active,
}: {
  title: string;
  subtitle: string;
  onSelect: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={["w-full text-left rounded-lg p-4 border transition", "bg-white/5 hover:bg-white/10 border-white/20", active ? "ring-2 ring-white" : ""].join(" ")}
    >
      <div className="font-medium">{title}</div>
      <div className="text-sm text-white/70">{subtitle}</div>
    </button>
  );
}

function CounterRow({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/20 p-3 bg-white/5">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-white/70">{subtitle}</div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(value - 1)} className="rounded border border-white/30 px-2 py-1 hover:bg-white/10">
          -
        </button>
        <span className="w-6 text-center">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="rounded border border-white/30 px-2 py-1 hover:bg-white/10">
          +
        </button>
      </div>
    </div>
  );
}

function formatVisitors(v?: { adults: number; kids: number; babies: number }) {
  if (!v) return undefined;
  const total = (v.adults || 0) + (v.kids || 0) + (v.babies || 0);
  return total ? `${total} visitante${total !== 1 ? "s" : ""}` : undefined;
}