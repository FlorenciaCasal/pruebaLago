"use client";
import React, { useState, useRef, useEffect } from "react";

// Lista de ciudades argentinas principales con sus provincias
const ARGENTINE_CITIES = [
  // Buenos Aires
  "Buenos Aires, BA", "La Plata, BA", "Mar del Plata, BA", "Quilmes, BA", "Lomas de Zamora, BA",
  "Banfield, BA", "Avellaneda, BA", "San Isidro, BA", "Vicente López, BA", "Tigre, BA",
  "San Miguel, BA", "Moreno, BA", "Pilar, BA", "Escobar, BA", "Zárate, BA",
  
  // Córdoba
  "Córdoba, CBA", "Villa Carlos Paz, CBA", "Río Cuarto, CBA", "Villa María, CBA", "San Francisco, CBA",
  "Cosquín, CBA", "La Falda, CBA", "Jesús María, CBA", "Villa General Belgrano, CBA", "Unquillo, CBA",
  
  // Santa Fe
  "Rosario, SF", "Santa Fe, SF", "Villa Gobernador Gálvez, SF", "Rafaela, SF", "Reconquista, SF",
  "Venado Tuerto, SF", "Santo Tomé, SF", "San Lorenzo, SF", "Pérez, SF", "Funes, SF",
  
  // Mendoza
  "Mendoza, MZA", "Godoy Cruz, MZA", "Las Heras, MZA", "San Rafael, MZA", "Luján de Cuyo, MZA",
  "Maipú, MZA", "Rivadavia, MZA", "Guaymallén, MZA", "Tunuyán, MZA", "San Martín, MZA",
  
  // Tucumán
  "San Miguel de Tucumán, TUC", "Yerba Buena, TUC", "Tafí Viejo, TUC", "Banda del Río Salí, TUC",
  "Alderetes, TUC", "Concepción, TUC", "Monteros, TUC", "Aguilares, TUC",
  
  // Entre Ríos
  "Paraná, ER", "Concordia, ER", "Gualeguaychú, ER", "Concepción del Uruguay, ER", "Villaguay, ER",
  "Gualeguay, ER", "Colón, ER", "Federación, ER",
  
  // Salta
  "Salta, SAL", "San Ramón de la Nueva Orán, SAL", "Tartagal, SAL", "Metán, SAL", "Rosario de Lerma, SAL",
  "Cafayate, SAL", "Cerrillos, SAL", "Chicoana, SAL",
  
  // Misiones
  "Posadas, MIS", "Eldorado, MIS", "Oberá, MIS", "San Vicente, MIS", "Puerto Iguazú, MIS",
  "Apóstoles, MIS", "Leandro N. Alem, MIS", "Aristóbulo del Valle, MIS",
  
  // Chaco
  "Resistencia, CHA", "Barranqueras, CHA", "Villa Ángela, CHA", "Charata, CHA", "Presidencia Roque Sáenz Peña, CHA",
  "General San Martín, CHA", "Machagai, CHA", "Quitilipi, CHA",
  
  // Corrientes
  "Corrientes, COR", "Goya, COR", "Mercedes, COR", "Paso de los Libres, COR", "Curuzú Cuatiá, COR",
  "Monte Caseros, COR", "Esquina, COR", "Santo Tomé, COR",
  
  // Santiago del Estero
  "Santiago del Estero, SGO", "La Banda, SGO", "Añatuya, SGO", "Termas de Río Hondo, SGO", "Frías, SGO",
  "Loreto, SGO", "Suncho Corral, SGO", "Quimilí, SGO",
  
  // San Juan
  "San Juan, SJ", "Pocito, SJ", "Rivadavia, SJ", "Chimbas, SJ", "Caucete, SJ",
  "Rawson, SJ", "Albardón, SJ", "Zonda, SJ",
  
  // Jujuy
  "San Salvador de Jujuy, JUJ", "Palpalá, JUJ", "San Pedro de Jujuy, JUJ", "Perico, JUJ", "Libertador General San Martín, JUJ",
  "Fraile Pintado, JUJ", "El Carmen, JUJ", "Humahuaca, JUJ",
  
  // Río Negro
  "Bariloche, RN", "General Roca, RN", "Cipolletti, RN", "Viedma, RN", "San Antonio Oeste, RN",
  "Villa Regina, RN", "Choele Choel, RN", "Allen, RN",
  
  // Neuquén
  "Neuquén, NEU", "Cutral Có, NEU", "Plottier, NEU", "Centenario, NEU", "San Martín de los Andes, NEU",
  "Zapala, NEU", "Rincón de los Sauces, NEU", "Junín de los Andes, NEU",
  
  // Chubut
  "Comodoro Rivadavia, CHU", "Rawson, CHU", "Trelew, CHU", "Puerto Madryn, CHU", "Esquel, CHU",
  "Sarmiento, CHU", "Gaiman, CHU", "Dolavon, CHU",
  
  // Formosa
  "Formosa, FSA", "Clorinda, FSA", "Pirané, FSA", "Las Lomitas, FSA", "Ingeniero Juárez, FSA",
  "Comandante Fontana, FSA", "Villa Escolar, FSA", "Laguna Blanca, FSA",
  
  // San Luis
  "San Luis, SL", "Villa Mercedes, SL", "Merlo, SL", "Justo Daract, SL", "La Toma, SL",
  "Concarán, SL", "Naschel, SL", "Quines, SL",
  
  // Catamarca
  "San Fernando del Valle de Catamarca, CAT", "Valle Viejo, CAT", "Fray Mamerto Esquiú, CAT", "Paclín, CAT",
  "Ambato, CAT", "Ancasti, CAT", "Andalgalá, CAT", "Antofagasta de la Sierra, CAT",
  
  // La Rioja
  "La Rioja, LR", "Chilecito, LR", "Arauco, LR", "Castro Barros, LR", "Chamical, LR",
  "Coronel Felipe Varela, LR", "Famatina, LR", "General Ángel V. Peñaloza, LR",
  
  // Santa Cruz
  "Río Gallegos, SC", "Caleta Olivia, SC", "El Calafate, SC", "Puerto Deseado, SC", "Pico Truncado, SC",
  "Las Heras, SC", "Perito Moreno, SC", "Los Antiguos, SC",
  
  // Tierra del Fuego
  "Ushuaia, TF", "Río Grande, TF", "Tolhuin, TF",
  
  // La Pampa
  "Santa Rosa, LP", "General Pico, LP", "Toay, LP", "Realicó, LP", "Macachín, LP",
  "General Acha, LP", "Guatraché, LP", "Victorica, LP",
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
  placeholder = "Ej. Córdoba, AR",
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
