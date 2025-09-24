import PolicyCheckbox from "@/components/forms/PolicyCheckbox";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { ReservationFormData } from "@/types/reservation";

export default function SubmitStep({
    tipo, adultos, ninos, bebes, watch, aceptaReglas, setValue, policiesUrl, uxError, submitting,
}: {
    tipo: "PARTICULAR" | "INSTITUCION_EDUCATIVA" | null;
    adultos: number | undefined;
    ninos: number | undefined;
    bebes: number | undefined;
    watch: UseFormWatch<ReservationFormData>;
    aceptaReglas: boolean;
    setValue: UseFormSetValue<ReservationFormData>;
    policiesUrl: string;
    uxError: string | null;
    submitting: boolean;
}) {
    return (
        <div className="space-y-4">
            {uxError && (
                <div className="rounded-md bg-red-600/20 border border-red-600 px-3 py-2 text-sm">
                    {uxError}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="text-sm text-white/60 mb-2">Reserva</div>
                    <div className="space-y-1 text-sm">
                        <div><b>Tipo:</b> {tipo === "INSTITUCION_EDUCATIVA" ? "Institución educativa" : "Particular"}</div>
                        <div><b>Fecha:</b> {watch("fechaISO") || "—"}</div>
                        <div><b>Total:</b> {(adultos ?? 0) + (ninos ?? 0) + (bebes ?? 0)}</div>
                    </div>
                </div>

                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="text-sm text-white/60 mb-2">{tipo === "INSTITUCION_EDUCATIVA" ? "Institución" : "Contacto"}</div>
                    {tipo === "INSTITUCION_EDUCATIVA" ? (
                        <div className="space-y-1 text-sm">
                            <div><b>Institución:</b> {watch("institucion") || "—"}</div>
                            <div><b>Localidad:</b> {watch("institucionLocalidad") || "—"}</div>
                            <div><b>Email:</b> {watch("institucionEmail") || "—"}</div>
                            <div><b>Teléfono:</b> {watch("institucionTelefono") || "—"}</div>
                            <div className="pt-2">
                                <b>Responsable:</b> {`${watch("responsableNombre") || ""} ${watch("responsableApellido") || ""}`.trim() || "—"}
                                {" "} (DNI {watch("responsableDni") || "—"})
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1 text-sm">
                            <div><b>Nombre:</b> {`${watch("nombre") || ""} ${watch("apellido") || ""}`.trim() || "—"}</div>
                            <div><b>DNI:</b> {watch("dni") || "—"}</div>
                            <div><b>Email:</b> {watch("correo") || "—"}</div>
                            <div><b>Teléfono:</b> {watch("telefono") || "—"}</div>
                        </div>
                    )}
                </div>
            </div>

            <PolicyCheckbox
                href={policiesUrl}
                checked={aceptaReglas}
                onChange={(v) => setValue("aceptaReglas", v, { shouldDirty: true })}
            />

            <button
                type="submit"
                disabled={!aceptaReglas || submitting}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-white text-gray-900 transition
          ${(!aceptaReglas || submitting) ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}
            >
                {submitting ? "Enviando..." : "Enviar"}
            </button>
        </div>
    );
}
