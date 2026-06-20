import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Trash2, CheckCircle2, Award, Info, Sparkles } from 'lucide-react';
import { Letter, FontStyle } from '../types';

interface CanvasTracerProps {
  selectedLetter: Letter;
  selectedFont: FontStyle;
}

export default function CanvasTracer({ selectedLetter, selectedFont }: CanvasTracerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#3E3831'); // Default Coffee/Ink Charcoal
  const [brushSize, setBrushSize] = useState(8);
  const [showGuide, setShowGuide] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Setup canvas resolution and adjust size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set matching dimensions
    canvas.width = 300;
    canvas.height = 300;

    // Reset drawn state for new letter
    clearCanvas();
  }, [selectedLetter]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
    setHasDrawn(true);
    setIsCompleted(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setIsCompleted(false);
  };

  const verifyTracing = () => {
    if (!hasDrawn) return;
    setIsCompleted(true);
  };

  // Class selection for the font inside tracer template
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
    <div id="canvas-tracer-card" className="flex flex-col md:flex-row items-stretch gap-6 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm max-w-3xl mx-auto">
      {/* Visual Workspace Canvas */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-3">
          <span className="text-xs font-mono font-medium text-stone-500 uppercase tracking-wider flex items-center gap-1.5Packed">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Tracer & Coretan Huruf
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className={`px-2 py-1 rounded text-xs transition-colors duration-200 ${
                showGuide ? 'bg-[#3E3831]/10 text-[#3E3831] font-semibold' : 'bg-stone-100 text-stone-600'
              }`}
            >
              Template: {showGuide ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Drawing Canvas Frame */}
        <div className="relative w-[300px] h-[300px] select-none rounded-xl border-2 border-stone-200 bg-[#FAF9F5] shadow-inner overflow-hidden cursor-crosshair">
          {/* Guide template overlay */}
          {showGuide && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span 
                className={`text-[12rem] text-stone-200/80 transition-all duration-300 select-none ${getFontClass()}`}
                style={{ direction: 'rtl' }}
              >
                {selectedLetter.char}
              </span>
            </div>
          )}

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 z-10 w-full h-full"
          />

          {isCompleted && (
            <div className="absolute inset-0 bg-[#F5F8F5]/90 z-20 flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
              <Award className="w-12 h-12 text-emerald-600 mb-2 animate-bounce" />
              <h4 className="text-sm font-semibold text-stone-800">Coretan Tersimpan!</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-[200px]">
                Hebat! Anda telah menulis aksara <strong>{selectedLetter.transliteration}</strong> ({selectedLetter.char}).
              </p>
              <button
                onClick={clearCanvas}
                className="mt-3 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-medium transition-colors"
              >
                Tulis Lagi
              </button>
            </div>
          )}
        </div>

        {/* Brush Controllers */}
        <div className="w-full mt-4 flex items-center justify-between gap-4">
          <div className="flex gap-2.5">
            {/* Color Selectors */}
            <button
              onClick={() => setColor('#3E3831')}
              title="Wood Ink Charcoal"
              style={{ backgroundColor: '#3E3831' }}
              className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 ${
                color === '#3E3831' ? 'border-stone-400 scale-125' : 'border-transparent'
              }`}
            />
            <button
              onClick={() => setColor('#D97706')}
              title="Imperial Gold"
              style={{ backgroundColor: '#D97706' }}
              className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 ${
                color === '#D97706' ? 'border-amber-500 scale-125' : 'border-transparent'
              }`}
            />
            <button
              onClick={() => setColor('#1C1611')}
              title="Ink Charcoal"
              style={{ backgroundColor: '#1C1611' }}
              className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 ${
                color === '#1C1611' ? 'border-amber-500 scale-125' : 'border-transparent'
              }`}
            />
          </div>

          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
            <button
              onClick={clearCanvas}
              className="p-1 px-2.5 hover:bg-white text-stone-600 hover:text-stone-900 rounded transition-colors text-xs flex items-center gap-1"
              title="Bersihkan coretan"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={verifyTracing}
              disabled={!hasDrawn}
              className={`p-1 px-2.5 rounded transition-all text-xs flex items-center gap-1 ${
                hasDrawn
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Selesai
            </button>
          </div>
        </div>
      </div>

      {/* Guide/Instruction and Info Column */}
      <div className="w-full md:w-[240px] border-t md:border-t-0 md:border-l border-stone-200 pt-5 md:pt-0 md:pl-5 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-700" />
            Panduan Menulis
          </h4>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            Aksara Suryani (Aramaik) ditulis dari arah <strong>Kanan ke Kiri (RTL)</strong>. 
          </p>
          <ul className="text-xs text-stone-500 mt-2.5 list-disc pl-4 space-y-1.5">
            <li>Mulai dari titik ekstrem atas kanan huruf.</li>
            <li>Gerakkan jemari Anda memutar kebawah membentuk lengkungan dasar.</li>
            <li>Akhiri dengan tarikan tajam di bagian kiri bawah (arah sambungan).</li>
          </ul>

          <div className="bg-[#FAF9F5] p-3 rounded-lg border border-stone-200/50 mt-4">
            <span className="text-xxs font-mono text-stone-400 uppercase tracking-widest block mb-1">
              Unicode Sign
            </span>
            <span className="text-xs text-stone-700 font-medium font-mono block">
              {selectedLetter.syriacCharCodes} ({selectedLetter.transliteration})
            </span>
            <span className="text-xs text-stone-500 block mt-1">
              Nilai Gematria: <strong>{selectedLetter.numericalValue}</strong>
            </span>
          </div>
        </div>

        <div className="mt-4 text-xxs text-stone-400 italic">
          Tip: Sentuh atau seret mouse Anda di atas kotak untuk melatih aliran memori tangan Anda.
        </div>
      </div>
    </div>
  );
}
