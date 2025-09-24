"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CalendarPicker from "@/components/CalendarPicker";
import { Step } from "./Step";
import { SidePanel } from "./SidePanel";
import { OptionButton } from "./OptionButton";
import { CounterRow } from "./CounterRow";
import { schema, type WizardStepData } from "./schema";
// import { CIRCUITS } from "./constants";
import { formatVisitorsFromForm } from "./utils";
// import type { CircuitoKey } from "../../types/reservation"


// 🚦 disponibilidad actual (cámbialo a false cuando vuelvan los cupos)
const SCHOOL_BOOKINGS_BLOCKED = true;

// ⭐ Payload legacy que tu page.tsx necesita
type LegacyOnCompletePayload = {
  visitorType: "PARTICULAR" | "INSTITUCION_EDUCATIVA";
  // circuitId: string;
  dateISO: string;
  visitors: { adults: number; kids: number; babies: number };
};

// type Panel = null | "TYPE" | "CIRCUIT" | "DATE" | "VISITORS";
type Panel = null | "TYPE" | "DATE" | "VISITORS";

export default function ReservationWizard({
  onComplete,
}: {
  onComplete?: (data: LegacyOnCompletePayload) => void;
}) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<WizardStepData>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: { adultos: 0, ninos: 0, bebes: 0 },
  });

  const [open, setOpen] = useState<Panel>(null);

  const tipoVisitante = watch("tipoVisitante");
  // const circuito = watch("circuito");           // CircuitoKey | string
  const fechaISO = watch("fechaISO");
  const adultos = watch("adultos");
  const ninos = watch("ninos");
  const bebes = watch("bebes");
  const isSchool = tipoVisitante === "INSTITUCION_EDUCATIVA";
  const isSchoolSoldOut = isSchool && SCHOOL_BOOKINGS_BLOCKED;

  // const circuitoInfo = useMemo(
  //   () => CIRCUITS.find((c) => c.key === (circuito as CircuitoKey)),
  //   [circuito]
  // );

  // ⭐ Mapeo al payload legacy que tu page.tsx usa
  const onSubmit = (data: WizardStepData) => {
    onComplete?.({
      visitorType: data.tipoVisitante,
      // circuitId: String(data.circuito),
      dateISO: data.fechaISO,
      visitors: {
        adults: data.adultos,
        kids: data.ninos,
        babies: data.bebes,
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Reserva tu visita</h1>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Step
          label="Tipo de visitante"
          value={tipoVisitante ? (tipoVisitante === "PARTICULAR" ? "Particular" : "Institución educativa") : undefined}
          onClick={() => setOpen("TYPE")}
          error={!!errors.tipoVisitante}
        />
        {/* <Step
          label="Circuito"
          value={circuitoInfo?.titulo}
          onClick={() => setOpen("CIRCUIT")}
          disabled={!tipoVisitante}
          error={!!errors.circuito}
        /> */}
        <Step
          label="Fecha"
          value={fechaISO}
          onClick={() => setOpen("DATE")}
          // disabled={!circuito}
          disabled={!tipoVisitante || isSchoolSoldOut}
          error={!!errors.fechaISO}
        />
        <Step
          label="Visitantes"
          value={formatVisitorsFromForm({ adultos, ninos, bebes })}
          onClick={() => setOpen("VISITORS")}
          disabled={!fechaISO}
        />
      </div>
      {isSchoolSoldOut && (
        <div
          className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3"
          role="status"
          aria-live="polite"
        >
          <strong>Reservas escolares agotadas.</strong><br />
          Lo sentimos, nos quedamos sin disponibilidad.
        </div>
      )}


      {/* Panel: Tipo */}
      <SidePanel open={open === "TYPE"} title="Tipo de visitante" onClose={() => setOpen(null)}>
        <OptionButton
          title="Particular"
          subtitle="Reserva individual, familia o amigos."
          onSelect={() => {
            setValue("tipoVisitante", "PARTICULAR", { shouldValidate: true });
            setOpen(null);
          }}
        />
        <OptionButton
          title="Institución educativa"
          subtitle="Escuelas, universidades o grupos educativos."
          onSelect={() => {
            setValue("tipoVisitante", "INSTITUCION_EDUCATIVA", { shouldValidate: true });
            setOpen(null);
          }}
        />
      </SidePanel>

      {/* Panel: Circuito */}
      {/* <SidePanel open={open === "CIRCUIT"} title="Elegí un circuito" onClose={() => setOpen(null)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CIRCUITS.map(({ key, titulo, img }, i) => {
            const letter = String.fromCharCode(65 + i);
            const checked = key === circuito;
            return (
              <label key={key} className={`${radioCard} flex-col items-center text-center gap-3`}>
                <input
                  type="radio"
                  value={key}
                  checked={checked}
                  onChange={() => {
                    setValue("circuito", key, { shouldValidate: true });
                    setOpen(null);
                  }}
                  className={radioHidden}
                />
                <div
                  className="w-full grid grid-rows-[1fr_auto] gap-2
                             peer-checked:[&_.badge]:bg-white peer-checked:[&_.badge]:text-gray-900 peer-checked:[&_.badge]:border-gray-900"
                >
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
                  <div className="inline-flex items-center justify-center gap-2">
                    <span className={`${radioBadge} badge`} aria-hidden="true">{letter}</span>
                    <span className="font-medium">{titulo}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </SidePanel> */}

      {/* Panel: Fecha */}
      <SidePanel open={open === "DATE"} title="Elegí una fecha" onClose={() => setOpen(null)}>
        <div className="space-y-3">
          <CalendarPicker
            selectedISO={typeof fechaISO === "string" ? fechaISO : undefined}
            onSelectISO={(iso) => {
              setValue("fechaISO", iso, { shouldValidate: true });
              setOpen(null);
            }}
          />
          <p className="text-sm text-white/70">
            {fechaISO ? `Fecha seleccionada: ${fechaISO}` : "Elegí un día del calendario"}
          </p>
        </div>
      </SidePanel>

      {/* Panel: Visitantes */}
      <SidePanel open={open === "VISITORS"} title="Visitantes" onClose={() => setOpen(null)}>
        <CounterRow
          title="Adultos"
          subtitle="18 años o más"
          value={adultos}
          onChange={(n) => setValue("adultos", Math.max(0, n), { shouldValidate: true })}
        />
        <CounterRow
          title="Niños"
          subtitle="2 a 17 años"
          value={ninos}
          onChange={(n) => setValue("ninos", Math.max(0, n), { shouldValidate: true })}
        />
        <CounterRow
          title="Bebés"
          subtitle="menores de 2 años"
          value={bebes}
          onChange={(n) => setValue("bebes", Math.max(0, n), { shouldValidate: true })}
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
          {errors.tipoVisitante && <span>Elegí el tipo de visitante</span>}
          {/* {errors.circuito && <span>Elegí un circuito</span>} */}
          {errors.fechaISO && <span>Elegí una fecha</span>}
        </div>
        <button className="rounded-md bg-white px-5 py-2 text-gray-900 disabled:opacity-40" disabled={!isValid || isSchoolSoldOut}>
          Continuar
        </button>
      </form>
    </div>
  );
}
