import React, { useRef, useState, useEffect } from 'react';
import { 
  Trash2, Download, Undo2, Award, Info, Sparkles, Layers, 
  BookOpen, PenTool, Type as FontIcon, Copy, Check, ChevronRight, 
  Keyboard, HelpCircle, ArrowRightLeft, AlignRight, ZoomIn
} from 'lucide-react';
import { Letter, FontStyle } from '../types';
import { ARAMAIC_ALPHABET } from '../data/alphabet';

interface WhiteboardAramaicProps {
  selectedFont: FontStyle;
  onChangeFont: (font: FontStyle) => void;
}

// Full array of Syriac vowels (Kanoone / Vokal) and accents
interface VowelKey {
  char: string;
  name: string;
  transliteration: string;
  type: string;
  description: string;
}

const SYRIAC_VOWELS: VowelKey[] = [
  { char: '\u0730', name: 'Pthaha Above', transliteration: 'a (pendek)', type: 'păthāḥā', description: 'Garis miring tunggal di atas huruf (bunyi "a" tipis/pendek)' },
  { char: '\u0731', name: 'Pthaha Below', transliteration: 'a', type: 'păthāḥā', description: 'Garis miring tunggal di bawah huruf' },
  { char: '\u0733', name: 'Zqapha Above', transliteration: 'ā / o', type: 'zqāp̄ā', description: 'Dua garis miring sejajar di atas huruf (bunyi "a" tebal condong ke "o")' },
  { char: '\u0734', name: 'Zqapha Below', transliteration: 'ā / o', type: 'zqāp̄ā', description: 'Dua garis miring sejajar di bawah huruf' },
  { char: '\u0736', name: 'Rbasa Below', transliteration: 'e (lemah)', type: 'rḇāṣā', description: 'Dua titik diagonal di bawah huruf (bunyi "e" lemah)' },
  { char: '\u0738', name: 'Zlama Sraya', transliteration: 'e (kuat)', type: 'zlāmā srayā', description: 'Dua titik horizontal di bawah huruf (bunyi "e" penuh/kuat)' },
  { char: '\u0739', name: 'Hbasa Above', transliteration: 'i', type: 'ḥbāṣā', description: 'Satu titik di atas huruf pembantu Yodh (bunyi "i" panjang)' },
  { char: '\u073A', name: 'Hbasa Below', transliteration: 'i', type: 'ḥbāṣā', description: 'Satu titik di bawah huruf pembantu Yodh (bunyi "i" pendek/panjang)' },
  { char: '\u073C', name: 'Hbasa Esasa', transliteration: 'u', type: '‘ṣāṣā', description: 'Satu titik di bawah huruf pembantu Waw (bunyi "u" bulat)' },
  { char: '\u073F', name: 'Qushaya', transliteration: 'Dot Above', type: 'Pengeras', description: 'Titik tunggal di atas huruf untuk pengucapan keras (Begadkepat: B, G, D, K, P, T)' },
  { char: '\u0740', name: 'Rukhakha', transliteration: 'Dot Below', type: 'Pelemah', description: 'Titik tunggal di bawah huruf untuk pengucapan lembut/spiran' },
  { char: '\u0741', name: 'Syame', transliteration: 'Plural Dots', type: 'Jamak', description: 'Dua titik horizontal di atas huruf terakhir untuk menandai kata benda jamak' },
  { char: '\u0743', name: 'Linea Occultans', transliteration: 'Silent Marker', type: 'Peredam', description: 'Garis horizontal tipis di bawah huruf untuk menandakan huruf tersebut senyap/tidak dibaca' }
];

// Predefined beautiful sentences for students to practice
interface PracticeSentence {
  aramaic: string;
  transliteration: string;
  translation: string;
  context: string;
}

