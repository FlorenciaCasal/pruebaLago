import { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { inputBase } from "@/styles/ui";
import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { ReservationFormData } from "@/types/reservation";

export default function ListadoStep({
  fields, register, watch, append, remove, setValue,
  totalEsperado, tipo, uxError, onListChanged, reservaAsiste,
}: {
  fields: FieldArrayWithId<ReservationFormData, "personas", "id">[];
  register: UseFormRegister<ReservationFormData>;
  watch: UseFormWatch<ReservationFormData>;
  append: UseFieldArrayAppend<ReservationFormData, "personas">;
  remove: UseFieldArrayRemove;
  setValue: UseFormSetValue<ReservationFormData>;
  totalEsperado: number;
  reservaAsiste: boolean;
  tipo: "PARTICULAR" | "INSTITUCION_EDUCATIVA" | null;
  uxError: string | null;
  onListChanged?: () => void;
}) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [backup, setBackup] = useState<{ nombre: string; apellido: string; dni: string } | null>(null);
  const canAddMore = fields.length < totalEsperado;


  const startEdit = (i: number) => {
    const nombre = String(watch(`personas.${i}.nombre`) ?? "");
    const apellido = String(watch(`personas.${i}.apellido`) ?? "");
    const dni = String(watch(`personas.${i}.dni`) ?? "");
    setBackup({ nombre, apellido, dni });
    setEditIndex(i);
  };

  const cancelEdit = () => {
    if (editIndex !== null && backup) {
      setValue(`personas.${editIndex}.nombre`, backup.nombre, { shouldDirty: true });
      setValue(`personas.${editIndex}.apellido`, backup.apellido, { shouldDirty: true });
      setValue(`personas.${editIndex}.dni`, backup.dni, { shouldDirty: true });
    }
    setEditIndex(null);
    setBackup(null);
  };

  const saveEdit = () => {
    setEditIndex(null);
    setBackup(null);
    onListChanged?.();
  };


  return (
    <div className="space-y-4">
      {/* {tipo === "PARTICULAR" && ( */}
      <p className="text-sm">
        {reservaAsiste ? (
          <> Cargá a todas las personas que asistirán, excepto al responsable.
            <span className="block text-xs text-gray-600">
              El mismo fue incluido automáticamente en el paso anterior.
            </span>
          </>
        ) : (
          "Cargá a todas las personas que asistirán."
        )}
      </p>
      {/* )} */}

      {/* mini form para agregar */}
      <div className="rounded-lg border border-gray-900 bg-white/5 p-4 space-y-3">
        <input
          {...register("tmpNombreApe")}
          placeholder="Nombre y apellido"
          className={inputBase}
          disabled={!canAddMore}
          maxLength={120}
        />
        <input
          {...register("tmpDni", {
            setValueAs: v => String(v ?? "").replace(/\D+/g, "").slice(0, 8),
          })}
          placeholder="DNI (8 dígitos)"
          className={inputBase}
          disabled={!canAddMore}
          inputMode="numeric"
          pattern="^[0-9]{8}$"
          maxLength={8}
        />
        <div className="flex justify-end">
          <button
            type="button"
            className={`rounded-md border border-gray-900 hover:bg-gray-100 bg-white text-gray-900 px-4 py-2 ${!canAddMore ? "opacity-50 cursor-not-allowed" : ""
              }`}
            onClick={() => {
              if (!canAddMore) return; // 👈 no permitir sobrepasar
              const na = (watch("tmpNombreApe") ?? "").toString().trim();
              const dni = (watch("tmpDni") ?? "").toString().replace(/\D+/g, "").slice(0, 8); // normalizo
              if (!na || !dni) return alert("Completá nombre/apellido y DNI.");
              const parts = na.split(/\s+/).filter(Boolean);
              if (parts.length < 2) return alert("Ingresá nombre y apellido.");
              const [nombre, ...rest] = parts;
              const apellido = rest.join(" ");
              if (!/^\d{8}$/.test(dni)) return alert("DNI inválido: deben ser 8 dígitos.");
              append({ nombre, apellido, dni });
              setValue("tmpNombreApe", "");
              setValue("tmpDni", "");
              onListChanged?.();
            }}
            disabled={!canAddMore}
          >
            Agregar
          </button>
        </div>
        {/* {!canAddMore && totalEsperado === 0 && tipo === "PARTICULAR" && (
          <p className="text-xs text-white/70 mt-2">
            No necesitás cargar acompañantes porque reservaste para 1 persona (vos mismo).
            Si querés agregar acompañantes, volvé al paso anterior y aumentá el número de Adultos/Niños/Bebés.
          </p>
        )} */}
        {!canAddMore && totalEsperado > 0 && (
          <p className="text-xs text-gray-900 mt-2">
            Ya cargaste el total esperado ({totalEsperado}).
            {/* Para agregar más,
            aumentá Adultos/Niños/Bebés en el paso anterior. */}
          </p>
        )}
      </div>

      {/* tabla */}
      <div className="rounded-lg border border-gray-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="text-center px-1 md:px-3 py-2">#</th>
              <th className="text-center px-1 md:px-3 py-2">Nombre y apellido</th>
              <th className="text-center px-1 md:px-3 py-2">DNI</th>
              <th className="text-center px-1 md:px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 && (
              <tr>
                <td className="px-3 py-3 text-gray-900 text-center" colSpan={4}>
                  {tipo === "INSTITUCION_EDUCATIVA" ? "Sin visitantes cargados." : "Sin visitantes cargados."}
                </td>
              </tr>
            )}

            {fields.map((f, i) => {
              const editing = editIndex === i;
              const nombre = String(watch(`personas.${i}.nombre`) ?? "");
              const apellido = String(watch(`personas.${i}.apellido`) ?? "");
              const dni = String(watch(`personas.${i}.dni`) ?? "");

              return (
                <tr key={f.id ?? i} className="border-t border-gray-900">
                  <td className="px-1 md:px-3 py-2 text-center">{i + 1}</td>

                  {/* Nombre y apellido */}
                  <td className="px-1 md:px-3 py-2 text-center">
                    {editing ? (
                      <div className="grid sm:grid-cols-2 gap-2">
                        <input
                          className={inputBase}
                          placeholder="Nombre"
                          value={nombre}
                          onChange={(e) =>
                            setValue(`personas.${i}.nombre`, e.target.value, { shouldDirty: true })
                          }
                        />
                        <input
                          className={inputBase}
                          placeholder="Apellido"
                          value={apellido}
                          onChange={(e) =>
                            setValue(`personas.${i}.apellido`, e.target.value, { shouldDirty: true })
                          }
                        />
                      </div>
                    ) : (
                      `${nombre} ${apellido}`.trim()
                    )}
                  </td>

                  {/* DNI */}
                  <td className="px-1 md:px-3 py-2 text-center">
                    {editing ? (
                      <input
                        className={inputBase}
                        placeholder="DNI (8 dígitos)"
                        value={dni}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/\D+/g, "").slice(0, 8);
                          setValue(`personas.${i}.dni`, cleaned, { shouldDirty: true });
                        }}
                        inputMode="numeric"
                        pattern="^[0-9]{8}$"
                        maxLength={8}
                      />
                    ) : (
                      dni
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-1 md:px-3 py-1 md:py-2">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                      {editing ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="rounded p-2 border border-gray-900 hover:bg-gray-400"
                            aria-label="Guardar"
                            title="Guardar"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded p-2 border border-gray-900 hover:bg-gray-400"
                            aria-label="Cancelar"
                            title="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(i)}
                            className="rounded p-2 border border-gray-900 hover:bg-gray-400"
                            aria-label="Editar"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("¿Quitar este registro?")) remove(i);
                            }}
                            className="rounded p-2 border border-gray-900 hover:bg-gray-400 text-red-500"
                            aria-label="Eliminar"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <p className="mt-2 rounded-md bg-white/5 border border-gray-900 px-3 py-2 text-sm text-gray-900">
        Total esperado: <b>{totalEsperado}</b> — Cargados: <b>{fields.length}</b>
      </p> */}

      {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
    </div>
  );
}

