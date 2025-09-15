"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  text: string;
  onClose?: () => void;
  onPrimary?: () => void;
  primaryLabel?: string;
  noButtons?: boolean;
};

export default function SuccessModal({
  open,
  title,
  text,
  onClose,
  onPrimary,
  primaryLabel = "Entendido",
  noButtons,
}: Props) {
  // bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          {/* Fondo negro sólido */}
          <div className="absolute inset-0 bg-black/90" />

          {/* Caja */}
          <motion.div
            className="relative mx-4 w-full max-w-md rounded-2xl bg-gray-900 text-white border border-white/10 p-6 shadow-2xl"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ Tilde “linda” con borde y fondo translúcido */}
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-600/20 border border-green-500 shadow-inner">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-green-400"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M9 16.2 4.8 12l-1.4 1.4L9 19l12-12-1.4-1.4z"
                />
              </svg>
            </div>

            <h3 className="text-center text-2xl font-bold leading-tight">
              {title}
            </h3>
            <p className="mt-3 text-center text-white/80">{text}</p>

            {!noButtons && (
              <div className="mt-6 flex justify-center gap-3">
                {onClose && (
                  <button
                    type="button"
                    className="rounded-lg border border-white/30 px-4 py-2 hover:bg-white/10"
                    onClick={onClose}
                  >
                    Cerrar
                  </button>
                )}
                <button
                  type="button"
                  className="rounded-lg bg-white text-gray-900 px-4 py-2 hover:opacity-90"
                  onClick={onPrimary ?? onClose}
                >
                  {primaryLabel}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
