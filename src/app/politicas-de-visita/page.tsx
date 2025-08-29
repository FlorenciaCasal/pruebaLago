"use client";
import { useRouter } from "next/navigation";

// const UPDATED_AT = "Agosto 2025";

export default function PoliticasDeVisitaPage() {
    const router = useRouter();
    return (
        <main className="min-h-screen bg-gray-900 text-white">
            <div className="mx-auto max-w-3xl px-6 py-12">
                <header className="mb-10">
                    <h1 className="text-3xl font-semibold">Políticas de visita</h1>
                    <p className="mt-2 text-white/70">
                        Lago Escondido se encuentra dentro de un entorno de <strong>reserva natural</strong>.
                        Nuestro principal objetivo es que tu experiencia sea memorable, <em>sin comprometer</em>
                        la salud del ambiente, la fauna y la flora.
                    </p>
                    {/* <p className="mt-2 text-sm text-white/60">Última actualización: {UPDATED_AT}</p> */}
                </header>

                {/* Índice */}
                <nav aria-label="Índice" className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">Índice</h2>
                    <ul className="list-disc pl-6 space-y-1 text-white/85">
                        <li><a className="underline hover:opacity-90" href="#proposito">Propósito y alcance</a></li>
                        <li><a className="underline hover:opacity-90" href="#ingreso">Ingreso y horario</a></li>
                        <li><a className="underline hover:opacity-90" href="#comportamiento">Comportamiento responsable</a></li>
                        <li><a className="underline hover:opacity-90" href="#fauna-flora">Fauna y flora</a></li>
                        <li><a className="underline hover:opacity-90" href="#residuos">Residuos y huella</a></li>
                        <li><a className="underline hover:opacity-90" href="#senderos">Senderos y señalización</a></li>
                        <li><a className="underline hover:opacity-90" href="#seguridad">Seguridad y clima</a></li>
                        <li><a className="underline hover:opacity-90" href="#menores-mascotas">Menores y mascotas</a></li>
                        <li><a className="underline hover:opacity-90" href="#accesibilidad">Accesibilidad</a></li>
                        <li><a className="underline hover:opacity-90" href="#actividades">Actividades especiales</a></li>
                        <li><a className="underline hover:opacity-90" href="#fotografia">Fotografía, drones y registros</a></li>
                        <li><a className="underline hover:opacity-90" href="#datos">Protección de datos personales</a></li>
                        <li><a className="underline hover:opacity-90" href="#admision">Derecho de admisión</a></li>
                        <li><a className="underline hover:opacity-90" href="#contacto">Contacto</a></li>
                    </ul>
                </nav>

                <section id="proposito" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">1. Propósito y alcance</h2>
                    <p className="text-white/85">
                        Estas políticas aplican a todas las personas que ingresan a Lago Escondido.
                        Buscan preservar los ecosistemas nativos, minimizar impactos y garantizar una
                        experiencia segura y respetuosa para visitantes y naturaleza.
                    </p>
                </section>

                <section id="ingreso" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">2. Ingreso y horario</h2>
                    <ul className="list-disc pl-6 space-y-2 text-white/85">
                        <li>El ingreso es por <strong>reserva confirmada</strong> y con <strong>documento</strong>.</li>
                        <li>Respetá el <strong>horario asignado</strong> y llegá <strong>15 minutos antes</strong>.</li>
                        <li>Podremos <strong>reprogramar o cancelar</strong> por razones climáticas o de seguridad.</li>
                    </ul>
                </section>

                <section id="comportamiento" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">3. Comportamiento responsable</h2>
                    <ul className="list-disc pl-6 space-y-2 text-white/85">
                        <li>Mantené un <strong>perfil sonoro bajo</strong>. Evitá música amplificada.</li>
                        <li>Está <strong>prohibido fumar</strong> fuera de áreas designadas (riesgo de incendio).</li>
                        <li>No consumas alcohol ni sustancias que comprometan tu seguridad o la de terceros.</li>
                    </ul>
                </section>

                <section id="fauna-flora" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">4. Fauna y flora</h2>
                    <ul className="list-disc pl-6 space-y-2 text-white/85">
                        <li><strong>No alimentes</strong> a los animales y mantené <strong>distancia prudente</strong>.</li>
                        <li>Evitá acercarte a nidos, madrigueras o sitios de cría.</li>
                        <li>Está <strong>prohibido extraer</strong> plantas, semillas, rocas o cualquier elemento natural.</li>
                    </ul>
                </section>

                <section id="residuos" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">5. Residuos y huella</h2>
                    <ul className="list-disc pl-6 space-y-2 text-white/85">
                        <li>Practicá la política de <strong>“lo que entra, sale”</strong>. No dejes residuos.</li>
                        <li>Traé <strong>botella recargable</strong> y evitá plásticos de un solo uso.</li>
                        <li>Usá los puntos de separación si están disponibles.</li>
                    </ul>
                </section>

                <section id="senderos" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">6. Senderos y señalización</h2>
                    <ul className="list-disc pl-6 space-y-2 text-white/85">
                        <li>Circulá <strong>solo</strong> por senderos habilitados y señalizados.</li>
                        <li>No abras atajos ni modifiques señales o cercos.</li>
                        <li>Seguí siempre las indicaciones del personal.</li>
                    </ul>
                </section>

                <section id="seguridad" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">7. Seguridad y clima</h2>
                    <ul className="list-disc pl-6 space-y-2 text-white/85">
                        <li>Llevá <strong>ropa cómoda</strong>, calzado adecuado, <strong>gorro</strong> y <strong>protector solar</strong>.</li>
                        <li>Informanos <strong>alergias</strong> o condiciones de salud relevantes.</li>
                        <li>La actividad puede suspenderse por <strong>clima adverso</strong> o riesgos ambientales.</li>
                    </ul>
                </section>

                <section id="menores-mascotas" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">8. Menores y mascotas</h2>
                    <ul className="list-disc pl-6 space-y-2 text-white/85">
                        <li>Los <strong>menores</strong> deben estar acompañados por un adulto responsable.</li>
                        <li><strong>No se permiten mascotas</strong> para proteger fauna nativa y visitantes.</li>
                    </ul>
                </section>

                <section id="accesibilidad" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">9. Accesibilidad</h2>
                    <p className="text-white/85">
                        Si alguna de las personas de tu grupo tiene <strong>movilidad reducida</strong> o requiere
                        asistencia, indicalo al momento de la reserva. Haremos lo posible por adaptar la experiencia.
                    </p>
                </section>

                <section id="actividades" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">10. Actividades especiales</h2>
                    <ul className="list-disc pl-6 space-y-2 text-white/85">
                        <li>Actividades como <strong>pesca, fogones, acampe o navegación</strong> requieren autorización previa expresa.</li>
                        <li>Podrían no estar disponibles por razones de <strong>conservación</strong> o <strong>seguridad</strong>.</li>
                        <li>No ofrecemos venta de alimentos en sitio.</li>
                    </ul>
                </section>

                <section id="fotografia" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">11. Fotografía, drones y registros</h2>
                    <ul className="list-disc pl-6 space-y-2 text-white/85">
                        <li>La fotografía personal está permitida si no interfiere con otros visitantes o la fauna.</li>
                        <li>El uso de <strong>drones</strong> está <strong>prohibido</strong> salvo permiso escrito.</li>
                        <li>El material captado con fines comerciales necesita autorización previa.</li>
                    </ul>
                </section>

                <section id="datos" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">12. Protección de datos personales</h2>
                    <p className="text-white/85">
                        Los datos que nos compartas se usarán <strong>exclusivamente</strong> para gestionar tu visita
                        y comunicaciones relacionadas (por ejemplo, recordatorios). Conservamos la información por el
                        tiempo necesario para estos fines y aplicamos medidas razonables de seguridad. Podés ejercer
                        tus derechos de acceso, rectificación y supresión enviando un correo a{" "}
                        <a href="mailto:contacto@lagoescondido.example" className="underline hover:opacity-90">
                            contacto@lagoescondido.example
                        </a>.
                    </p>
                </section>

                <section id="admision" className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3">13. Derecho de admisión</h2>
                    <p className="text-white/85">
                        Lago Escondido se reserva el <strong>derecho de admisión y permanencia</strong>
                        para garantizar la seguridad, el respeto entre visitantes y la protección del ambiente.
                    </p>
                </section>

                <section id="contacto" className="mb-12">
                    <h2 className="text-2xl font-semibold mb-3">14. Contacto</h2>
                    <p className="text-white/85">
                        ¿Tenés dudas o necesitás asistencia? Escribinos a{" "}
                        <a href="mailto:contacto@lagoescondido.example" className="underline hover:opacity-90">
                            contacto@lagoescondido.example
                        </a>.
                    </p>
                </section>

                <footer className="border-t border-white/10 pt-6 flex items-center justify-between text-sm text-white/60">
                    {/* botón volver */}
                    <button
                        onClick={() => router.back()}
                        className="underline hover:opacity-90 cursor-pointer"
                    >
                        Volver
                    </button>

                    <span>© {new Date().getFullYear()} Lago Escondido</span>
                </footer>
            </div>
        </main>
    );
}
