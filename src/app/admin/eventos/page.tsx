"use client";
import React from "react";
import { createEventReservation, type CreateEventInput, localInputToUtcZ, utcZToLocalInput } from "../../../services/admin";

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    const m = (err as { message?: string } | null)?.message;
    return m ?? "No se pudo crear el evento";
}


export default function AgregarEventoPage() {
    const [form, setForm] = React.useState<CreateEventInput>({
        titulo: "",
        fechaISO: "",
        circuito: "",
        cupo: undefined,
        notas: "",
    });
    const [submitting, setSubmitting] = React.useState(false);
    const [resultId, setResultId] = React.useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setResultId(null);
        try {
            if (!form.fechaISO) throw new Error("Seleccioná fecha y hora");
            const res = await createEventReservation(form);
            setResultId(res.id);
            setForm({ titulo: "", fechaISO: "", circuito: "", cupo: undefined, notas: "" });
        } catch (err: unknown) {
            alert(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Agregar reserva de tipo evento</h2>

            <form onSubmit={onSubmit} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm text-neutral-300 mb-1">Título del evento</label>
                    <input
                        value={form.titulo}
                        onChange={e => setForm(v => ({ ...v, titulo: e.target.value }))}
                        className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-neutral-300 mb-1">Fecha y hora</label>
                        <input
                            type="datetime-local"
                            // value={form.fechaISO ? new Date(form.fechaISO).toISOString().slice(0, 16) : ""}
                            value={utcZToLocalInput(form.fechaISO)}                                        // mostrar en local
                            // onChange={e => setForm(v => ({ ...v, fechaISO: new Date(e.target.value).toISOString() }))}
                            onChange={e =>
                                setForm(v => ({ ...v, fechaISO: localInputToUtcZ(e.target.value) }))        // guardar en UTC Z
                            }
                            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2"
                            required
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm text-neutral-300 mb-1">Circuito (opcional)</label>
                        <input
                            value={form.circuito ?? ""}
                            onChange={e => setForm(v => ({ ...v, circuito: e.target.value }))}
                            placeholder="A / B / C / D ..."
                            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2"
                        />
                    </div> */}

                    <div>
                        <label className="block text-sm text-neutral-300 mb-1">Cupo (opcional)</label>
                        <input
                            type="number"
                            value={form.cupo ?? ""}
                            onChange={e => setForm(v => ({ ...v, cupo: e.target.value ? Number(e.target.value) : undefined }))}
                            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2"
                            min={1}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-neutral-300 mb-1">Notas (opcional)</label>
                    <textarea
                        value={form.notas ?? ""}
                        onChange={e => setForm(v => ({ ...v, notas: e.target.value }))}
                        rows={4}
                        className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-blue-600/90 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-60"
                    >
                        {submitting ? "Guardando..." : "Guardar evento"}
                    </button>
                    {resultId && <span className="text-green-400 text-sm">Creado ✓ ID: {resultId}</span>}
                </div>
            </form>
        </div>
    );
}