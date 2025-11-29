// export const lineColor = "border-white/80";
export const lineColor = "border-black";
export const textMain = "text-black";
export const textSoft = "text-gray-700";

export const inputBase =
    `w-full bg-transparent ${textMain} placeholder:${textSoft}
   border-0 border-b ${lineColor} focus:border-b-2
   outline-none focus:outline-none ring-0 focus:ring-0
   py-3 transition`;

export const textareaBase =
    `w-full bg-transparent ${textMain} placeholder:${textSoft}
   border ${lineColor} border-t-0 border-l-0 border-r-0
   focus:border-b-2 outline-none ring-0 focus:ring-0
   py-3 transition`;

export const sectionRow = "py-3 border-b border-white/10";
export const hintText = "text-sm " + textSoft;

export const radioDot =
    `appearance-none w-4 h-4 rounded-full border ${lineColor}
   checked:bg-white checked:shadow-[inset_0_0_0_3px_rgba(17,24,39,1)]`;

export const radioHidden = `sr-only peer`; // accesible y usable con peer

export const radioCard = `
  flex items-center gap-3 cursor-pointer select-none
  border border-white rounded-md px-2 py-2
  bg-white text-black
  hover:bg-gray-400/30
  peer-checked:bg-gray-400 peer-checked:text-gray-900
  transition
`;

// 🆕 badge cuadrado con letra dentro (invierte al checkear)
export const radioBadge = `
  h-8 w-8 grid place-items-center rounded-[4px]
  border border-white text-white text-xs font-semibold
  bg-black
  transition
  peer-checked:bg-white peer-checked:text-gray-900 peer-checked:border-gray-900
  peer-focus-visible:ring-2 peer-focus-visible:ring-white/60
`;

// export const checkboxBox =
//     `mt-0.5 w-4 h-4 cursor-pointer appearance-none border ${lineColor} rounded-sm
//    checked:bg-white checked:shadow-[inset_0_0_0_2px_rgba(17,24,39,1)]`;
export const checkboxBox =
  "mt-0.5 h-4 w-4 cursor-pointer accent-button";
