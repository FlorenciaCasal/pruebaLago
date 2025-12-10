"use client";
import React, { useState, useRef, useEffect } from "react";
import CITIES from "@/data/ciudades.json";


const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

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
  placeholder = "Ej. Córdoba",
  className = "",
  inputMode = "text",
  maxLength = 80,
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  // const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<
    { nombre: string; nombre_normalizado: string }[]
  >([]);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtrar ciudades basado en el input
  useEffect(() => {
    if (value.length >= 2) {
      const q = normalize(value);

      const filtered = CITIES
        .filter(city => normalize(city.nombre_normalizado).includes(q))
        .slice(0, 10);

      setFilteredCities(filtered);
      setIsOpen(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [value]);


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredCities.length - 1));
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, -1));
        break;

      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) handleSelect(filteredCities[selectedIndex]);
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;

      default:
        // NO BLOQUEAR otras teclas
        break;
    }
  };


  const handleSelect = (city: { nombre: string }) => {
    onChange(city.nombre);
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
              key={city.nombre}
              className={`px-3 py-2 cursor-pointer text-sm border-b border-white/10 last:border-b-0 text-white ${index === selectedIndex
                ? "bg-white/20 text-white"
                : "hover:bg-white/10"
                }`}
              onClick={() => handleSelect(city)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {city.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
