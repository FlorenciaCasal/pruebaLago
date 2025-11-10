"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
   const HIDE_ON: string[] = ["/politicas-de-visita"];
    const hide = HIDE_ON.includes(pathname);
  
    if (hide) return null; // ⟵ no se renderiza nada

  return (
    <nav style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#1a1a1a",
      color: "white"
    }}>
      <div className="flex text-sm text-#F5F5F5/60">
        {/* <span className="text-base md:text-lg">Reserva Natural Lago Escondido</span> */}
        <span>© {new Date().getFullYear()} Reserva Natural Lago Escondido</span>
      </div>
    </nav>
  );
}