const PRACTICE_SENTENCES: PracticeSentence[] = [
  {
    aramaic: "ܫܠܵܡܵܐ ܥܲܠܘܼܟܼܘܿܢ",
    transliteration: "Shlāmā 'alokhōn",
    translation: "Damai sejahtera turun atas kalian / Salam sejahtera",
    context: "Salam pembuka tradisional dalam rumpun bahasa Semit"
  },
  {
    aramaic: "ܬܵܘܕܝܼ ܣܲܓܝܼ",
    transliteration: "Tawdī sagī",
    translation: "Terima kasih banyak",
    context: "Ungkapan rasa hormat dan terima kasih harian"
  },
  {
    aramaic: "ܐܲܒܵܐ ܕܒܲܫܡܲܝܵܐ",
    transliteration: "Abbā d-bashmayā",
    translation: "Bapa kami yang ada di surga",
    context: "Baris pembuka Doa Bapa Kami (Latihan Doa Agung Peshitta)"
  },
  {
    aramaic: "ܒܪܝܼܟܼ ܫܸܡܹܗ ܕܡܵܪܝܵܐ",
    transliteration: "Brīkh shmeh d-māryā",
    translation: "Terpujilah nama Tuhan",
    context: "Doksologi dan ungkapan syukur spiritual klasik"
  },
  {
    aramaic: "ܐܝܼܬܝܼ ܬܲܠܡܝܼܕܼܵܐ ܕܠܸܫܵܢܵܐ ܐܲܪܵܡܵܝܵܐ",
    transliteration: "Īthī talmīdhā d-leshānā arāmāyā",
    translation: "Saya adalah murid yang sedang belajar bahasa Aramaik",
    context: "Kalimat perkenalan jati diri akademis siswa"
  }
];

