"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileScreenButton } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function Topbar() {
    return (
        <div className="hidden sm:block w-full bg-[#1D1D1E] text-[#ffffff99] text-[13px] py-3 px-10">
            <div className="mx-auto max-w-7xl flex justify-between items-center">

                {/* IZQUIERDA: contacto */}
                <div className="flex items-center gap-6 opacity-80">

                    <span><FontAwesomeIcon icon={faMobileScreenButton} size="lg" className="text-white" /> +54 2944 491027</span>
                    <span><FontAwesomeIcon icon={faEnvelope} size="lg" className="text-white" /> info@lago-escondido.com</span>
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
