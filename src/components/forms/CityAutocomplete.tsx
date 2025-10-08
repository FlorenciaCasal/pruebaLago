"use client";
import React, { useState, useRef, useEffect } from "react";

// Lista de ciudades argentinas principales con sus provincias
const ARGENTINE_CITIES = [
  // Buenos Aires
  "Buenos Aires, Argentina", "La Plata, Buenos Aires", "Mar del Plata, Buenos Aires", "Quilmes, Buenos Aires", "Lomas de Zamora, Buenos Aires",
  "Banfield, Buenos Aires", "Avellaneda, Buenos Aires", "San Isidro, Buenos Aires", "Vicente López, Buenos Aires", "Tigre, Buenos Aires",
  "San Miguel, Buenos Aires", "Moreno, Buenos Aires", "Pilar, Buenos Aires", "Escobar, Buenos Aires", "Zárate, Buenos Aires",

  // Córdoba
  "Córdoba, Argentina", "Villa Carlos Paz, Córdoba", "Río Cuarto, Córdoba", "Villa María, Córdoba", "San Francisco, Córdoba",
  "Cosquín, Córdoba", "La Falda, Córdoba", "Jesús María, Córdoba", "Villa General Belgrano, Córdoba", "Unquillo, Córdoba",

  // Santa Fe
  "Rosario, Santa Fe", "Santa Fe, Argentina", "Villa Gobernador Gálvez, Santa Fe", "Rafaela, Santa Fe", "Reconquista, Santa Fe",
  "Venado Tuerto, Santa Fe", "Santo Tomé, Santa Fe", "San Lorenzo, Santa Fe", "Pérez, Santa Fe", "Funes, Santa Fe",

  // Mendoza
  "Mendoza, Argentina", "Godoy Cruz, Mendoza", "Las Heras, Mendoza", "San Rafael, Mendoza", "Luján de Cuyo, Mendoza",
  "Maipú, Mendoza", "Rivadavia, Mendoza", "Guaymallén, Mendoza", "Tunuyán, Mendoza", "San Martín, Mendoza",

  // Tucumán
  "San Miguel de Tucumán, Tucumán", "Yerba Buena, Tucumán", "Tafí Viejo, Tucumán", "Banda del Río Salí, Tucumán",
  "Alderetes, Tucumán", "Concepción, Tucumán", "Monteros, Tucumán", "Aguilares, Tucumán",

  // Entre Ríos
  "Paraná, Entre Ríos", "Concordia, Entre Ríos", "Gualeguaychú, Entre Ríos", "Concepción del Uruguay, Entre Ríos", "Villaguay, Entre Ríos",
  "Gualeguay, Entre Ríos", "Colón, Entre Ríos", "Federación, Entre Ríos",

  // Salta
  "Salta, Argentina", "San Ramón de la Nueva Orán, Salta", "Tartagal, Salta", "Metán, Salta", "Rosario de Lerma, Salta",
  "Cafayate, Salta", "Cerrillos, Salta", "Chicoana, Salta",

  // Misiones
  "Posadas, Misiones", "Eldorado, Misiones", "Oberá, Misiones", "San Vicente, Misiones", "Puerto Iguazú, Misiones",
  "Apóstoles, Misiones", "Leandro N. Alem, Misiones", "Aristóbulo del Valle, Misiones",

  // Chaco
  "Resistencia, Chaco", "Barranqueras, Chaco", "Villa Ángela, Chaco", "Charata, Chaco", "Presidencia Roque Sáenz Peña, Chaco",
  "General San Martín, Chaco", "Machagai, Chaco", "Quitilipi, Chaco",

  // Corrientes
  "Corrientes, Argentina", "Goya, Corrientes", "Mercedes, Corrientes", "Paso de los Libres, Corrientes", "Curuzú Cuatiá, Corrientes",
  "Monte Caseros, Corrientes", "Esquina, Corrientes", "Santo Tomé, Corrientes",

  // Santiago del Estero
  "Santiago del Estero, Argentina", "La Banda, Santiago del Estero", "Añatuya, Santiago del Estero", "Termas de Río Hondo, Santiago del Estero", "Frías, Santiago del Estero",
  "Loreto, Santiago del Estero", "Suncho Corral, Santiago del Estero", "Quimilí, Santiago del Estero",

  // San Juan
  "San Juan, Argentina", "Pocito, San Juan", "Rivadavia, San Juan", "Chimbas, San Juan", "Caucete, San Juan",
  "Rawson, San Juan", "Albardón, San Juan", "Zonda, San Juan",

  // Jujuy
  "San Salvador de Jujuy, Jujuy", "Palpalá, Jujuy", "San Pedro de Jujuy, Jujuy", "Perico, Jujuy", "Libertador General San Martín, Jujuy",
  "Fraile Pintado, Jujuy", "El Carmen, Jujuy", "Humahuaca, Jujuy",

  // Río Negro
  "Bariloche, Río Negro", "General Roca, Río Negro", "Cipolletti, Río Negro", "Viedma, Río Negro", "San Antonio Oeste, Río Negro",
  "Villa Regina, Río Negro", "Choele Choel, Río Negro", "Allen, Río Negro",

  // Neuquén
  "Neuquén, Argentina", "Cutral Có, Neuquén", "Plottier, Neuquén", "Centenario, Neuquén", "San Martín de los Andes, Neuquén",
  "Zapala, Neuquén", "Rincón de los Sauces, Neuquén", "Junín de los Andes, Neuquén",

  // Chubut
  "Comodoro Rivadavia, Chubut", "Rawson, Chubut", "Trelew, Chubut", "Puerto Madryn, Chubut", "Esquel, Chubut",
  "Sarmiento, Chubut", "Gaiman, Chubut", "Dolavon, Chubut",

  // Formosa
  "Formosa, Argentina", "Clorinda, Formosa", "Pirané, Formosa", "Las Lomitas, Formosa", "Ingeniero Juárez, Formosa",
  "Comandante Fontana, Formosa", "Villa Escolar, Formosa", "Laguna Blanca, Formosa",

  // San Luis
  "San Luis, Argentina", "Villa Mercedes, San Luis", "Merlo, San Luis", "Justo Daract, San Luis", "La Toma, San Luis",
  "Concarán, San Luis", "Naschel, San Luis", "Quines, San Luis",

  // Catamarca
  "San Fernando del Valle de Catamarca, Catamarca", "Valle Viejo, Catamarca", "Fray Mamerto Esquiú, Catamarca", "Paclín, Catamarca",
  "Ambato, Catamarca", "Ancasti, Catamarca", "Andalgalá, Catamarca", "Antofagasta de la Sierra, Catamarca",

  // La Rioja
  "La Rioja, Argentina", "Chilecito, La Rioja", "Arauco, La Rioja", "Castro Barros, La Rioja", "Chamical, La Rioja",
  "Coronel Felipe Varela, La Rioja", "Famatina, La Rioja", "General Ángel V. Peñaloza, La Rioja",

  // Santa Cruz
  "Río Gallegos, Santa Cruz", "Caleta Olivia, Santa Cruz", "El Calafate, Santa Cruz", "Puerto Deseado, Santa Cruz", "Pico Truncado, Santa Cruz",
  "Las Heras, Santa Cruz", "Perito Moreno, Santa Cruz", "Los Antiguos, Santa Cruz",

  // Tierra del Fuego
  "Ushuaia, Tierra del Fuego", "Río Grande, Tierra del Fuego", "Tolhuin, Tierra del Fuego",

  // La Pampa
  "Santa Rosa, La Pampa", "General Pico, La Pampa", "Toay, La Pampa", "Realicó, La Pampa", "Macachín, La Pampa",
  "General Acha, La Pampa", "Guatraché, La Pampa", "Victorica, La Pampa",
];

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputMode?: "search" | "none" | "text" | "email" | "tel" | "url" | "numeric" | "decimal";
  maxLength?: number;
}

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = "Ej. Córdoba, Argentina",
  className = "",
  inputMode = "text",
  maxLength = 80,
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtrar ciudades basado en el input
  useEffect(() => {
    if (value.length >= 2) {
      const query = value.toLowerCase().trim();
      const filtered = ARGENTINE_CITIES.filter(city => {
        const cityLower = city.toLowerCase();
        
        // Búsqueda simple: contiene la query
        if (cityLower.includes(query)) return true;
        
        // Búsqueda por palabras: cada palabra de la query debe estar en alguna parte del nombre
        const queryWords = query.split(/\s+/);
        const cityWords = cityLower.split(/\s+/);
        
        return queryWords.every(queryWord => 
          cityWords.some(cityWord => cityWord.includes(queryWord))
        );
      }).slice(0, 10); // Limitar a 10 resultados
      
      setFilteredCities(filtered);
      setIsOpen(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [value]);

  // Manejar selección con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Solo manejar teclas específicas cuando el dropdown está abierto y hay sugerencias
    if (!isOpen || filteredCities.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCities.length) {
          handleSelect(filteredCities[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case "Tab":
        // Permitir que Tab funcione normalmente
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        // Para todas las demás teclas (incluyendo espacio), no hacer nada
        // Esto permite la escritura normal
        break;
    }
  };

  const handleSelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    if (filteredCities.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay para permitir clicks en las opciones
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  // Scroll al elemento seleccionado
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete="off"
      />
      
      {isOpen && filteredCities.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-gray-900/95 border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto backdrop-blur-sm"
        >
          {filteredCities.map((city, index) => (
            <li
              key={city}
              className={`px-3 py-2 cursor-pointer text-sm border-b border-white/10 last:border-b-0 text-white ${
                index === selectedIndex
                  ? "bg-white/20 text-white"
                  : "hover:bg-white/10"
              }`}
              onClick={() => handleSelect(city)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