export default function WhiteboardAramaic({ selectedFont, onChangeFont }: WhiteboardAramaicProps) {
  // Modes: 'typing' (keyboard typewriter board) or 'drawing' (calligraphy sketchcanvas tracing)
  const [boardMode, setBoardMode] = useState<'typing' | 'drawing'>('typing');
  
  // States for Typing Mode
  const [typedText, setTypedText] = useState<string>('ܫܠܵܡܵܐ');
  const [fontSize, setFontSize] = useState<number>(44);
  const [vowelOverlayInfo, setVowelOverlayInfo] = useState<VowelKey | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // States for Canvas Drawing Mode
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#1C1611');
  const [brushSize, setBrushSize] = useState(6);
  const [brushType, setBrushType] = useState<'pen' | 'quill' | 'highlighter' | 'eraser'>('pen');
  const [selectedLetter, setSelectedLetter] = useState<Letter>(ARAMAIC_ALPHABET[0]);
  const [showGuide, setShowGuide] = useState(true);
  const [guideOpacity, setGuideOpacity] = useState<number>(0.2);
  const [history, setHistory] = useState<string[]>([]);
  const [canvasCleared, setCanvasCleared] = useState(true);

  // Focus synchronization for Typing text area
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Copy helper
  const handleCopyText = () => {
    navigator.clipboard.writeText(typedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard insertions
  const insertChar = (char: string) => {
    setTypedText(prev => prev + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBackspace = () => {
    setTypedText(prev => prev.slice(0, -1));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    setTypedText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const appendSentence = (sentence: string) => {
    setTypedText(prev => {
      const space = prev && !prev.endsWith(' ') ? ' ' : '';
      return prev + space + sentence;
    });
  };

  // Font utilities mapping
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

  // Drawing Canvas Engine Initialization
  useEffect(() => {
    if (boardMode !== 'drawing') return;
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 600;
      canvas.height = 420;

      ctx.fillStyle = '#FAF9F5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setHistory([canvas.toDataURL()]);
      setCanvasCleared(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [boardMode]);

  // Coordinates mapping
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

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
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
    setIsDrawing(true);
    setCanvasCleared(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (brushType === 'eraser') {
      ctx.strokeStyle = '#FAF9F5';
      ctx.lineWidth = brushSize * 2.5;
    } else if (brushType === 'highlighter') {
      ctx.strokeStyle = color + '40';
      ctx.lineWidth = brushSize * 3;
    } else if (brushType === 'quill') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.shadowBlur = 0.5;
      ctx.shadowColor = color;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      setHistory(prev => [...prev.slice(-19), dataUrl]);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FAF9F5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHistory([canvas.toDataURL()]);
    setCanvasCleared(true);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const previousStateString = history[history.length - 2];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = previousStateString;
    img.onload = () => {
      ctx.fillStyle = '#FAF9F5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistory(prev => prev.slice(0, -1));
    };
  };

  const downloadCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Coretan_Kaligrafi_${selectedLetter.transliteration}.png`;
    link.href = image;
    link.click();
  };

  return (
    <div id="aramaic-whiteboard-root" className="space-y-6">
      {/* Banner Top bar with Selector Tab */}
      <div className="bg-gradient-to-r from-[#3E3831] to-[#5A5147] text-[#FAF9F5] p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="p-1 px-[9px] bg-amber-200/20 text-amber-200 text-[10px] font-mono rounded-full uppercase tracking-wider font-semibold">
            Modul Menulis Sastra Aram
          </span>
          <h2 className="text-xl font-bold font-serif mt-1.5 flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-200" />
            Papan Tulis & Pengetikan Sastra Aramaik
          </h2>
          <p className="text-xs text-[#FAF9F5]/90 max-w-xl mt-1">
            Latihlah penulisan abjad konsonan lengkap dengan tatanan tanda vokal (<em className="italic font-serif">Kanoone / Vokal</em>) menggunakan aksara klasik berdialek dinamis.
          </p>
        </div>

        {/* Board Mode Switcher */}
        <div className="bg-[#1C1611]/40 p-1 rounded-xl flex gap-1 self-start md:self-auto border border-white/10 shrink-0">
          <button
            onClick={() => setBoardMode('typing')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              boardMode === 'typing' 
                ? 'bg-amber-100 text-[#3E3831] shadow-xs' 
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            Keyboard & Vokal
          </button>
          <button
            onClick={() => setBoardMode('drawing')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              boardMode === 'drawing' 
                ? 'bg-amber-100 text-[#3E3831] shadow-xs' 
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Coretan Kuas Bebas
          </button>
        </div>
      </div>

      {/* Font & Script Selection Toolbar */}
      <div className="bg-[#FAF9F5] border border-[#E8E2D9] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4.5 h-4.5 text-[#8B7355]" />
          <div>
            <span className="text-[10px] text-stone-500 font-mono tracking-wider block uppercase">Aksara Aktif</span>
            <span className="text-xs font-bold text-stone-800 capitalize">{selectedFont} Dialect Script</span>
          </div>
        </div>

        <div className="flex gap-2">
          {(['estrangelo', 'serto', 'madnkhaya'] as FontStyle[]).map((font) => (
            <button
              key={font}
              onClick={() => onChangeFont(font)}
              className={`p-1.5 px-3.5 border rounded-lg text-xs font-medium capitalize font-mono transition-all cursor-pointer ${
                selectedFont === font 
                  ? 'bg-[#3E3831] text-[#FAF9F5] border-transparent shadow-xs font-bold' 
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      {/* TYPING MODE LAYOUT */}
      {boardMode === 'typing' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Typing Board & Guides & Practice */}
          <div className="xl:col-span-5 space-y-6">
            
            {/* White Typing Board Display */}
            <div className="bg-white text-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col justify-between space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <AlignRight className="w-5 h-5 text-amber-700" />
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Papan Tulis Ketik Aram
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Dynamic Font Size Control */}
                  <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/60">
                    <ZoomIn className="w-3.5 h-3.5 text-stone-500" />
                    <input 
                      type="range"
                      min="24"
                      max="72"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-16 accent-[#8B7355] h-1 cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-stone-600 w-8 text-center">{fontSize}px</span>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopyText}
                    className={`p-1 px-2.5 rounded-lg text-xxs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                      copied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                    }`}
                    title="Salin hasil ketikan"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Tersalin' : 'Salin'}
                  </button>
                  
                  {/* Reset/Clear Action */}
                  <button
                     onClick={handleClear}
                     className="p-1 px-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xxs font-bold active:scale-95 transition-all cursor-pointer"
                  >
                     Reset
                  </button>
                </div>
              </div>

              {/* Large Pristine White/Cream Textarea */}
              <div className="relative bg-[#FAF9F5] rounded-xl p-4 min-h-[160px] flex items-center justify-center border border-stone-200 shadow-inner">
                <textarea
                  ref={inputRef}
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  className={`w-full bg-transparent text-center border-none outline-none resize-none align-middle font-medium text-stone-800 placeholder-stone-400 ${getFontClass()}`}
                  style={{ 
                    fontSize: `${fontSize}px`, 
                    direction: 'rtl',
                    lineHeight: '1.6',
                    height: '140px'
                  }}
                  placeholder="ܫܠܵܡܵܐ"
                />
              </div>

              <div className="text-[10px] text-stone-500 font-sans tracking-wide leading-relaxed p-2.5 bg-amber-50/50 rounded-lg border border-amber-100/60">
                💡 <strong className="text-amber-900 font-semibold">Petunjuk Aliran:</strong> Sastra Aram ditulis dari kanan-ke-kiri. Ketik huruf konsonannya terlebih dahulu, lalu ketuk penanda <em className="italic">Kanoone</em> (Vokal) untuk menempatkannya di atas/bawah huruf terakhir.
              </div>
            </div>

            {/* Vowel Information sub-panel */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xxs font-mono text-stone-400 font-bold uppercase tracking-wider block">Inspektur Fonetis</span>
                <h4 className="text-xs font-bold text-stone-800 font-serif flex items-center gap-1.5 mt-0.5">
                  <Info className="w-4 h-4 text-[#8B7355]" />
                  Detail Penanda Vokal (Kanoone)
                </h4>
                
                {vowelOverlayInfo ? (
                  <div className="mt-2.5 bg-[#FAF9F5] border border-amber-200/50 rounded-xl p-3.5 space-y-2 animate-fade-in animate-duration-300">
                    <div className="flex items-center justify-between border-b border-stone-200/50 pb-1.5">
                      <span className="text-2xl font-bold font-aramaic text-[#8B7355]">◌{vowelOverlayInfo.char}</span>
                      <span className="text-[10px] font-mono font-bold text-amber-800 uppercase px-2 py-0.5 bg-amber-100/80 rounded-full">
                        {vowelOverlayInfo.type}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-bold text-stone-800">{vowelOverlayInfo.name}</p>
                      <p className="text-[10px] font-mono text-[#8B7355]">Pelafalan: <strong>{vowelOverlayInfo.transliteration}</strong></p>
                      <p className="text-stone-600 text-[11px] leading-relaxed mt-1">{vowelOverlayInfo.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2.5 bg-[#FAF9F5]/60 border border-stone-100 rounded-xl p-3.5 text-center">
                    <Sparkles className="w-5 h-5 text-amber-600/60 mx-auto" />
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      Layangkan kursor (hover) atau sentuh tombol tanda vokal di virtual keyboard sebelah kanan untuk mempelajari cara baca & posisinya.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SUGGESTED PRACTICE SENTENCES */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-[#8B7355]" />
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-widest font-sans">
                  Latihan Kalimat Populer
                </h3>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Ketuk salah satu kalimat di bawah untuk menyisipkannya langsung ke Papan Tulis:
              </p>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {PRACTICE_SENTENCES.map((ps, idx) => (
                  <div 
                    key={idx}
                    onClick={() => appendSentence(ps.aramaic)}
                    className="p-3 bg-[#FAF9F5] hover:bg-amber-50 border border-stone-200/70 rounded-xl transition-all cursor-pointer hover:border-[#8B7355]/40 flex flex-col gap-1 text-left group"
                  >
                    <div className="flex justify-between items-start gap-2" style={{ direction: 'rtl' }}>
                      <span className={`text-xl font-bold text-[#3E3831] group-hover:text-[#8B7355] ${getFontClass()}`}>
                        {ps.aramaic}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-mono font-bold text-[#8B7355]">{ps.transliteration}</p>
                      <p className="text-xs font-semibold text-stone-700 leading-tight">{ps.translation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: VIRTUAL KEYBOARD PANEL (CONSONANTS & VOWELS SIDE-BY-SIDE) */}
          <div className="xl:col-span-7 space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5 space-y-5">
              
              {/* Section A: VOWELS / KANOONE (Diatribits & Dots) */}
              <div className="space-y-2">
                <span className="text-xxs font-mono font-bold text-stone-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-stone-100 pb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B7355]" />
                  1. Tanda Vokal / Kanoone & Umlaut Diakritik
                </span>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2">
                  {SYRIAC_VOWELS.map((vk) => (
                    <button
                      key={vk.name}
                      type="button"
                      onClick={() => insertChar(vk.char)}
                      onMouseEnter={() => setVowelOverlayInfo(vk)}
                      className="p-2 py-2 bg-[#FAF9F5] hover:bg-amber-50 hover:border-amber-400/50 border border-stone-200/50 rounded-xl transition-all font-mono active:scale-90 text-center flex flex-col items-center justify-between cursor-pointer group"
                    >
                      <span className="text-xl font-bold text-stone-800 font-aramaic group-hover:scale-110 duration-150">
                        ◌{vk.char}
                      </span>
                      <span className="text-[9px] text-stone-500 group-hover:text-amber-800 mt-1 font-sans font-semibold">
                        {vk.transliteration}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section B: CONSONANTS (22 Letters) */}
              <div className="space-y-2">
                <span className="text-xxs font-mono font-bold text-stone-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-stone-100 pb-1">
                  <Keyboard className="w-3.5 h-3.5 text-[#3E3831]" />
                  2. Huruf Abjad / Konsonan Aramaik
                </span>

                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 xl:grid-cols-6 gap-2" style={{ direction: 'rtl' }}>
                  {ARAMAIC_ALPHABET.map((item) => (
                    <button
                      key={item.char}
                      type="button"
                      onClick={() => insertChar(item.char)}
                      className="group relative flex flex-col items-center justify-center bg-[#FAF9F5] hover:bg-[#3E3831] hover:text-[#FAF9F5] border border-stone-200/80 h-14 rounded-xl transition-all active:scale-90 cursor-pointer"
                    >
                      <span className={`text-xl md:text-2xl font-bold group-hover:scale-110 transition-transform ${getFontClass()} text-stone-800 group-hover:text-amber-200`}>
                        {item.char}
                      </span>
                      <span className="text-[9px] font-mono text-stone-400 group-hover:text-stone-300 mt-1 uppercase tracking-tight">
                        {item.transliteration}
                      </span>
                    </button>
                  ))}

                  {/* Additional Essential Keyboard Actions */}
                  <button
                    type="button"
                    onClick={() => insertChar(' ')}
                    className="col-span-2 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold border border-stone-200/85 text-xs rounded-xl h-14 cursor-pointer flex items-center justify-center active:scale-95 text-stone-600"
                  >
                    [ Spasi / Space ]
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleBackspace}
                    className="col-span-2 bg-stone-100 hover:bg-stone-200 font-bold border border-stone-200 text-xs rounded-xl h-14 cursor-pointer flex items-center justify-center active:scale-95 text-stone-700"
                  >
                    Hapus (Backspace)
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick Helper Badge */}
            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-stone-200/60 leading-relaxed text-xs text-stone-500">
              <HelpCircle className="w-4 h-4 text-[#8B7355] inline mr-1.5 -mt-0.5" />
              <span>
                <strong>Pembelajaran Mandiri:</strong> Gunakan keyboard di atas untuk mengetik huruf konsonan, lalu ikuti dengan mengklik penanda vokal (kanoone) agar tersemat sempurna sesuai sistem pengenalan fonik kosakata Aram kuno.
              </span>
            </div>
          </div>

        </div>
      )}

      {/* DRAWING FREEHAND MODE LAYOUT */}
      {boardMode === 'drawing' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Left Control Column */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Guide Selection Dropdown */}
              <div>
                <label className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                  Template Panduan Huruf
                </label>
                <select
                  value={selectedLetter.char}
                  onChange={(e) => {
                    const matched = ARAMAIC_ALPHABET.find(l => l.char === e.target.value);
                    if (matched) setSelectedLetter(matched);
                  }}
                  className="w-full bg-[#FAF9F5] hover:bg-[#FAF9F5]/85 border border-stone-200 rounded-xl px-3 py-2 text-sm text-[#3E3831] font-medium transition-all select-none outline-none focus:ring-1 focus:ring-[#8B7355]"
                >
                  {ARAMAIC_ALPHABET.map((item) => (
                    <option key={item.char} value={item.char}>
                      {item.char} - {item.transliteration} (Nilai: {item.numericalValue})
                    </option>
                  ))}
                </select>
              </div>

              {/* Brush Type Selector */}
              <div>
                <label className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                  Gaya Kuas / Pena
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBrushType('pen')}
                    className={`p-2 rounded-xl text-xs font-medium transition-colors border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      brushType === 'pen' ? 'bg-[#3E3831] text-[#FAF9F5] border-transparent' : 'bg-[#FAF9F5] hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    Pena Gel
                  </button>
                  <button
                    onClick={() => setBrushType('quill')}
                    className={`p-2 rounded-xl text-xs font-medium transition-colors border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      brushType === 'quill' ? 'bg-[#3E3831] text-[#FAF9F5] border-transparent' : 'bg-[#FAF9F5] hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Quill Klasik
                  </button>
                  <button
                    onClick={() => setBrushType('highlighter')}
                    className={`p-2 rounded-xl text-xs font-medium transition-colors border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      brushType === 'highlighter' ? 'bg-[#3E3831] text-[#FAF9F5] border-transparent' : 'bg-[#FAF9F5] hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    Stabilo
                  </button>
                  <button
                    onClick={() => setBrushType('eraser')}
                    className={`p-2 rounded-xl text-xs font-medium transition-colors border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      brushType === 'eraser' ? 'bg-[#3E3831] text-[#FAF9F5] border-transparent' : 'bg-[#FAF9F5] hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Penghapus
                  </button>
                </div>
              </div>

              {/* Ink Color Palette */}
              <div>
                <label className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                  Pilihan Tinta Aram
                </label>
                <div className="flex gap-2.5 flex-wrap">
                  {[
                    { hex: '#1C1611', name: 'Classic Charcoal' },
                    { hex: '#8B7355', name: 'Clay Wood Ocre' },
                    { hex: '#D97706', name: 'Gold Dust' },
                    { hex: '#B91C1C', name: 'Royal Cinnabar' },
                    { hex: '#065F46', name: 'Persian Jade' }
                  ].map(item => (
                    <button
                      key={item.hex}
                      onClick={() => {
                        setColor(item.hex);
                        if (brushType === 'eraser') setBrushType('pen');
                      }}
                      title={item.name}
                      style={{ backgroundColor: item.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        color === item.hex && brushType !== 'eraser' ? 'border-amber-500 scale-125 shadow-md' : 'border-[#E8E2D9]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Size Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
                    Ukuran Kuas: {brushSize}px
                  </label>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  step="2"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full accent-[#8B7355] bg-stone-100 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200/50 space-y-1">
              <span className="text-xxs font-mono text-stone-400 uppercase tracking-wider block">Dialek Font Aktif</span>
              <span className="text-xs font-bold text-stone-800 capitalize font-mono">{selectedFont}</span>
              <p className="text-[10px] text-stone-600 mt-1 leading-normal">
                Aksara disesuaikan secara real-time untuk mencocokkan gaya tulisan yang sedang Anda dalami.
              </p>
            </div>
          </div>

          {/* Center Canvas Grid */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between items-stretch gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-stone-600 uppercase tracking-wider">
                  KANVAS INTEGRAL Menulis
                </span>
              </div>

              {/* Guide Opacity Overlay Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGuide(!showGuide)}
                  className={`px-3 py-1 rounded-lg text-xxs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                    showGuide ? 'bg-[#8B7355]/10 text-[#8B7355]' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  Template Guide: {showGuide ? 'ON' : 'OFF'}
                </button>
                {showGuide && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setGuideOpacity(prev => Math.max(0.05, prev - 0.05))}
                      title="Kurangi ketebalan bayangan panduan"
                      className="p-1 px-1.5 text-stone-600 bg-stone-100 hover:bg-stone-200 active:scale-90 text-[10px] font-bold rounded"
                    >
                      -
                    </button>
                    <span className="text-[10px] font-mono text-stone-500 w-8 text-center border-stone-100 text-stone-600 bg-stone-50 py-0.5 rounded leading-none">
                      {Math.round(guideOpacity * 100)}%
                    </span>
                    <button
                      onClick={() => setGuideOpacity(prev => Math.min(0.6, prev + 0.05))}
                      title="Tambah ketebalan bayangan panduan"
                      className="p-1 px-1.5 text-stone-600 bg-stone-100 hover:bg-stone-200 active:scale-90 text-[10px] font-bold rounded"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Whiteboard Canvas Frame */}
            <div className="relative select-none border-2 border-stone-200 bg-[#FAF9F5] shadow-inner overflow-hidden cursor-crosshair rounded-xl flex items-center justify-center">
              
              {/* Template overlay centered dynamically with scalable design */}
              {showGuide && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span 
                    className={`text-[21rem] leading-none text-stone-400 select-none transition-all duration-300 ${getFontClass()}`}
                    style={{ opacity: guideOpacity, direction: 'rtl', transform: 'translateY(-10px)' }}
                  >
                    {selectedLetter.char}
                  </span>
                </div>
              )}

              {/* Custom Drawing Canvas */}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="z-10 w-full aspect-[4/3] block bg-transparent"
              />
            </div>

            {/* Canvas Actions Toolbelt */}
            <div className="flex justify-between items-center gap-2">
              <div className="flex gap-2">
                <button
                  onClick={undo}
                  disabled={history.length <= 1}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Undo coretan sebelumnya"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Undo
                </button>
                <button
                  onClick={clearCanvas}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-red-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Bersihkan seluruh isi kanvas"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Canvas
                </button>
              </div>

              <button
                onClick={downloadCanvasImage}
                disabled={canvasCleared}
                className="px-4 py-1.5 bg-[#8B7355] hover:bg-[#725E45] text-[#FAF9F5] font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                title="Unduh hasil tulisan tangan Anda sebagai file PNG"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Hasil (.png)
              </button>
            </div>
          </div>

          {/* Right Info and Character Profile Column */}
          <div className="lg:col-span-1 bg-[#FAF9F5] p-5 rounded-2xl border border-[#E8E2D9] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-[#8B7355] font-semibold text-sm">
                <Info className="w-4 h-4" />
                <span>Profil Karakter Terpilih</span>
              </div>

              <div className="mt-4 text-center py-4 bg-white/60 border border-stone-200/50 rounded-2xl">
                <span className={`text-6xl font-bold text-[#3E3831] ${getFontClass()}`}>{selectedLetter.char}</span>
                <h3 className="text-md font-bold text-[#3E3831] mt-2 font-serif">{selectedLetter.transliteration}</h3>
                <p className="text-[10px] font-mono text-stone-500 mt-1">{selectedLetter.syriacCharCodes}</p>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-stone-700">
                <div>
                  <span className="font-mono text-xxs font-bold text-stone-400 uppercase">Arti Simbolik</span>
                  <p className="mt-0.5 text-stone-700 leading-relaxed font-serif text-xs">{selectedLetter.meaning}</p>
                </div>
                
                <div>
                  <span className="font-mono text-xxs font-bold text-stone-400 uppercase">Pelafalan Tradisional</span>
                  <p className="mt-0.5 text-[#3E3831] font-medium leading-relaxed font-mono text-xs">{selectedLetter.phoneme}</p>
                </div>

                <div>
                  <span className="font-mono text-xxs font-bold text-stone-400 uppercase">Nilai Gematria Abjad</span>
                  <p className="mt-0.5 text-[#8B7355] font-bold font-mono text-sm">{selectedLetter.numericalValue}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200/60 pt-4 mt-2">
              <span className="text-[10px] text-stone-500 italic block leading-relaxed">
                💡 Tip: Ubah-ubah gaya kuas di kolom kiri untuk melatih teknik goresan datar ("flat pen") klasik khas peninggalan sastra naskah kuno Mesopotamian.
              </span>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
