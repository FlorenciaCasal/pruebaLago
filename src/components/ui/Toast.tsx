"use client";
import React from "react";

type ToastItem = { id: number; msg: string; ttl: number };

const ToastCtx = React.createContext<(msg: string, ttlMs?: number) => void>(() => { });

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastItem[]>([]);

    const push = React.useCallback((msg: string, ttlMs = 3200) => {
        const id = Math.random();
        //     setToasts((t) => [...t, { id, msg, ttl: Date.now() + ttlMs }]);
        //     setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), ttlMs);
        // }, []);
        setToasts((current) => {
            // ❗ evita duplicados
            const alreadyVisible = current.some(t => t.msg === msg);
            if (alreadyVisible) return current;

            return [...current, { id, msg, ttl: Date.now() + ttlMs }];
        });

        setTimeout(() => {
            setToasts((t) => t.filter(x => x.id !== id));
        }, ttlMs);
    }, []);

    return (
        <ToastCtx.Provider value={push}>
            {children}
            {/* container */}
            {/* <div className="fixed inset-x-0 top-3 z-[9999] flex justify-center pointer-events-none"> */}
            {/* <div className="fixed inset-x-0 top-1/3 -translate-y-1/2 lg:top-7 z-[9999] flex justify-center pointer-events-none"> */}
            <div
                className="fixed inset-x-0 top-20 bottom-auto translate-y-0 z-[9999] flex justify-center pointer-events-none" >
                <div className="w-full max-w-md px-3 space-y-2">
                    {toasts.map(t => (
                        <div key={t.id}
                            className="pointer-events-auto rounded-lg border border-white/10 bg-white/10 backdrop-blur px-4 py-2 text-black shadow-lg animate-in fade-in slide-in-from-top-2">
                            {t.msg}
                        </div>
                    ))}
                </div>
            </div>
        </ToastCtx.Provider>
    );
}

export function useToast() {
    return React.useContext(ToastCtx);
}
