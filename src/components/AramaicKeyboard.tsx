import React from 'react';
import { Delete, Trash2 } from 'lucide-react';
import { ARAMAIC_ALPHABET } from '../data/alphabet';
import { FontStyle } from '../types';

interface AramaicKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  selectedFont: FontStyle;
}

export default function AramaicKeyboard({ onKeyPress, onBackspace, onClear, selectedFont }: AramaicKeyboardProps) {
  
  // Font styling wrapper
  const getFontClass = () => {
    switch (selectedFont) {
      case 'serto':
        return 'font-serto';
      case 'madnkhaya':
        return 'font-madnkhaya';
      case 'estrangelo':
      default:
        return 'font-aramaic';
    }
  };

  return (
    <div id="virtual-keyboard" className="bg-[#3E3831] text-stone-100 p-4 rounded-2xl shadow-xl w-full max-w-2xl mx-auto border border-[#524B42]">
      <div className="flex justify-between items-center mb-3 border-b border-[#524B42] pb-2">
        <span className="text-xs font-mono font-semibold text-[#8B7355] uppercase tracking-widest flex items-center gap-1">
          ⌨️ Virtual Aramaic Keyboard
        </span>
        <div className="flex gap-2">
          <button
            onClick={onBackspace}
            className="p-1 px-2.5 bg-[#2D2823] hover:bg-[#524B42] rounded text-xs flex items-center gap-1 text-stone-300 active:scale-95 transition-all cursor-pointer"
            title="Backspace"
          >
            <Delete className="w-3.5 h-3.5 text-stone-400" />
            Hapus Satu
          </button>
          <button
            onClick={onClear}
            className="p-1 px-2.5 bg-[#8B7355] hover:bg-[#5E584E] text-white rounded text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            title="Clear all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Teks
          </button>
        </div>
      </div>

      {/* Modern keyboard layout for the 22 letters */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 select-none" style={{ direction: 'rtl' }}>
        {ARAMAIC_ALPHABET.map((item) => (
          <button
            key={item.char}
            onClick={() => onKeyPress(item.char)}
            className="group relative flex flex-col items-center justify-center bg-[#2D2823] hover:bg-[#524B42] hover:border-[#8B7355]/60 border border-[#524B42]/50 h-14 rounded-xl transition-all duration-200 active:scale-90 cursor-pointer"
          >
            {/* The Aramaic glyph */}
            <span className={`text-xl md:text-2xl font-bold group-hover:scale-110 transition-transform ${getFontClass()} text-white group-hover:text-[#8B7355]`}>
              {item.char}
            </span>
            
            {/* English transliteration keycap indicator */}
            <span className="text-[9px] font-mono text-stone-500 group-hover:text-stone-300 mt-1 uppercase tracking-tight">
              {item.transliteration}
            </span>

            {/* Quick Hover Tooltip showing meaning */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-stone-950 text-[10px] text-stone-200 px-2 py-1 rounded shadow-lg pointer-events-none z-50 whitespace-nowrap" style={{ direction: 'ltr' }}>
              Val: {item.numericalValue} | Equivalent: {item.englishEquivalent}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-2.5 flex justify-center items-center gap-4 text-xxs text-stone-500" style={{ direction: 'ltr' }}>
        <span>* Teks mengalir otomatis dari <strong>Kanan-ke-Kiri</strong> sejalan dengan tata bahasa asli Aramaik.</span>
      </div>
    </div>
  );
}
