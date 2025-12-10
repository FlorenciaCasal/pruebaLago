"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";


export default function Footer() {
  const pathname = usePathname();
  const HIDE_ON: string[] = ["/politicas-de-visita"];
  const hide = HIDE_ON.includes(pathname);

  if (hide) return null; // ⟵ no se renderiza nada

  return (
    // <footer className="w-full bg-[#D3B04D] text-white py-6 mt-10">
    <footer className="w-full bg-yellow text-white py-4 sm:py-6">
      {/* <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4"> */}
      {/* <div className="mx-auto max-w-6xl px-4 flex flex-col items-center justify-between gap-4"> */}
      <div
        className="
          mx-auto max-w-6xl px-4
          flex flex-col sm:flex-row
          items-center sm:items-center
          justify-between
          gap-4
          w-full
        "
      >
        {/* COPYRIGHT */}
        <span className="text-sm opacity-90">
          © {new Date().getFullYear()} Reserva Natural Lago Escondido
        </span>

        {/* ENLACES (opcionales) */}
        {/* <div className="flex items-center gap-6 text-sm opacity-90"> */}

        {/* <Link href="/politicas-de-visita" className="hover:opacity-100">
            Políticas de visita
          </Link> */}

        <div className="flex items-center gap-6">
          <Link
            href="https://www.facebook.com/lagoescondido.ok"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faSquareFacebook}
              size="lg"
              className="hover:opacity-80 transition"
            />

          </Link>
          <Link href="https://www.instagram.com/lagoescondido.ok" target="_blank">
            <FontAwesomeIcon
              icon={faInstagram}
              size="lg"
              className="hover:opacity-80 transition"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
