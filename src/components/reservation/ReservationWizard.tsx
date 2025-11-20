"use client";
import React, { useState, useEffect } from "react";
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
import { getPublicBookingFlags, type BookingFlags } from "@/services/admin";
import { useToast } from "@/components/ui/Toast";



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
    trigger,
    formState: { errors, isValid },
  } = useForm<WizardStepData>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: { adultos: 0, ninos: 0, bebes: 0 },
  });

  const [open, setOpen] = useState<Panel>(null);
  const [flags, setFlags] = useState<BookingFlags | null>(null);
  const toast = useToast();
  const { resetField, /* ... */ } = useForm<WizardStepData>({ /* ... */ });

  // cargar flags del backend
  useEffect(() => {
    getPublicBookingFlags()
      .then(setFlags)
      .catch(() => setFlags({ individualEnabled: true, schoolEnabled: true })); // fallback permisivo
  }, []);

  const tipoVisitante = watch("tipoVisitante");
  // const circuito = watch("circuito");           // CircuitoKey | string
  const fechaISO = watch("fechaISO");
  const adultos = watch("adultos");
  const ninos = watch("ninos");
  const bebes = watch("bebes");
  const loadingFlags = flags === null;
  const schoolOff = flags ? !flags.schoolEnabled : true;
  const isSchool = tipoVisitante === "INSTITUCION_EDUCATIVA";
  const isSchoolSoldOut = isSchool && schoolOff;
  // válido si hay al menos 1 adulto (misma regla que Yup)
  const visitorsValid = adultos >= 1;

  // Bloqueo provisorio si aún no cargaron flags y el usuario marcó escuela
  useEffect(() => {
    if (!flags && tipoVisitante === "INSTITUCION_EDUCATIVA") {
      resetField("tipoVisitante");
      resetField("fechaISO");
      toast(" En este momento no tenemos disponibilidad para instituciones educativas.")
    }
  }, [flags, tipoVisitante, resetField, toast]);

  // Bloqueo definitivo si flags dicen que escuela está deshabilitada
  useEffect(() => {
    if (flags && schoolOff && isSchool) {
      resetField("tipoVisitante");
      resetField("fechaISO");
      // toast("Por ahora no se aceptan reservas para instituciones educativas.");
      toast(" En este momento no tenemos disponibilidad para instituciones educativas.")
    }
  }, [flags, schoolOff, isSchool, resetField, toast]);

  // const circuitoInfo = useMemo(
  //   () => CIRCUITS.find((c) => c.key === (circuito as CircuitoKey)),
  //   [circuito]
  // );

  // ⭐ Mapeo al payload legacy que tu page.tsx usa
  const onSubmit = (data: WizardStepData) => {
    // guard adicional por si el usuario forzó algo con el DOM
    if (data.tipoVisitante === "INSTITUCION_EDUCATIVA" && schoolOff) {
      toast("Por el momento no se aceptan reservas para instituciones educativas.");
      return;                       // ✅ aborta el submit sí o sí
    }
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
    // <div className="mx-auto max-w-3xl p-6 text-black">
    <div className="text-neutral-900">
      <h1 className="text-2xl text-center font-semibold text-neutral-900 mb-4">Reserva tu visita</h1>

      {/* Steps */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">  paso el cols a 3 porque saque circuito */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> */}
      <div className="grid grid-cols-1 gap-3">
        <Step
          label="Tipo de visitante"
          value={tipoVisitante ? (tipoVisitante === "PARTICULAR" ? "Particular" : "Institución educativa") : undefined}
          onClick={() => setOpen("TYPE")}
          error={!!errors.tipoVisitante}
          // className="rounded-xl border border-emerald-200/60 bg-white text-neutral-900 shadow-sm hover:border-emerald-400 hover:shadow"
          className="w-full rounded-xl border border-emerald-300 bg-transparent text-neutral-900 hover:border-emerald-500 hover:bg-emerald-50/40 transition"
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
          // className="rounded-xl border border-emerald-200/60 bg-white text-neutral-900 shadow-sm hover:border-emerald-400 hover:shadow disabled:opacity-60"
          className="w-full rounded-xl border border-emerald-300 bg-transparent text-neutral-900 hover:border-emerald-500 hover:bg-emerald-50/40 transition"
        />
        <Step
          label="Visitantes"
          value={formatVisitorsFromForm({ adultos, ninos, bebes })}
          onClick={() => setOpen("VISITORS")}
          disabled={!fechaISO}
          // className="rounded-xl border border-emerald-200/60 bg-white text-neutral-900 shadow-sm hover:border-emerald-400 hover:shadow disabled:opacity-60"
          className="w-full rounded-xl border border-emerald-300 bg-transparent text-neutral-900 hover:border-emerald-500 hover:bg-emerald-50/40 transition"
        />
      </div>

      {/* Panel: Tipo */}
      <SidePanel open={open === "TYPE"} title="Tipo de visitante" onClose={() => setOpen(null)}>
        <OptionButton
          title="Particular"
          subtitle="Individual, familia o amigos."
          imageSrc="/img/particular.jpg"
          onSelect={() => {
            setValue("tipoVisitante", "PARTICULAR", { shouldValidate: true });
            setOpen(null);
          }}
        />
        <OptionButton
          title="Institución educativa"
          subtitle={schoolOff ? "Temporalmente no disponible" : "Escuelas, universidades o grupos educativos."}
          imageSrc="/img/escuela.jpg"
          disabled={loadingFlags || schoolOff}
          onDisabledClick={() => toast("En este momento no tenemos disponibilidad para instituciones educativas.")}
          onSelect={() => {
            if (schoolOff) {              // 🚫 guard extra por si se intenta forzar
              // toast("Por ahora no se aceptan reservas para instituciones educativas.");
              toast(" En este momento no tenemos disponibilidad para instituciones educativas.")
              return;
            }
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
      <SidePanel open={open === "DATE"} title="Elegí una fecha" onClose={() => setOpen(null)} size="lg">
        <div className="space-y-3">
          <CalendarPicker
            selectedISO={typeof fechaISO === "string" ? fechaISO : undefined}
            onSelectISO={(iso) => {
              setValue("fechaISO", iso, { shouldValidate: true });
              setOpen(null);
            }}
          />
          {/* <p className="text-sm text-white/70"> */}
          <p className="text-sm text-neutral-600">
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

        {/* 👇 Mensaje visible en el panel */}
        <div className="mt-2 text-sm text-red-300 min-h-5">
          {errors.adultos?.message || (!visitorsValid && "Debe haber al menos 1 adulto")}
        </div>

        <div className="flex justify-end pt-3">
          <button type="button" className="rounded-md bg-white border border-emerald-600 w-full text-emerald-600 px-4 py-2 disabled:opacity-40"
            disabled={!visitorsValid} onClick={async () => {
              const ok = await trigger(["adultos", "ninos", "bebes"]); // sincroniza errors/isValid
              if (!ok) return;
              setOpen(null);
            }}
          >
            Confirmar
          </button>
        </div>
      </SidePanel>

      {/* CTA */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex items-center justify-between">
        <div className="text-sm text-red-300 space-x-3">

        </div>
        {/* <button className="rounded-md bg-white w-full px-5 py-2 text-gray-900 disabled:opacity-40" */}
        <button
          className="w-full rounded-lg bg-emerald-600 text-white px-5 py-3 font-medium hover:bg-emerald-700 disabled:opacity-40"
          disabled={!isValid || isSchoolSoldOut}>
          Continuar
        </button>
      </form>
    </div>
  );
}
