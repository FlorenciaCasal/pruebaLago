"use client";
import { AnimatePresence, motion } from "framer-motion";

export default function PoliciesModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[1000] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="
              fixed inset-0 z-[1001]
              sm:inset-auto sm:top-1/2 sm:left-1/2
              sm:-translate-x-1/2 sm:-translate-y-1/2
              sm:max-w-3xl sm:w-full
              bg-white
              sm:rounded-2xl
              flex flex-col
              max-h-screen
            "
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-base font-semibold">
                Políticas de visita
              </h2>
              <button
                onClick={onClose}
                className="text-xl leading-none px-2"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 text-sm text-neutral-800">
              {children}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-button text-white py-2"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
