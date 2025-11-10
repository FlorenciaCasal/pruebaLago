// components/CloseHint.tsx
"use client";

export default function CloseHint() {

    return (
        <>
            {/* Aviso superior (discreto) */}
            <div className="w-full bg-surface border-b border-border text-text">
                <div className="mx-auto text-justify max-w-3xl px-4 py-3 text-sm leading-5">
                    <span className="opacity-90">
                        Estás viendo las <strong className="text-heading">Políticas de visita</strong>.
                        Cuando termines, <span className="font-medium">podés cerrar esta pestaña</span> para volver al formulario.
                    </span>
                </div>
            </div>

            {/* Barra fija inferior en mobile (CTA grande) */}
            <div className="fixed inset-x-0 bottom-0 z-50 bg-surface/95 border-t border-border backdrop-blur supports-[backdrop-filter]:bg-surface/80">
                <div className="mx-auto max-w-3xl px-4 py-3">

                    <p className="text-center text-sm text-text/80">
                        Cerrá esta pestaña para volver al formulario desde la pestaña anterior.
                    </p>

                </div>
            </div>

            {/* Espacio para que el contenido no quede oculto detrás de la barra fija */}
            <div className="h-4 md:h-0" />
        </>
    );
}
