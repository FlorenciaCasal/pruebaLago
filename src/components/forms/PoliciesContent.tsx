export default function PoliciesContent() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <header className="mb-10">
                <h1 className="text-3xl text-black text-center ">Reserva Natural Lago Escondido. RNLE.</h1>
                <br />
                <h1 className="text-3xl text-secondary-dark font-semibold">Política de Visitas y Privacidad.</h1>
                <p className="mt-2 text-[#333] text-justify">
                    Nuestro principal objetivo es que quienes nos visitan tengan una experiencia enriquecedora, que compartamos el ambiente sano como valor a legar a las generaciones futuras y que disfrutemos de un trato respetuoso.
                </p>
                {/* <p className="mt-2 text-sm text-#F5F5F5/60">Última actualización: {UPDATED_AT}</p> */}
            </header>

            {/* Índice */}
            <nav aria-label="Índice" className="mb-8">
                <h2 className="text-xl text-primary-dark font-semibold mb-3">Índice</h2>
                <ul className="list-disc pl-6 text-secondary-dark space-y-1 text-#F5F5F5">
                    <li><a className="underline hover:opacity-90" href="#alcance">Alcance</a></li>
                    <li><a className="underline hover:opacity-90" href="#responsabilidad">Responsabilidad</a></li>
                    <li><a className="underline hover:opacity-90" href="#horarios">Horarios Ingreso/Egreso</a></li>
                    <li><a className="underline hover:opacity-90" href="#durante">Durante la visita</a></li>
                    <li><a className="underline hover:opacity-90" href="#menores">Menores</a></li>
                    <li><a className="underline hover:opacity-90" href="#mascotas">Mascotas</a></li>
                    <li><a className="underline hover:opacity-90" href="#accesibilidad">Accesibilidad</a></li>
                    <li><a className="underline hover:opacity-90" href="#actividades">Actividades especiales</a></li>
                    <li><a className="underline hover:opacity-90" href="#fotografia">Fotografía, drones y registros</a></li>
                    <li><a className="underline hover:opacity-90" href="#proteccion">Protección de datos personales</a></li>
                </ul>
            </nav>

            <section id="alcance" className="mb-10">
                <h2 className="text-2xl text-heading font-semibold mb-3">Alcance</h2>
                <p className="text-justify">
                    Esta Política de Visitas y Privacidad (Políticas), aplican a todas las personas que ingresan a la RNLE. La solicitud de visita supone la plena aceptación de estas, por lo que recomendamos su atenta lectura previo a la aceptación y envío de solicitud de visita.
                    <br />
                    RNLE puede cambiar sus Políticas en cualquier momento y sin previo aviso, su asistencia como visitante supone la notificación de todo cambio producido desde tu reservación hasta la efectiva visita.
                    <br />  RNLE se reserva el derecho de admisión y permanencia para garantizar la seguridad; el respeto entre visitantes y la protección del ambiente, pudiendo cancelar una visita confirmada o suspender una visita en curso, sin expresión de causa y sin que la cancelación o suspensión pueda ser invocada como causa para reclamar daño o derecho alguno.

                </p>
            </section>

            <section id="responsabilidad" className="mb-10">
                <h2 className="text-2xl text-heading font-semibold mb-3">Responsabilidad</h2>
                <p className="text-justify">
                    RNLE es un ambiente silvestre por lo no nos es posible controlar la totalidad de los sucesos naturales que puedan ocurrir, el visitante entiende y acepta que existen riesgos asociados a animales salvajes y plantas tóxicas, eventos climatológicos o geografía del entorno de la visita.
                    El visitante debe obedecer nuestras recomendaciones y las indicaciones que puedan darle los guías o personal de la RNLE.
                    RNLE no se responsabiliza por los daños y perjuicios de cualquier tipo y por cualquier causa que puedan sufrir los visitantes y/o sus bienes, tanto sean derechos individuales como colectivos.

                </p>
                <ul className="space-y-2 text-justify">
                    <li><h3>De las personas:</h3>
                        Con la aceptación de la presente, el visitante declara que ni él ni las personas indicadas en su grupo de visitas posee deficiencia o incapacidad alguna que lo condiciona de cualquier modo o impida la realización de la visita que no hubiere sido especificada según el punto Accesibilidad.
                        El visitante reconoce que el recorrido de visita es una caminata por un lugar agreste y que tiene la aptitud física para realizarlo.

                        <h3>De los automotores en los cuales se desplazan:</h3>
                        Con la aceptación de estas Políticas, el visitante conductor y/o titular del automotor con el cual se desplaza, manifiesta que se hace responsable de ingresar con un automotor convenientemente habilitado y con el seguro de ley vigente para recorrer un camino privado, de montaña, sinuoso, con zonas de derrumbes y enripiado.</li>
                </ul>
            </section>

            <section id="horarios" className="mb-10">
                <h2 className="text-2xl text-heading font-semibold mb-3">Horarios Ingreso/Egreso</h2>
                <p>
                    Con la confirmación de la visita se indicará día y horario de realización, el visitante deberá:
                    <br /> Presentarse en el puesto de ingreso con 15 minutos de anticipación al horario asignado, el que no tiene plazo de tolerancia.
                    <br />Contar con su documento de identidad vigente y los de sus acompañantes si los hubiere.
                    <br />Contar con la documentación del automotor y constancia de seguro vigente.
                    <br />Observar las instrucciones e indicaciones impartidas por el personal del puesto de entrada.
                    <br />Conducir por el camino de ingreso privado de la RNLE, hasta le estacionamiento indicado, sin apartarse de su traza y a una velocidad máxima de 40 km/hora.
                    <br />Reducir la velocidad o detener la marcha ante la presencia de animales u otros vehículos.
                    <br />No descender del vehículo. Si tiene algún percance permanecer dentro del vehículo hasta ser asistido.
                    <br />Apagar la radio y todo equipo que emita cualquier sonido desde el ingreso y hasta el egreso de la RNLE.
                    <br />Mantener las luces bajas encendidas.
                    <br />No tocar bocina, aún frente a animales que obstaculicen el camino, esperar hasta que se desplacen o sean desplazados del camino por personal de la RNLE.
                    <br />Mantener siempre las ventanillas cerradas.
                    <br />No fumar dentro ni fuera del vehículo.
                    <br />No consumir alcohol ni otras sustancias.
                    <br />No consumir ningún tipo de alimentos.
                    <br />Llevar para consumir agua para todos los visitantes.
                    <br />Conducir hasta le estacionamiento indicado donde será recibido por personal de la RNLE.
                    <br />Conserve la misma conducta al regresar hasta salir de la RNLE.
                </p>
            </section>

            <section id="durante" className="mb-10">
                <h2 className="text-2xl text-heading font-semibold mb-3">Durante la visita:</h2>
                <p>
                    Será acompañado por un guía ambiental
                    <br /> Deberá conducirse por los senderos habilitados.
                    <br />No puede llevar comida.
                    <br />Utilizar calzados adecuados, zapatillas o botines es suficiente.
                    <br />Llevar agua en botella recargable, no utilizar plásticos de un solo uso.
                    <br />Llevar ropa cómoda, gorro y protección solar.
                    <br />Retornar con cualquier residuo o basura.
                    <br />Informar al guía sobre alergias o alguna situación de salud o personal relevante.

                </p>
            </section>

            <section id="menores" className="mb-10">
                <h2 className="text-2xl text-heading font-semibold mb-3">Menores:</h2>
                <p>
                    Los menores deben estar acompañados por un adulto responsable en todo momento.
                </p>
            </section>

            <section id="mascotas" className="mb-10">
                <h2 className="text-2xl text-heading font-semibold mb-3">Mascotas:</h2>
                <p>
                    No están permitidas las mascotas.
                </p>
            </section>

            <section id="accesibilidad" className="mb-10">
                <h2 className="text-2xl text-heading font-semibold mb-3">Accesibilidad:</h2>
                <p>
                    Si alguna de las personas del grupo vive con algún tipo de discapacidad, por favor indicarlo al momento de efectuar la reserva.
                    <br />Haremos lo posible por adaptarnos para que pueda disfrutar de la experiencia de visita a nuestra reserva.

                </p>
            </section>

            <section id="actividades" className="mb-10">
                <h2 className="text-2xl text-heading font-semibold mb-3">Actividades especiales:</h2>
                <p>
                    No hacemos actividades como pesca, navegación, fogones, etc.
                    <br />No vendemos comidas, bebidas ni servicio turístico alguno.

                </p>
            </section>

            <section id="fotografia" className="mb-10">
                <h2 className="text-2xl text-heading font-semibold mb-3">Fotografía, drones y registros:</h2>
                <p className="text-justify">
                    Desde e l ingreso y hasta llegar al estacionamiento no está permitido obtener fotografías ni registros alguno.
                    <br />A partir del ingreso al sendero de la RNLE el guía les hará saber que pueden obtener fotografías o registros.
                    <br />No está permitido la utilización de drones.
                    <br />No está permitida la captación de imágenes y registros de ningún tipo con fines comerciales ni políticos.
                    <br />RNLE puede obtener registros e imágenes de los visitantes en forma grupal o individual, siempre lejana, evitando primeros planos, los visitantes autorizan con la aceptación de estas Políticas, la publicación gratuita de las mismas en las redes y sitios de RNLE.

                </p>
            </section>

            <section id="proteccion" className="mb-10">
                <h2 className="text-2xl text-heading font-semibold mb-3">Protección de datos personales:</h2>
                <p>
                    Los datos que nos compartas se usarán exclusivamente para gestionar tu visita y comunicaciones relacionadas (por ejemplo, recordatorios) y análisis de la actividad de nuestra RNLE. Conservamos la información por el tiempo necesario para estos fines y aplicamos medidas razonables de seguridad.
                </p>
            </section>

        </div>
    );
}
