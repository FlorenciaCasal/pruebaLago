"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * Redirige a /login si el usuario no está autenticado
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Mostrar loading mientras se verifica
  if (isChecking) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400">Verificando autenticación...</div>
      </div>
    );
  }

  return <>{children}</>;
}


