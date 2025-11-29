"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileScreenButton } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function Topbar() {
    return (
        <div className="hidden sm:block w-full bg-[#1D1D1E] text-white text-sm py-3 px-12">
            <div className="mx-auto max-w-7xl flex justify-between items-center">

                {/* IZQUIERDA: contacto */}
                <div className="flex items-center gap-4 opacity-80">

                    <span><FontAwesomeIcon icon={faMobileScreenButton} /> +54 2944 491027</span>
                    <span><FontAwesomeIcon icon={faEnvelope} /> info@lago-escondido.com</span>
                </div>

                {/* DERECHA: redes (si querés agregar) */}
                <div className="hidden sm:flex items-center gap-4 opacity-80">
                    <Link href="https://www.instagram.com/lagoescondido.ok" className="hover:text-white" target="_blank"><FontAwesomeIcon
                        icon={faInstagram}
                        size="lg"
                        className="hover:opacity-80 transition"
                    /></Link>
                </div>
            </div>
        </div>
    );
}
