"use client";
import CloseHint from "@/components/CloseHint";

export default function PoliticasDeVisitaPage() {

    // Fondo muy claro: #FAFAFA  background
    // Texto principal (gris oscuro): #333333  foreground
    // Encabezados y títulos (verde oscuro): #00665A   heading
    // Enlaces e índice (verde medio): #009577    link
    // Detalles importantes (tono tierra suave): #7A6E5A   accent-earth

    return (
        <main className="min-h-screen bg-background text-foreground">
            <CloseHint />

            <div className="mx-auto max-w-3xl px-6 py-12">
                <header className="mb-10">
                    <h1 className="text-3xl text-heading font-semibold">Políticas de visita</h1>
                    <p className="mt-2 text-[#333] text-justify">
                        Lago Escondido se encuentra dentro de un entorno de <strong className="text-accent">reserva natural</strong>.
                        Nuestro principal objetivo es que tu experiencia sea memorable, <em>sin comprometer </em>
                        la salud del ambiente, la fauna y la flora.
                    </p>
                    {/* <p className="mt-2 text-sm text-#F5F5F5/60">Última actualización: {UPDATED_AT}</p> */}
                </header>

                {/* Índice */}
                <nav aria-label="Índice" className="mb-8">
                    <h2 className="text-xl text-heading font-semibold mb-3">Índice</h2>
                    <ul className="list-disc pl-6 text-link space-y-1 text-#F5F5F5">
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
                    <h2 className="text-2xl text-heading font-semibold mb-3">1. Propósito y alcance</h2>
                    <p className="text-justify">
                        Estas políticas aplican a todas las personas que ingresan a Lago Escondido.
                        Buscan preservar los ecosistemas nativos, minimizar impactos y garantizar una
                        experiencia segura y respetuosa para visitantes y naturaleza.
                    </p>
                </section>

                <section id="ingreso" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">2. Ingreso y horario</h2>
                    <ul className="list-disc pl-6 space-y-2 text-justify">
                        <li>El ingreso es por <strong className="text-accent">reserva confirmada</strong> y con <strong className="text-accent">documento</strong>.</li>
                        <li>Respetá el <strong className="text-accent">horario asignado</strong> y llegá <strong className="text-accent">15 minutos antes</strong>.</li>
                        <li>Podremos <strong className="text-accent">reprogramar o cancelar</strong> por razones climáticas o de seguridad.</li>
                    </ul>
                </section>

                <section id="comportamiento" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">3. Comportamiento responsable</h2>
                    <ul className="list-disc pl-6 space-y-2 text-justify">
                        <li>Mantené un <strong className="text-accent">perfil sonoro bajo</strong>. Evitá música amplificada.</li>
                        <li>Está <strong className="text-accent">prohibido fumar</strong> fuera de áreas designadas (riesgo de incendio).</li>
                        <li>No consumas alcohol ni sustancias que comprometan tu seguridad o la de terceros.</li>
                    </ul>
                </section>

                <section id="fauna-flora" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">4. Fauna y flora</h2>
                    <ul className="list-disc pl-6 space-y-2 text-justify">
                        <li><strong className="text-accent">No alimentes</strong> a los animales y mantené <strong className="text-accent">distancia prudente</strong>.</li>
                        <li>Evitá acercarte a nidos, madrigueras o sitios de cría.</li>
                        <li>Está <strong className="text-accent">prohibido extraer</strong> plantas, semillas, rocas o cualquier elemento natural.</li>
                    </ul>
                </section>

                <section id="residuos" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">5. Residuos y huella</h2>
                    <ul className="list-disc pl-6 space-y-2 text-justify">
                        <li>Practicá la política de <strong className="text-accent">“lo que entra, sale”</strong>. No dejes residuos.</li>
                        <li>Traé <strong className="text-accent">botella recargable</strong> y evitá plásticos de un solo uso.</li>
                        <li>Usá los puntos de separación si están disponibles.</li>
                    </ul>
                </section>

                <section id="senderos" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">6. Senderos y señalización</h2>
                    <ul className="list-disc pl-6 space-y-2 text-justify">
                        <li>Circulá <strong className="text-accent">solo</strong> por senderos habilitados y señalizados.</li>
                        <li>No abras atajos ni modifiques señales o cercos.</li>
                        <li>Seguí siempre las indicaciones del personal.</li>
                    </ul>
                </section>

                <section id="seguridad" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">7. Seguridad y clima</h2>
                    <ul className="list-disc pl-6 space-y-2 text-justify">
                        <li>Llevá <strong className="text-accent">ropa cómoda</strong>, calzado adecuado, <strong className="text-accent">gorro</strong> y <strong className="text-accent">protector solar</strong>.</li>
                        <li>Informanos <strong className="text-accent">alergias</strong> o condiciones de salud relevantes.</li>
                        <li>La actividad puede suspenderse por <strong className="text-accent">clima adverso</strong> o riesgos ambientales.</li>
                    </ul>
                </section>

                <section id="menores-mascotas" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">8. Menores y mascotas</h2>
                    <ul className="list-disc pl-6 space-y-2 text-justify">
                        <li>Los <strong className="text-accent">menores</strong> deben estar acompañados por un adulto responsable.</li>
                        <li><strong className="text-accent">No se permiten mascotas</strong> para proteger fauna nativa y visitantes.</li>
                    </ul>
                </section>

                <section id="accesibilidad" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">9. Accesibilidad</h2>
                    <p className="text-justify">
                        Si alguna de las personas de tu grupo tiene <strong className="text-accent">movilidad reducida</strong> o requiere
                        asistencia, indicalo al momento de la reserva. Haremos lo posible por adaptar la experiencia.
                    </p>
                </section>

                <section id="actividades" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">10. Actividades especiales</h2>
                    <ul className="list-disc pl-6 space-y-2 text-justify">
                        <li>Actividades como <strong className="text-accent">pesca, fogones, acampe o navegación</strong> requieren autorización previa expresa.</li>
                        <li>Podrían no estar disponibles por razones de <strong className="text-accent">conservación</strong> o <strong className="text-accent">seguridad</strong>.</li>
                        <li>No ofrecemos venta de alimentos en sitio.</li>
                    </ul>
                </section>

                <section id="fotografia" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">11. Fotografía, drones y registros</h2>
                    <ul className="list-disc pl-6 space-y-2 text-justify">
                        <li>La fotografía personal está permitida si no interfiere con otros visitantes o la fauna.</li>
                        <li>El uso de <strong className="text-accent">drones</strong> está <strong className="text-accent">prohibido</strong> salvo permiso escrito.</li>
                        <li>El material captado con fines comerciales necesita autorización previa.</li>
                    </ul>
                </section>

                <section id="datos" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">12. Protección de datos personales</h2>
                    <p className="text-justify">
                        Los datos que nos compartas se usarán <strong className="text-accent">exclusivamente</strong> para gestionar tu visita
                        y comunicaciones relacionadas (por ejemplo, recordatorios). Conservamos la información por el
                        tiempo necesario para estos fines y aplicamos medidas razonables de seguridad. Podés ejercer
                        tus derechos de acceso, rectificación y supresión enviando un correo a{" "}
                        <a href="mailto:contacto@lagoescondido.example" className="underline hover:opacity-90">
                            contacto@lagoescondido.example
                        </a>.
                    </p>
                </section>

                <section id="admision" className="mb-10">
                    <h2 className="text-2xl text-heading font-semibold mb-3">13. Derecho de admisión</h2>
                    <p className="text-justify">
                        Lago Escondido se reserva el <strong className="text-accent">derecho de admisión y permanencia</strong>
                        para garantizar la seguridad, el respeto entre visitantes y la protección del ambiente.
                    </p>
                </section>

                <section id="contacto" className="mb-12">
                    <h2 className="text-2xl text-heading font-semibold mb-3">14. Contacto</h2>
                    <p className="text-justify">
                        ¿Tenés dudas o necesitás asistencia? Escribinos a{" "}
                        <a href="mailto:contacto@lagoescondido.example" className="underline hover:opacity-90">
                            contacto@lagoescondido.example
                        </a>.
                    </p>
                </section>
            </div>
        </main>
    );
}
