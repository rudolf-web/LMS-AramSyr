import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, Layers, Volume2, Video, 
  FileText, CheckCircle, Clock, Send, Sparkles, Check, Play, ChevronRight, RefreshCw, PenTool,
  Printer, X, ExternalLink, Lock, Eye, AlertTriangle, Columns, Code2, ChevronDown,
  MessageSquare, Bot
} from 'lucide-react';
import { 
  Letter, Material, Assignment, Submission, QuizQuestion, FontStyle, UserProgress 
} from '../types';
import { ARAMAIC_ALPHABET } from '../data/alphabet';
import { playAncientTone, speakLetterName } from '../utils/audioSynth';
import { getBiblicalPassage, getModuleQuestions, ModuleQuestion } from '../data/moduleQuizzes';
import CanvasTracer from './CanvasTracer';
import AramaicKeyboard from './AramaicKeyboard';
import WhiteboardAramaic from './WhiteboardAramaic';

// Helper function to render body text with flexible media layouts
function renderBodyTextWithMedia(bodyText: string, resources: any[]) {
  if (!resources || resources.length === 0) {
    return {
      nodes: (
        <div className="whitespace-pre-line text-xs leading-relaxed font-serif text-stone-700">
          {bodyText}
        </div>
      ),
      renderedInlineIds: new Set<string>()
    };
  }

  // Regex to match tags like: [media-1], [media-2:left], [media-3:right], [media-3:center], etc.
  const regex = /(\[media-\d+(?::(?:left|right|center|full))?\])/gi;
  const parts = bodyText.split(regex);
  const renderedInlineIds = new Set<string>();

  const nodes = parts.map((part, index) => {
    const match = part.match(/\[media-(\d+)(?::([a-zA-Z]+))?\]/i);
    if (match) {
      const resourceIndex = parseInt(match[1], 10) - 1; // 1-based index to 0-based
      const alignment = (match[2] || 'center').toLowerCase();

      if (resourceIndex >= 0 && resourceIndex < resources.length) {
        const res = resources[resourceIndex];
        renderedInlineIds.add(res.id);

        let alignClass = "w-full my-6 clear-both"; // Center alignment by default
        if (alignment === 'left') {
          alignClass = "float-left md:w-1/2 w-full mr-5 mb-5 mt-1.5 clear-left";
        } else if (alignment === 'right') {
          alignClass = "float-right md:w-1/2 w-full ml-5 mb-5 mt-1.5 clear-right";
        }

        return (
          <div 
            key={`inline-res-${index}`} 
            className={`${alignClass} select-none relative z-10 non-prose`}
            id={`res-inline-${res.id}`}
          >
            {/* Elegant container card for inline resource */}
            <div className="bg-white border text-left border-[#E8E2D9] rounded-2xl p-4.5 space-y-4 shadow-3xs relative overflow-hidden">
              
              {/* Flexible visual banner */}
              <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-2 flex-wrap gap-1.5">
                <span className="text-[9px] font-mono font-black text-[#8B7355] uppercase tracking-wider block">
                  {res.type === 'video' ? '📺 VIDEO' : res.type === 'audio' ? '🎵 AUDIO' : res.type === 'document' ? '📂 DOKUMEN' : res.type === 'iframe' ? '🔗 EMBED' : res.type === 'html' ? '💻 WIDGET' : '🌐 LINK'}
                </span>
                <span className="text-[8px] bg-[#8B7355]/10 text-[#8B7355] px-2 py-0.5 rounded font-mono font-extrabold uppercase">
                  {alignment}
                </span>
              </div>
              
              <h5 className="text-[11px] font-bold text-stone-700 tracking-wide">{res.title}</h5>

              {/* Video */}
              {res.type === 'video' && res.url && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-3xs [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!border-0">
                  {res.url.trim().startsWith('<iframe') ? (
                    <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: res.url }} />
                  ) : (
                    <iframe
                      src={res.url}
                      title={res.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  )}
                </div>
              )}

              {/* Audio */}
              {res.type === 'audio' && res.url && (
                <div className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E8E2D9] flex items-center gap-2 max-w-full shadow-4xs">
                  <div className="p-1.5 bg-[#8B7355]/15 text-[#8B7355] rounded-full shrink-0">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <audio controls src={res.url} className="w-full focus:outline-none text-xs scale-90" />
                  </div>
                </div>
              )}

              {/* Document */}
              {res.type === 'document' && res.url && (
                <div className="flex flex-col gap-2 bg-[#FAF9F5]/70 p-2.5 rounded-xl border border-[#E8E2D9] w-full shadow-4xs text-left">
                  <div className="min-w-0 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="text-[10px] font-bold text-stone-700 truncate block">{res.title}</span>
                  </div>
                  <a
                    href={res.url}
                    download={res.url.startsWith('data:') ? res.title : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-1.5 bg-[#8B7355] hover:bg-[#5E584E] text-white rounded-lg text-[9px] font-bold transition-all active:scale-95 cursor-pointer block"
                  >
                    Buka / Unduh Dokumen
                  </a>
                </div>
              )}

              {/* Iframe */}
              {res.type === 'iframe' && res.url && (() => {
                const isRawIframe = res.url.trim().startsWith('<iframe') || res.url.trim().includes('<iframe');
                let iframeBlocks: string[] = [];
                if (isRawIframe) {
                  const regex = /<iframe[\s\S]*?<\/iframe>/gi;
                  iframeBlocks = res.url.match(regex) || [res.url];
                } else {
                  iframeBlocks = [res.url];
                }
                return (
                  <div className="w-full flex flex-col gap-2">
                    {iframeBlocks.map((iframeMarkup, idx) => (
                      <div key={idx} className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-[#E8E2D9] shadow-4xs [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!border-0">
                        {isRawIframe ? (
                          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: iframeMarkup }} />
                        ) : (
                          <iframe src={iframeMarkup} title={res.title} className="w-full h-full" allowFullScreen />
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* HTML */}
              {res.type === 'html' && res.url && (
                <div className="w-full p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E8E2D9] shadow-inner text-[11px] text-stone-800 leading-relaxed overflow-x-auto">
                  <div dangerouslySetInnerHTML={{ __html: res.url }} />
                </div>
              )}

              {/* Web link */}
              {res.type === 'web_link' && res.url && (
                <div className="flex flex-col gap-2 bg-[#FAF9F5]/70 p-2.5 rounded-xl border border-[#E8E2D9] w-full shadow-4xs text-left">
                  <div className="min-w-0 flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="text-[10px] font-bold text-stone-700 truncate block">{res.title}</span>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-1.5 bg-[#8B7355] hover:bg-[#5E584E] text-white rounded-lg text-[9px] font-bold transition-all active:scale-95 cursor-pointer block"
                  >
                    Buka Tautan Eksternal
                  </a>
                </div>
              )}

            </div>
          </div>
        );
      }
    }

    return <span key={`text-${index}`} className="whitespace-pre-wrap">{part}</span>;
  });

  return {
    nodes: (
      <div className="flow-root font-serif text-stone-700 leading-relaxed text-xs">
        {nodes}
      </div>
    ),
    renderedInlineIds
  };
}

interface DashboardStudentProps {
  studentName: string;
  studentId: string;
  materials: Material[];
  assignments: Assignment[];
  submissions: Submission[];
  onSubmitAssignment: (assignmentId: string, answerText: string) => void;
  quizQuestions: QuizQuestion[];
  selectedFont: FontStyle;
  onChangeFont: (font: FontStyle) => void;
  progress: UserProgress;
  onCompleteMaterial: (materialId: string) => void;
  onCompleteLetter: (letterChar: string) => void;
  onCompleteQuiz: (quizId: string, score: number) => void;
  isDemo?: boolean;
}

export default function DashboardStudent({
  studentName,
  studentId,
  materials,
  assignments,
  submissions,
  onSubmitAssignment,
  quizQuestions,
  selectedFont,
  onChangeFont,
  progress,
  onCompleteMaterial,
  onCompleteLetter,
  onCompleteQuiz,
  isDemo = false,
}: DashboardStudentProps) {
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'letters' | 'materials' | 'quiz' | 'assignments' | 'profile' | 'whiteboard'>('dashboard');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [materialsLevelOption, setMaterialsLevelOption] = useState<'A1' | 'A2' | 'B1' | 'ALL'>('A1');
  const [certZoom, setCertZoom] = useState(100);

  // Automatically fit certificate preview to user's device screen layout
  useEffect(() => {
    if (showCertificateModal) {
      const handleResize = () => {
        const width = window.innerWidth;
        if (width < 450) {
          setCertZoom(45); // Very small phones/Android/iOS packages
        } else if (width < 640) {
          setCertZoom(55); // Standard mobile phones
        } else if (width < 768) {
          setCertZoom(70); // Small tablets
        } else if (width < 1024) {
          setCertZoom(85); // Tablets & small MacBooks / laptop screens
        } else {
          setCertZoom(100); // Desktop setups
        }
      };

      // Set initial scale
      handleResize();

      // Listen for view resizes too
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [showCertificateModal]);

  // Mini-Quiz Module specific states
  const [selectedModuleAnswers, setSelectedModuleAnswers] = useState<{[questionId: string]: string}>({});
  const [moduleQuizFeedback, setModuleQuizFeedback] = useState<{[materialId: string]: { score: number, submitted: boolean, failed: boolean, explanationShown: boolean }}>({});

  // Letter screen states
  const [selectedLetter, setSelectedLetter] = useState<Letter>(ARAMAIC_ALPHABET[0]);

  // Quiz states
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState('');
  const [userTypedAnswer, setUserTypedAnswer] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Infinite Typing Sandbox states
  const [sandboxIdx, setSandboxIdx] = useState(2); // Start on random letter Beth
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxSubmitted, setSandboxSubmitted] = useState(false);
  const [sandboxCorrect, setSandboxCorrect] = useState(false);
  const [sandboxSessionScore, setSandboxSessionScore] = useState(0);

  // Keyboard state for typing assignments
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [assignmentTypingAnswers, setAssignmentTypingAnswers] = useState<{ [id: string]: string }>({});

  // Chatbot Assistant AI states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    {
      role: 'model',
      content: 'Shlama! Halo! Selamat datang di Platform Belajar Aramaik. Saya adalah **Asisten AI Aramaik Suryani** yang didukung oleh Gemini.\n\nBagaimana saya bisa membantu Anda hari ini? Anda dapat menanyakan tentang kosa kata, tata bahasa, cara pengucapan abjad, sejarah dialek, atau meminta terjemahan kalimat!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const chatBottomRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = chatInput.trim();
    if (!query || isChatLoading) return;

    // Append user message
    const updatedMessages = [...chatMessages, { role: 'user' as const, content: query }];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          history: updatedMessages.slice(0, -1), // Send history context
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setChatMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      } else {
        setChatMessages(prev => [
          ...prev, 
          { 
            role: 'model', 
            content: `⚠️ Gagal memproses permintaan: ${data.error || 'Terjadi masalah koneksi.'}` 
          }
        ]);
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          content: `⚠️ Gangguan Koneksi: Pastikan server backend Anda online. Error: ${err.message || err}` 
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSubmitModuleQuiz = (materialId: string, questions: ModuleQuestion[]) => {
    let correctCount = 0;
    let allAnswered = true;

    questions.forEach((q) => {
      const ans = selectedModuleAnswers[q.id];
      if (!ans) {
        allAnswered = false;
      } else if (ans === q.correctAnswer) {
        correctCount++;
      }
    });

    if (!allAnswered) {
      alert("Silakan lengkapi jawaban untuk ketiga pertanyaan kuis terlebih dahulu!");
      return;
    }

    const percentage = Math.round((correctCount / questions.length) * 100);
    const hasPassed = percentage >= 70;

    setModuleQuizFeedback(prev => ({
      ...prev,
      [materialId]: {
        score: percentage,
        submitted: true,
        failed: !hasPassed,
        explanationShown: true
      }
    }));

    if (hasPassed) {
      // Direct integration
      onCompleteQuiz(`module_quiz_${materialId}`, percentage);
      onCompleteMaterial(materialId);
    }
  };

  const handleResetModuleQuiz = (materialId: string, questions: ModuleQuestion[]) => {
    const updatedAnswers = { ...selectedModuleAnswers };
    questions.forEach((q) => {
      delete updatedAnswers[q.id];
    });
    setSelectedModuleAnswers(updatedAnswers);

    setModuleQuizFeedback(prev => ({
      ...prev,
      [materialId]: {
        score: 0,
        submitted: false,
        failed: false,
        explanationShown: false
      }
    }));
  };

  const handleLetterClick = (letter: Letter) => {
    setSelectedLetter(letter);
    // Play sound from custom AudioSynth
    playAncientTone(letter.numericalValue);
    speakLetterName(letter.name, letter.phoneme);
    
    // Auto-mark as completed/reviewed
    onCompleteLetter(letter.char);
  };

  const handleQuizAnswerSubmit = () => {
    const currentQuestion = quizQuestions[currentQuizIndex];
    let isCorrect = false;

    if (currentQuestion.type === 'transliteration') {
      isCorrect = userTypedAnswer.trim().toLowerCase() === currentQuestion.correctOption.toLowerCase();
    } else {
      isCorrect = userSelectedOption === currentQuestion.correctOption;
    }

    setIsAnswerCorrect(isCorrect);
    setShowExplanation(true);
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setUserSelectedOption('');
    setUserTypedAnswer('');
    setShowExplanation(false);
    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      // Finished all questions!
      setQuizFinished(true);
      const finalPercent = Math.round((quizScore / quizQuestions.length) * 100);
      onCompleteQuiz('general_quiz', finalPercent);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setUserSelectedOption('');
    setUserTypedAnswer('');
    setQuizScore(0);
    setQuizFinished(false);
    setShowExplanation(false);
  };

  // Sandbox typing evaluation logic
  const handleSandboxSubmit = () => {
    if (!sandboxInput.trim()) return;
    const currentLetter = ARAMAIC_ALPHABET[sandboxIdx];
    const isCorrect = sandboxInput.trim().toLowerCase() === currentLetter.transliteration.toLowerCase() || 
                      sandboxInput.trim().toLowerCase() === currentLetter.name.toLowerCase();
    
    setSandboxCorrect(isCorrect);
    setSandboxSubmitted(true);
    if (isCorrect) {
      setSandboxSessionScore(prev => prev + 10);
    }
  };

  const handleNextSandbox = () => {
    setSandboxInput('');
    setSandboxSubmitted(false);
    // Cycle to a random alphabet index
    const nextIdx = Math.floor(Math.random() * ARAMAIC_ALPHABET.length);
    setSandboxIdx(nextIdx);
  };

  // Keyboard integration for typing assignments
  const handleKeyClick = (char: string) => {
    if (!activeAssignmentId) return;
    setAssignmentTypingAnswers(prev => {
      const currentAnswer = prev[activeAssignmentId] || '';
      return { ...prev, [activeAssignmentId]: currentAnswer + char };
    });
  };

  const handleBackspace = () => {
    if (!activeAssignmentId) return;
    setAssignmentTypingAnswers(prev => {
      const currentAnswer = prev[activeAssignmentId] || '';
      return { ...prev, [activeAssignmentId]: currentAnswer.slice(0, -1) };
    });
  };

  const handleClear = () => {
    if (!activeAssignmentId) return;
    setAssignmentTypingAnswers(prev => ({ ...prev, [activeAssignmentId]: '' }));
  };

  const handleSendAssignment = (assignmentId: string) => {
    if (isDemo) {
      alert('🔒 Mode Tamu Publik Terbatas:\nAkun Contoh/Demo tidak dapat mengirimkan tugas secara resmi ke database Admin. Silakan buat akun pribadi gratis untuk mencoba fitur peninjauan tugas manual oleh Rudolf A. Luhukay!');
      return;
    }
    const answer = assignmentTypingAnswers[assignmentId] || '';
    if (!answer.trim()) return;
    onSubmitAssignment(assignmentId, answer);
    alert('Tugas berhasil dikumpulkan untuk ditinjau oleh Admin!');
  };

  // Compute stats
  const masteredLettersCount = progress.completedLetters.length;
  const masteredLettersPct = Math.round((masteredLettersCount / ARAMAIC_ALPHABET.length) * 100);
  const completedMaterialsCount = progress.completedMaterials.length;
  const completedMaterialsPct = Math.round((completedMaterialsCount / materials.length) * 100);
  
  const currentBestQuizScore = progress.quizScores['general_quiz'] || 0;

  // Font styling selector helper
  const getFontClassForText = () => {
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
    <div id="student-container" className="space-y-6">
      
      {/* Dynamic Font Styling Switcher Bar */}
      <div id="font-navigator-bar" className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#3E3831]">Ubah Gaya Font Aksara</h3>
          <p className="text-xs text-[#5E584E]">Semua huruf Aramaik di platform ini akan langsung menyesuaikan gaya penulisan terpilih!</p>
        </div>
        <div className="flex bg-[#F1EDE4] p-1 rounded-xl border border-[#E8E2D9]">
          <button
            onClick={() => onChangeFont('estrangelo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFont === 'estrangelo' ? 'bg-[#3E3831] text-[#FAF9F5] shadow-sm' : 'text-[#5E584E] hover:text-[#3E3831]'
            }`}
          >
            Estrangelo (Kuno/Formal)
          </button>
          <button
            onClick={() => onChangeFont('serto')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFont === 'serto' ? 'bg-[#3E3831] text-[#FAF9F5] shadow-sm' : 'text-[#5E584E] hover:text-[#3E3831]'
            }`}
          >
            Serto (Barat Kursif)
          </button>
          <button
            onClick={() => onChangeFont('madnkhaya')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFont === 'madnkhaya' ? 'bg-[#3E3831] text-[#FAF9F5] shadow-sm' : 'text-[#5E584E] hover:text-[#3E3831]'
            }`}
          >
            Madnkhaya (Timur Corak)
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="border-b border-[#E8E2D9]">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-[#3E3831] text-[#3E3831]'
                : 'border-transparent text-[#8B7355] hover:text-[#3E3831] hover:border-[#E8E2D9]'
            }`}
          >
            Dashboard & Progres
          </button>
          <button
            onClick={() => setActiveTab('letters')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none cursor-pointer ${
              activeTab === 'letters'
                ? 'border-[#3E3831] text-[#3E3831]'
                : 'border-transparent text-[#8B7355] hover:text-[#3E3831] hover:border-[#E8E2D9]'
            }`}
          >
            Kamus & Tracing Alfabet
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none cursor-pointer ${
              activeTab === 'materials'
                ? 'border-[#3E3831] text-[#3E3831]'
                : 'border-transparent text-[#8B7355] hover:text-[#3E3831] hover:border-[#E8E2D9]'
            }`}
          >
            Materi Pembelajaran
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none cursor-pointer ${
              activeTab === 'quiz'
                ? 'border-[#3E3831] text-[#3E3831]'
                : 'border-transparent text-[#8B7355] hover:text-[#3E3831] hover:border-[#E8E2D9]'
            }`}
          >
            Kuis Transliterasi
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'assignments'
                ? 'border-[#3E3831] text-[#3E3831]'
                : 'border-transparent text-[#8B7355] hover:text-[#3E3831] hover:border-[#E8E2D9]'
            }`}
          >
            Tugas / Lembar Jawab ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'whiteboard'
                ? 'border-[#3E3831] text-[#3E3831]'
                : 'border-transparent text-[#8B7355] hover:text-[#3E3831] hover:border-[#E8E2D9]'
            }`}
          >
            🎨 Papan Tulis Aram
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-[#3E3831] text-[#3E3831]'
                : 'border-transparent text-[#8B7355] hover:text-[#3E3831] hover:border-[#E8E2D9]'
            }`}
          >
            Profil & Pengaturan
          </button>
        </nav>
      </div>

      {/* CORE VIEW ROUTER */}
      
      {/* 1. STUDENT DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div id="student-dashboard" className="space-y-6">
          
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-[#3E3831] to-[#524B42] text-[#FAF9F5] p-6 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
              <span className="text-[12rem] font-bold font-aramaic text-[#FAF9F5]">ܐ</span>
            </div>
            <div className="relative z-10 space-y-2">
              <span className="p-1 px-3 bg-[#FAF9F5]/20 text-[#FAF9F5] text-xxs font-mono rounded-full uppercase tracking-widest font-semibold">
                Siswa Aktif • Ksatria Kasdim
              </span>
              <h2 className="text-2xl font-bold font-serif">Salam Kedamaian, {studentName}!</h2>
              <p className="text-sm text-[#E8E2D9] max-w-xl">
                Lanjutkan studi aksara Aramaik Anda hari ini. Telah disediakan rangkaian abjad interaktif, pelafalan audio orisinal, serta kuis penilaian transliterasi guna mengukur kemajuan Anda.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#FAF9F5]">
                <span>Streak Belajar: <strong>🔥 {progress.streakDays} Hari</strong></span>
                <span>•</span>
                <span>Status Akun: <strong>Prestige Member</strong></span>
              </div>
            </div>
          </div>

          {/* Progress Tracker Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Letters Progress */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-medium text-[#8B7355] uppercase tracking-wide">Penguasaan Abjad</span>
                  <Layers className="w-5 h-5 text-[#8B7355]" />
                </div>
                <h3 className="text-2xl font-bold mt-2 text-[#3E3831]">{masteredLettersCount} <span className="text-xs text-[#5E584E] font-normal">dari 22 Huruf</span></h3>
                <p className="text-xs text-[#5E584E] mt-1">Selesai dieksplorasi beserta pelafalan virtual audio.</p>
              </div>
              <div>
                <div className="w-full bg-[#FAF9F5] h-2 rounded-full overflow-hidden border border-[#E8E2D9]">
                  <div className="bg-[#8B7355] h-full rounded-full transition-all duration-500" style={{ width: `${masteredLettersPct}%` }} />
                </div>
                <span className="text-xxs font-mono text-[#8B7355] mt-1.5 block text-right font-bold">{masteredLettersPct}% Rampung</span>
              </div>
            </div>

            {/* Materials Completion Progress */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-medium text-[#8B7355] uppercase tracking-wide">Modul Pembelajaran</span>
                  <BookOpen className="w-5 h-5 text-[#8B7355]" />
                </div>
                <h3 className="text-2xl font-bold mt-2 text-[#3E3831]">{completedMaterialsCount} <span className="text-xs text-[#5E584E] font-normal">dari {materials.length} Sesi</span></h3>
                <p className="text-xs text-[#5E584E] mt-1">Bacaan, dokumen, serta rekaman audio yang ditandai selesai.</p>
              </div>
              <div>
                <div className="w-full bg-[#FAF9F5] h-2 rounded-full overflow-hidden border border-[#E8E2D9]">
                  <div className="bg-[#8B7355] h-full rounded-full transition-all duration-500" style={{ width: `${completedMaterialsPct}%` }} />
                </div>
                <span className="text-xxs font-mono text-[#8B7355] mt-1.5 block text-right font-bold">{completedMaterialsPct}% Selesai</span>
              </div>
            </div>

            {/* Quiz Performance Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-medium text-[#8B7355] uppercase tracking-wide">Skor Ujian Transliterasi</span>
                  <Award className="w-5 h-5 text-[#8B7355]" />
                </div>
                <h3 className="text-2xl font-bold mt-2 text-[#3E3831]">{currentBestQuizScore}%</h3>
                <p className="text-xs text-[#5E584E] mt-1">Skor tertinggi yang diraih dari modul kuis interaktif.</p>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#E8E2D9]">
                <span className="text-[#8B7355] font-medium">Status Kelulusan:</span>
                <span className={`font-bold ${currentBestQuizScore >= 60 ? 'text-emerald-700' : 'text-[#8B7355]'}`}>
                  {currentBestQuizScore >= 60 ? 'Memuaskan (Lulus)' : 'Harus Berlatih'}
                </span>
              </div>
            </div>

          </div>

          {/* Quick Study Actions section */}
          <div className="bg-[#FAF9F5] p-5 rounded-3xl border border-[#E8E2D9] grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-[#3E3831] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8B7355]" />
                Rekomendasi Agenda Belajar Hari Ini
              </h4>
              <p className="text-xs text-[#5E584E] mt-1.5 leading-relaxed">
                Platform menyarankan Anda menyelesaikan penulisan pada tab <strong>Kamus & Tracing</strong> untuk huruf <strong>{selectedLetter.transliteration} ({selectedLetter.char})</strong> untuk mendaratkan pemahaman stroke menulis kanan-ke-kiri.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setActiveTab('letters')}
                  className="px-4 py-2 bg-[#3E3831] hover:bg-[#2D2823] text-[#FAF9F5] text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Buka Tracing Canvas
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-4 py-2 bg-white hover:bg-stone-100 border border-[#E8E2D9] text-[#3E3831] text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Ambil Kuis Singkat
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-center bg-white p-4 rounded-2xl border border-stone-200/50">
              <span className="text-xxs font-mono text-stone-400 uppercase tracking-widest block">Sertifikat Digital Kemahiran</span>
              <div className="flex items-center gap-3 mt-2">
                <Award className={`w-10 h-10 ${completedMaterialsPct === 100 ? 'text-amber-500 animate-bounce' : 'text-stone-300'}`} />
                <div>
                  <h5 className="text-xs font-bold text-stone-800">Sertifikat "Aramaic Novice"</h5>
                  <p className="text-xxs text-stone-500">Akan terbuka jika Anda menyelesaikan 100% modul pelajaran dan lulus kuis.</p>
                </div>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${(completedMaterialsPct + masteredLettersPct) / 2}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ALPHABET DICTIONARY & TRACING */}
      {activeTab === 'letters' && (
        <div id="alphabet-dictionary" className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm">
            <h3 className="text-base font-bold text-[#3E3831] font-serif">Kamus Abjad & Pengucapan Virtual Audio</h3>
            <p className="text-xs text-[#5E584E] mt-1">
              Klik pada masing-masing huruf di bawah ini untuk mendengarkan sintesis audio pelafalan orisinal beserta visualisasi maknanya.
            </p>
 
            {/* Letters Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-3 mt-5" style={{ direction: 'rtl' }}>
              {ARAMAIC_ALPHABET.map((item) => {
                const isMastered = progress.completedLetters.includes(item.char);
                const isSelected = selectedLetter.char === item.char;
                return (
                  <button
                    key={item.char}
                    onClick={() => handleLetterClick(item)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[#8B7355]/10 border-[#8B7355] ring-1 ring-[#8B7355] shadow-sm'
                        : 'bg-stone-50 hover:bg-stone-100 border-[#E8E2D9] hover:border-[#8B7355]/40'
                    }`}
                  >
                    {isMastered && (
                      <span className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5" style={{ direction: 'ltr' }}>
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}

                    <span className={`text-3xl font-extrabold ${getFontClassForText()} ${isSelected ? 'text-[#8B7355]' : 'text-stone-800'}`}>
                      {item.char}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-500 mt-1.5 uppercase tracking-wide">
                      {item.transliteration}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Detail Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Details Panel */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#8B7355] uppercase tracking-widest block font-bold">Huruf Aktif</span>
                    <h3 className="text-2xl font-black text-[#3E3831] font-serif">
                      {selectedLetter.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Audio Player Buttons */}
                    <button
                      onClick={() => {
                        playAncientTone(selectedLetter.numericalValue);
                        speakLetterName(selectedLetter.name, selectedLetter.phoneme);
                      }}
                      className="p-3 bg-[#8B7355] hover:bg-[#5E584E] text-white rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                      title="Mainkan Audio"
                    >
                      <Volume2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Big Display Panel */}
                <div className="bg-[#FAF9F5] p-8 rounded-2xl border border-[#E8E2D9] flex flex-col items-center justify-center">
                  <span className={`text-[9rem] font-bold tracking-normal leading-none transform transition-transform duration-300 ${getFontClassForText()} text-[#3E3831]`}>
                    {selectedLetter.char}
                  </span>
                  <span className="text-xs text-[#8B7355] font-mono mt-4">Ragam {selectedFont.toUpperCase()}</span>
                </div>

                {/* Sub Metadata parameters */}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FAF9F5] p-2.5 rounded-lg border border-[#E8E2D9]">
                      <span className="text-[10px] text-[#8B7355] font-mono block">Ekuivalen Latin</span>
                      <span className="text-sm font-semibold text-[#3E3831]">{selectedLetter.englishEquivalent}</span>
                    </div>
                    <div className="bg-[#FAF9F5] p-2.5 rounded-lg border border-[#E8E2D9]">
                      <span className="text-[10px] text-[#8B7355] font-mono block">Nilai Gematria</span>
                      <span className="text-sm font-semibold text-[#3E3831]">{selectedLetter.numericalValue}</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF9F5] p-3 rounded-lg border border-[#E8E2D9]">
                    <span className="text-[10px] text-[#8B7355] font-mono block">Arti Glif Sejarah</span>
                    <span className="text-xs font-medium text-[#423D33]">{selectedLetter.meaning}</span>
                  </div>

                  <div className="bg-[#FAF9F5] p-3 rounded-lg border border-[#E8E2D9]">
                    <span className="text-[10px] text-[#8B7355] font-mono block">Fonem Pelafalan</span>
                    <span className="text-xs font-semibold text-[#8B7355] font-mono">{selectedLetter.phoneme}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#5E584E] italic pt-4 border-t border-[#E8E2D9]">
                {selectedLetter.description}
              </div>
            </div>

            {/* Tracing Canvas Panel */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-sm flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[#8B7355]" />
                <div>
                  <h4 className="text-xs font-bold text-[#3E3831] uppercase tracking-wide">Papan Koreksi Menulis</h4>
                  <p className="text-xxs text-[#5E584E]">Latih ingatan otot tangan Anda dengan melukis karakter di bawah ini.</p>
                </div>
              </div>
              <CanvasTracer selectedLetter={selectedLetter} selectedFont={selectedFont} />
            </div>

          </div>
        </div>
      )}

      {/* 3. LEARNING MATERIALS LIST */}
      {activeTab === 'materials' && (
        <div id="learning-materials" className="space-y-6 animate-fade-in">
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#3E3831] font-serif">Modul Belajar Authentic Aramaic</h3>
              <p className="text-xs text-[#5E584E]">
                Setiap kali Anda menuntaskan membaca atau menonton materi, tekan tombol "Tandai Selesai" untuk menambah persentase kelulusan Anda.
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200/50 px-3.5 py-1.5 rounded-xl text-center md:text-right">
              <span className="text-[10px] text-amber-950/80 font-mono block">Progres Pembelajaran</span>
              <span className="text-xs font-extrabold text-[#3E3831] font-mono">
                {progress.completedMaterials?.length || 0} / {materials.length} Selesai
              </span>
            </div>
          </div>

          {/* Level Filter Sub-tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#FCFAF5] rounded-xl border border-[#E8E2D9]">
            <button
              onClick={() => setMaterialsLevelOption('A1')}
              className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-lg text-xxs font-extrabold uppercase transition-all tracking-wide cursor-pointer ${
                materialsLevelOption === 'A1'
                  ? 'bg-amber-800 text-[#FAF9F5] shadow-xs'
                  : 'text-[#5E584E] hover:bg-stone-100 hover:text-[#3E3831]'
              }`}
            >
              ⭐ Level A1 (Modul 1-20)
            </button>
            <button
              onClick={() => setMaterialsLevelOption('A2')}
              className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-lg text-xxs font-extrabold uppercase transition-all tracking-wide cursor-pointer ${
                materialsLevelOption === 'A2'
                  ? 'bg-amber-800 text-[#FAF9F5] shadow-xs'
                  : 'text-[#5E584E] hover:bg-stone-100 hover:text-[#3E3831]'
              }`}
            >
              🥈 Level A2 (Modul 21-35)
            </button>
            <button
              onClick={() => setMaterialsLevelOption('B1')}
              className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-lg text-xxs font-extrabold uppercase transition-all tracking-wide cursor-pointer ${
                materialsLevelOption === 'B1'
                  ? 'bg-amber-800 text-[#FAF9F5] shadow-xs'
                  : 'text-[#5E584E] hover:bg-stone-100 hover:text-[#3E3831]'
              }`}
            >
              🥇 Level B1 (Modul 36-50)
            </button>
            <button
              onClick={() => setMaterialsLevelOption('ALL')}
              className={`px-4 py-2.5 rounded-lg text-xxs font-extrabold uppercase transition-all tracking-wide cursor-pointer ${
                materialsLevelOption === 'ALL'
                  ? 'bg-amber-800 text-[#FAF9F5] shadow-xs'
                  : 'text-[#5E584E] hover:bg-stone-100 hover:text-[#3E3831]'
              }`}
            >
              Semua {materials.length}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {materials
              .filter((mat) => {
                if (materialsLevelOption === 'ALL') return true;
                if (materialsLevelOption === 'A1') return mat.title.includes('Level A1');
                if (materialsLevelOption === 'A2') return mat.title.includes('Level A2');
                if (materialsLevelOption === 'B1') return mat.title.includes('Level B1');
                return true;
              })
              .map((mat) => {
                const absoluteIndex = materials.findIndex((m) => m.id === mat.id);
                const isUnlocked = absoluteIndex === 0 || (!isDemo && ((progress.quizScores[`module_quiz_${materials[absoluteIndex - 1].id}`] || 0) >= 70));
                const isCompleted = progress.completedMaterials.includes(mat.id);
                const quizScore = progress.quizScores[`module_quiz_${mat.id}`] || 0;
                const isPassed = quizScore >= 70;

                const parsedBody = mat.bodyText 
                  ? renderBodyTextWithMedia(mat.bodyText, mat.additionalResources || []) 
                  : null;

                if (!isUnlocked) {
                  const prevModule = materials[absoluteIndex - 1];
                  return (
                    <div key={mat.id} className="bg-stone-50 border-2 border-dashed border-[#E8E2D9] p-6 rounded-2xl flex flex-col md:flex-row items-center gap-5 transition-all opacity-90 select-none">
                      <div className="p-4 bg-amber-500/10 border border-amber-950/10 text-amber-800 rounded-2xl flex-shrink-0">
                        <Lock className="w-8 h-8 text-[#8B7355]" />
                      </div>
                      <div className="space-y-1 text-center md:text-left flex-1">
                        <span className="px-2 py-0.5 bg-stone-200 text-stone-600 text-[9px] font-mono font-bold rounded uppercase tracking-wider">
                          Modul Terkunci
                        </span>
                        <h4 className="text-sm font-bold text-stone-500 font-sans mt-1">
                          {mat.title}
                        </h4>
                        <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
                          Selesaikan dan Lulus <span className="font-bold text-[#8B7355]">{prevModule.title}</span> dengan skor minimal 70% pada ujian kompetensi di bagian bawah materi tersebut terlebih dahulu untuk membuka kunci materi murni ini.
                        </p>
                      </div>
                      <div className="flex-shrink-0 bg-white border border-[#E8E2D9] px-3.5 py-2 rounded-xl text-[10px] font-mono font-semibold text-stone-500">
                        Skor Prasyarat: {progress.quizScores[`module_quiz_${prevModule.id}`] || 0}% / 70%
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={mat.id} className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D9] pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-[#FAF9F5] text-[#8B7355] border border-[#E8E2D9] text-[10px] font-mono font-bold rounded">
                            {mat.category}
                          </span>
                          <span className="text-xxs text-[#8B7355] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#8B7355]" />
                            {mat.estimatedMinutes} Menit
                          </span>
                          {isPassed ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-mono font-extrabold rounded flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              LULUS EVALUASI ({quizScore}%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-mono font-bold rounded flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              BELUM LULUS KUIS (SKOR: {quizScore}%)
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-[#3E3831] flex items-center gap-1.5 font-serif">
                          {mat.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => onCompleteMaterial(mat.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#FAF9F5] hover:bg-stone-100 text-stone-700 border border-[#E8E2D9]'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            Sudah Dibaca
                          </>
                        ) : (
                          'Tandai Telah Dibaca'
                        )}
                      </button>
                    </div>

                    {/* Material Description */}
                    <p className="text-xs text-stone-600 font-normal italic">
                      {mat.description}
                    </p>

                    {/* Elegant Isolated Material Media Unit */}
                    <div className="bg-[#FAF9F5]/40 border border-[#E8E2D9] rounded-2xl p-4 sm:p-6 shadow-3xs space-y-4 relative isolate overflow-hidden clear-both max-w-full">
                      <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                          <span className="text-[10px] font-mono font-extrabold text-[#8B7355] uppercase tracking-wider block text-left">
                            BAHAN AJAR UTAMA ({mat.type.toUpperCase()})
                          </span>
                        </div>
                        <span className="text-[9px] text-stone-400 font-mono">
                          ID: {mat.id}
                        </span>
                      </div>

                      {/* Embeds based on material type */}
                      {mat.type === 'video' && mat.contentUrl && (
                        <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden border border-[#E8E2D9] bg-black shadow-md mt-4 mb-4 relative isolate clear-both [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!max-w-full [&_iframe]:!max-h-full [&_iframe]:!border-0">
                          {mat.contentUrl.trim().startsWith('<iframe') ? (
                            <div 
                              className="w-full h-full"
                              dangerouslySetInnerHTML={{ __html: mat.contentUrl }}
                            />
                          ) : (
                            <iframe
                              src={mat.contentUrl}
                              title={mat.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                        </div>
                      )}

                      {mat.type === 'audio' && mat.contentUrl && (
                        <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] flex items-center gap-4 max-w-md shadow-3xs relative isolate clear-both mt-4">
                          <div className="p-3 bg-[#8B7355] text-white rounded-full shrink-0 shadow-sm animate-[pulse_3s_infinite]">
                            <Volume2 className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-[#8B7355] font-mono uppercase block font-bold text-left">Audio Pembelajaran Mandiri</span>
                            <span className="text-xxs text-stone-500 font-bold block truncate mb-1 text-left">Cek pelafalan vokal dan aksara</span>
                            <audio controls src={mat.contentUrl} className="w-full mt-1.5 focus:outline-none" />
                          </div>
                        </div>
                      )}

                      {mat.type === 'document' && mat.contentUrl && (
                        <div className="space-y-4 w-full max-w-4xl relative isolate clear-both mt-4">
                          {/* If PDF, show on-page preview */}
                          {mat.contentUrl.includes('.pdf') || mat.contentUrl.startsWith('data:application/pdf') ? (
                            <div className="w-full border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs bg-white">
                              <div className="p-3 bg-[#FAF9F5] border-b border-[#E8E2D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <span className="text-[10px] font-bold text-[#3E3831] flex items-center gap-1.5 font-serif uppercase tracking-wide">
                                  <FileText className="w-4 h-4 text-emerald-600 font-bold" />
                                  Reader Dokumen PDF Tersemat
                                </span>
                                <a
                                  href={mat.contentUrl}
                                  download={`${mat.title.replace(/\s+/g, '-').slice(0, 30)}.pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] bg-[#8B7355] text-white hover:bg-[#5E584E] px-3.5 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                                >
                                  Unduh PDF
                                </a>
                              </div>
                              <div className="relative w-full aspect-video overflow-hidden bg-stone-100">
                                <iframe
                                  src={mat.contentUrl}
                                  title={mat.title}
                                  className="absolute inset-0 w-full h-full border-0"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-xl shadow-3xs">
                              <div className="flex items-center gap-3.5">
                                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-2xs">
                                  <FileText className="w-7 h-7" />
                                </div>
                                <div className="space-y-0.5 text-left">
                                  <span className="text-xs font-bold text-[#3E3831] font-serif block">Bahan Bacaan & Lembar Kerja Siswa</span>
                                  <span className="text-[10px] text-[#5E584E] block">
                                    {mat.contentUrl.startsWith('data:') ? '📂 Dokumen lokal (Word / Excel / Slide)' : '🔗 Dokumen Web / Tautan Berbagi'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto justify-end">
                                <a
                                  href={mat.contentUrl}
                                  download={mat.contentUrl.startsWith('data:') ? 'Modul-Materi' : undefined}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-[#3E3831] hover:bg-[#2D2823] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 text-center justify-center w-full sm:w-auto shadow-xs"
                                >
                                  Unduh / Buka Dokumen
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {mat.type === 'iframe' && mat.contentUrl && (() => {
                        const isRawIframe = mat.contentUrl.trim().startsWith('<iframe') || mat.contentUrl.trim().includes('<iframe');
                        
                        let iframeBlocks: string[] = [];
                        if (isRawIframe) {
                          const regex = /<iframe[\s\S]*?<\/iframe>/gi;
                          iframeBlocks = mat.contentUrl.match(regex) || [mat.contentUrl];
                        } else {
                          iframeBlocks = [mat.contentUrl];
                        }

                        // Extract layout configuration options
                        const layoutH = mat.layoutConfig?.height || 'cinema';
                        const layoutRatio = mat.layoutConfig?.aspectRatio || '16:9';
                        const layoutStyle = mat.layoutConfig?.borderStyle || 'thin';
                        const layoutColor = mat.layoutConfig?.borderColor || '#E8E2D9';
                        const layoutGap = mat.layoutConfig?.gapSize || 'normal';

                        // Set ratio classes
                        let ratioClass = 'aspect-video';
                        if (layoutRatio === '4:3') ratioClass = 'aspect-[4/3]';
                        else if (layoutRatio === '21:9') ratioClass = 'aspect-[21/9]';
                        else if (layoutRatio === 'auto' || layoutH !== 'cinema') ratioClass = '';

                        // Set container height if not strictly aspect-ratio bound
                        let containerHeightStyle: React.CSSProperties = {};
                        if (layoutH === 'small') containerHeightStyle = { height: '280px' };
                        else if (layoutH === 'medium') containerHeightStyle = { height: '400px' };
                        else if (layoutH === 'large') containerHeightStyle = { height: '550px' };

                        // Border styling around frames
                        let frameBorderClass = 'border';
                        if (layoutStyle === 'none') frameBorderClass = 'border-0';
                        else if (layoutStyle === 'double') frameBorderClass = 'border-4 border-double';
                        else if (layoutStyle === 'thick') frameBorderClass = 'border-4';

                        // Gap values
                        let innerGapClass = 'gap-6';
                        let ptClass = 'pt-6';
                        if (layoutGap === 'none') {
                          innerGapClass = 'gap-0';
                          ptClass = 'pt-0';
                        } else if (layoutGap === 'compact') {
                          innerGapClass = 'gap-3';
                          ptClass = 'pt-3';
                        } else if (layoutGap === 'spacious') {
                          innerGapClass = 'gap-9';
                          ptClass = 'pt-9';
                        }

                        return (
                          <div className="w-full max-w-4xl rounded-2xl border border-[#E8E2D9] overflow-hidden bg-white shadow-xs mt-4 mb-4 relative isolate clear-both text-left">
                            <div className="p-3.5 bg-[#FAF9F5] border-b border-[#E8E2D9] flex justify-between items-center text-xs">
                              <span className="text-[10px] font-bold text-[#8B7355] uppercase font-mono tracking-wide flex items-center gap-1.5">
                                <Columns className="w-4 h-4 text-[#8B7355]" />
                                Materi Interaktif Tersemat (iFrame / 3D / Slideshow)
                              </span>
                              {!isRawIframe && (
                                <a 
                                  href={mat.contentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[9px] bg-white border border-[#E8E2D9] px-2.5 py-1 rounded-md text-[#8B7355] hover:underline font-bold transition-all"
                                >
                                  Buka Tab Baru
                                </a>
                              )}
                            </div>

                            {/* Instruksi Interaktif untuk Siswa */}
                            <div className="p-3.5 bg-amber-50/40 border-b border-[#E8E2D9] text-[10px] text-stone-600 block text-left space-y-1.5 leading-relaxed">
                              <span className="font-extrabold text-[#8B7355] block flex items-center gap-1">
                                <Sparkles className="w-4 h-4 text-[#8B7355] shrink-0" />
                                INSTRUKSI INTERAKSI & PENGATURAN TAMPILAN:
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <p>• <strong>Bila Tampilan Terpotong:</strong> Lakukan gerakan <strong>mencubit layar (pinch-to-zoom OUT)</strong> pada ponsel, atau gunakan scroll <strong>roda tetikus (mouse wheel)</strong> pada laptop untuk memperkecil/mengatur porsi bidang lembar 3D agar terlihat penuh.</p>
                                  <p>• <strong>Navigasi 360-Derajat:</strong> Klik/sentuh lalu <strong>seret (gesture drag)</strong> melingkar untuk berputar melihat bentuk huruf/peta kuno dari berbagai perspektif.</p>
                                </div>
                                <div className="space-y-1">
                                  <p>• <strong>Proporsional Responsif:</strong> Format presentasi di-render responsif sesuai aspek rasio (seperti {layoutRatio === 'auto' ? 'Bebas' : layoutRatio}) agar lebar-tinggi tampak natural.</p>
                                  <p>• <strong>Pemisah Modular:</strong> Setiap media disajikan dalam panel mandiri dipisahkan garis pembatas tipis sehingga tidak tumpang tindih.</p>
                                </div>
                              </div>
                            </div>

                            <div className={`p-4 sm:p-5 flex flex-col ${innerGapClass} bg-stone-50/50`}>
                              {iframeBlocks.map((iframeMarkup, idx) => {
                                return (
                                  <div 
                                    key={idx} 
                                    className={`${idx > 0 && layoutGap !== 'none' ? ptClass + ' border-t border-stone-200' : ''} flex flex-col gap-3`}
                                  >
                                    {iframeBlocks.length > 1 && (
                                      <div className="flex justify-between items-center bg-white border border-[#E8E2D9] px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#8B7355]">
                                        <span>🔗 Media Pendukung Tersemat #{idx + 1}</span>
                                        <span className="text-[8px] bg-stone-100 text-[#8B7355] px-2 py-0.5 rounded font-mono font-black">{layoutRatio === 'auto' ? 'AUTO' : layoutRatio} SCREEN</span>
                                      </div>
                                    )}

                                    <div 
                                      className={`relative w-full bg-black rounded-2xl overflow-hidden ${ratioClass} ${frameBorderClass} shadow-xs relative isolate clear-both [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!max-w-full [&_iframe]:!max-h-full [&_iframe]:!border-0`}
                                      style={{ borderColor: layoutColor, ...containerHeightStyle }}
                                    >
                                      {isRawIframe ? (
                                        <div 
                                          className="w-full h-full"
                                          dangerouslySetInnerHTML={{ __html: iframeMarkup }} 
                                        />
                                      ) : (
                                        <iframe 
                                          src={iframeMarkup} 
                                          className="w-full h-full" 
                                          allowFullScreen 
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
                                        />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="p-3.5 bg-[#FAF8F3] border-t border-[#E8E2D9] text-[10px] text-stone-500 font-sans italic text-left leading-relaxed">
                              💡 <strong>Interaksi Aktif:</strong> Anda dapat menggeser, memutar, atau memperbesar pemutar interaktif di atas menggunakan gestur sentuhan atau tetikus secara langsung.
                            </div>
                          </div>
                        );
                      })()}

                      {mat.type === 'html' && mat.contentUrl && (
                        <div className="w-full max-w-3xl p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E2D9] space-y-3.5 mt-2 shadow-inner text-left relative isolate clear-both">
                          <div className="flex items-center gap-2 border-b border-[#E8E2D9] pb-2">
                            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200/50 rounded-lg px-2.5 py-1 font-bold uppercase inline-block flex items-center gap-1">
                              <Code2 className="w-3.5 h-3.5" />
                              Aplikasi Simulasi Aramaik-Syriac Tersemat
                            </span>
                          </div>
                          <div 
                            className="w-full text-xs text-stone-800"
                            dangerouslySetInnerHTML={{ __html: mat.contentUrl }}
                          />
                        </div>
                      )}

                      {mat.type === 'web_link' && mat.contentUrl && (
                        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E2D9] shadow-3xs max-w-xl text-left space-y-4 mt-2 relative isolate clear-both">
                          <div className="flex gap-4">
                            <div className="p-3.5 bg-amber-500/10 text-amber-800 rounded-2xl shrink-0 self-start border border-amber-500/25">
                              <ExternalLink className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-[#8B7355] uppercase tracking-wider block">Sumber Pembelajaran Pihak Ketiga</span>
                              <h5 className="text-sm font-extrabold text-[#3E3831] font-serif leading-tight">{mat.title}</h5>
                              <p className="text-[11px] text-stone-600 leading-relaxed">
                                Materi permainan kuis, aktivitas, atau media ajar interaktif ini disediakan di situs web pihak ketiga tepercaya (seperti Quizizz, Kahoot, Assemblr, Mentimeter, dll.). Klik tombol di bawah untuk diarahkan dengan aman ke halaman baru.
                              </p>
                            </div>
                          </div>
                          <div className="pt-1 flex justify-end">
                            <a
                              href={mat.contentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4.5 py-2.5 bg-[#8B7355] hover:bg-[#5E584E] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                            >
                              Buka Media Pembelajaran
                              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Elegant Spaced Divider for Additional Resources */}
                    {mat.additionalResources && mat.additionalResources.filter((res) => !parsedBody?.renderedInlineIds.has(res.id)).length > 0 && (
                      <div className="my-10 border-t-2 border-dashed border-[#E8E2D9] relative select-none">
                        <div className="mt-8 grid grid-cols-1 gap-6">
                          {mat.additionalResources.filter((res) => !parsedBody?.renderedInlineIds.has(res.id)).map((res) => {
                            return (
                              <div key={res.id} className="bg-white border border-[#E8E2D9] rounded-2xl p-4 sm:p-5 space-y-4 shadow-3xs text-left relative isolate overflow-hidden clear-both max-w-full">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#E8E2D9] pb-2.5 gap-2">
                                  <h5 className="text-xs font-bold text-[#8B7355] text-center sm:text-left tracking-wider uppercase font-mono">{res.title}</h5>
                                </div>

                                {/* Video */}
                                {res.type === 'video' && res.url && (
                                  <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden border border-[#E8E2D9] bg-black shadow-md mt-2 relative isolate clear-both [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!max-w-full [&_iframe]:!max-h-full [&_iframe]:!border-0">
                                    {res.url.trim().startsWith('<iframe') ? (
                                      <div 
                                        className="w-full h-full"
                                        dangerouslySetInnerHTML={{ __html: res.url }}
                                      />
                                    ) : (
                                      <iframe
                                        src={res.url}
                                        title={res.title}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      />
                                    )}
                                  </div>
                                )}

                                {/* Audio */}
                                {res.type === 'audio' && res.url && (
                                  <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E8E2D9] flex items-center gap-3.5 max-w-md shadow-3xs mt-2">
                                    <div className="p-2.5 bg-[#8B7355]/15 text-[#8B7355] rounded-full shrink-0">
                                      <Volume2 className="w-4 h-4 animate-pulse" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                      <span className="text-[10px] text-stone-500 font-bold block mb-1 truncate">{res.title}</span>
                                      <audio controls src={res.url} className="w-full focus:outline-none" />
                                    </div>
                                  </div>
                                )}

                                {/* Document */}
                                {res.type === 'document' && res.url && (
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FAF9F5]/70 p-4 rounded-xl border border-[#E8E2D9] max-w-2xl shadow-3xs mt-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <FileText className="w-5 h-5 text-emerald-700 font-bold shrink-0" />
                                      <div className="min-w-0 block text-left">
                                        <span className="text-xs font-bold text-stone-700 block truncate">{res.title}</span>
                                        <span className="text-[10px] text-stone-500 block truncate">
                                          {res.url.startsWith('data:') ? '📂 Dokumen terunggah (Lokal)' : '🔗 Tautan Dokumen'}
                                        </span>
                                      </div>
                                    </div>
                                    <a
                                      href={res.url}
                                      download={res.url.startsWith('data:') ? res.title : undefined}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-4 py-2 bg-[#8B7355] text-white hover:bg-[#5E584E] rounded-xl text-xxs font-bold transition-all shrink-0 active:scale-95 text-center cursor-pointer shadow-3xs"
                                    >
                                      Buka / Unduh Dokumen
                                    </a>
                                  </div>
                                )}

                                {/* iframe */}
                                {res.type === 'iframe' && res.url && (() => {
                                  const isRawIframe = res.url.trim().startsWith('<iframe') || res.url.trim().includes('<iframe');
                                  let iframeBlocks: string[] = [];
                                  if (isRawIframe) {
                                    const regex = /<iframe[\s\S]*?<\/iframe>/gi;
                                    iframeBlocks = res.url.match(regex) || [res.url];
                                  } else {
                                    iframeBlocks = [res.url];
                                  }

                                  return (
                                    <div className="w-full flex flex-col gap-4 mt-2">
                                      {/* Small hint inside additional resource */}
                                      <div className="p-3 bg-[#FAF9F5] border-l-2 border-[#8B7355] text-[10px] text-stone-600 rounded-r-lg text-left block leading-relaxed space-y-0.5">
                                        <p className="font-extrabold text-[#8B7355]">💡 Tips Navigasi 16:9:</p>
                                        <p>• Bila model 3D terpotong, lakukan gerakan cubit jari (pinch) di HP atau scroll roda mouse untuk zoom out piringan objek.</p>
                                        <p>• Seret kursor untuk rotasi 3D. Setiap media di-render terpisah dan dibatasi garis tipis agar tidak tumpang tindih.</p>
                                      </div>
                                      <div className="flex flex-col gap-5 divide-y divide-[#E8E2D9]">
                                        {iframeBlocks.map((iframeMarkup, idx) => {
                                          return (
                                            <div key={idx} className={`${idx > 0 ? 'pt-5' : ''} flex flex-col gap-2 text-left`}>
                                              {iframeBlocks.length > 1 && (
                                                <span className="text-[9.5px] font-bold text-[#8B7355] block">
                                                  🔗 Sub-Media Tersemat #{idx + 1} (Rasio 16:9)
                                                </span>
                                              )}
                                              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-[#E8E2D9] shadow-3xs relative isolate clear-both [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!max-w-full [&_iframe]:!max-h-full [&_iframe]:!border-0">
                                                {isRawIframe ? (
                                                  <div 
                                                    className="w-full h-full"
                                                    dangerouslySetInnerHTML={{ __html: iframeMarkup }} 
                                                  />
                                                ) : (
                                                  <iframe 
                                                    src={iframeMarkup} 
                                                    title={res.title}
                                                    className="w-full h-full" 
                                                    allowFullScreen 
                                                  />
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* html */}
                                {res.type === 'html' && res.url && (
                                  <div className="w-full p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E2D9] shadow-inner relative isolate clear-both">
                                    <div 
                                      className="w-full text-xs text-stone-800"
                                      dangerouslySetInnerHTML={{ __html: res.url }}
                                    />
                                  </div>
                                )}

                                {/* web_link */}
                                {res.type === 'web_link' && res.url && (
                                  <div className="flex items-center justify-between gap-3 bg-[#FAF9F5]/70 p-4 rounded-xl border border-[#E8E2D9] max-w-2xl shadow-3xs">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <ExternalLink className="w-5 h-5 text-amber-700 shrink-0" />
                                      <div className="min-w-0 block text-left">
                                        <span className="text-xs font-bold text-stone-700 block truncate">{res.title}</span>
                                        <span className="text-[10px] text-stone-500 block truncate">{res.url}</span>
                                      </div>
                                    </div>
                                    <a
                                      href={res.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-4 py-2 bg-[#8B7355] text-white hover:bg-[#5E584E] rounded-xl text-xxs font-bold transition-all shrink-0 active:scale-95 text-center cursor-pointer shadow-3xs"
                                    >
                                      Buka Tautan Eksternal
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Core Body Text */}
                    {mat.bodyText && parsedBody && (
                      <div className="bg-[#FAF9F5] p-5 rounded-xl border border-stone-200/50 text-stone-700 text-xs leading-relaxed font-serif relative overflow-hidden clear-both">
                        {parsedBody.nodes}
                      </div>
                    )}

                    {/* Gorgeous Arabic/Aramaic Biblical Passage (Peshitta) Component */}
                    {(() => {
                      const passage = getBiblicalPassage(mat.id);
                      if (!passage) return null;
                      return (
                        <div className="mt-5 border border-amber-900/[0.12] bg-[#FAF8F3] p-5 rounded-2xl space-y-3 shadow-none">
                          <div className="flex items-center justify-between border-b border-amber-900/[0.08] pb-2">
                            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-[#8B7355]">
                              📖 Kutipan Kitab Suci Semesta (Peshitta Aramaik)
                            </span>
                            <span className="text-xxs font-serif text-stone-500 italic">
                              {passage.reference}
                            </span>
                          </div>
                          <div 
                            className={`text-xl md:text-2xl text-stone-900 text-right leading-relaxed ${getFontClassForText()}`} 
                            style={{ direction: 'rtl' }}
                          >
                            {passage.aramaicText}
                          </div>
                          <div className="text-xxs text-[#8B7355] font-mono leading-relaxed mt-1 italic">
                            Phonetik: "{passage.transliteration}"
                          </div>
                          <div className="text-xs text-stone-600 leading-relaxed font-sans mt-1">
                            <span className="font-semibold text-stone-700">Artinya:</span> "{passage.translation}"
                          </div>
                          <div className="bg-white/70 p-3 rounded-xl border border-[#E8E2D9] text-xxs text-stone-500 font-sans mt-2">
                            💡 <span className="font-bold text-stone-600 uppercase">Fokus Rangkuman Tata Bahasa:</span> {passage.theologicalNote}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Interactive Module Competency Quiz Component */}
                    {(() => {
                      const questions = getModuleQuestions(mat.id);
                      const feedback = moduleQuizFeedback[mat.id] || { 
                        score: quizScore, 
                        submitted: isPassed, 
                        failed: !isPassed && quizScore > 0, 
                        explanationShown: isPassed 
                      };

                      return (
                        <div className="mt-6 border-t border-dashed border-[#E8E2D9] pt-5 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h5 className="text-[11px] uppercase tracking-wider font-mono font-extrabold text-[#8B7355] flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-[#8B7355]" />
                              Ujian Kompetensi Modul (Syarat Lulus: ≥ 70%)
                            </h5>
                            {feedback.submitted && (
                              <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold rounded inline-flex items-center gap-1 ${
                                feedback.failed 
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                {feedback.failed ? '❌ Gagal' : '🎉 Lulus Evaluasi'} (Skor: {feedback.score}%)
                              </span>
                            )}
                          </div>

                          <div className="space-y-4">
                            {questions.map((q, idx) => {
                              const selectedOpt = selectedModuleAnswers[q.id];

                              return (
                                <div key={q.id} className="space-y-1.5 p-4 bg-stone-50/60 rounded-xl border border-stone-200/60 text-xs">
                                  <p className="font-bold text-stone-800">
                                    {idx + 1}. {q.question}
                                  </p>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
                                    {q.options.map((opt) => {
                                      const isSelected = selectedOpt === opt;
                                      const isCorrect = opt === q.correctAnswer;

                                      let btnStyle = "bg-white border-stone-200/80 hover:bg-stone-100 text-stone-700";
                                      if (isSelected) {
                                        btnStyle = "bg-stone-800 text-white border-stone-800";
                                      }
                                      if (feedback.submitted) {
                                        if (isCorrect) {
                                          btnStyle = "bg-emerald-50 text-emerald-700 border-emerald-300 pointer-events-none";
                                        } else if (isSelected) {
                                          btnStyle = "bg-rose-50 text-rose-700 border-rose-300 pointer-events-none";
                                        } else {
                                          btnStyle = "bg-white text-stone-400 border-stone-150 pointer-events-none";
                                        }
                                      }

                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => {
                                            if (feedback.submitted) return;
                                            setSelectedModuleAnswers(prev => ({ ...prev, [q.id]: opt }));
                                          }}
                                          className={`p-2.5 rounded-xl border text-left text-xs font-sans transition-all active:scale-[0.99] cursor-pointer ${btnStyle}`}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {feedback.explanationShown && (
                                    <div className="mt-3 text-xxs text-stone-500 bg-white p-3 rounded-lg border border-stone-150 font-serif whitespace-pre-line leading-relaxed">
                                      <span className="font-bold text-[#8B7355] block mb-0.5">Penjelasan Khazanah:</span>
                                      {q.explanation}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                            {!feedback.submitted ? (
                              <button
                                type="button"
                                onClick={() => handleSubmitModuleQuiz(mat.id, questions)}
                                className="px-4 py-2 bg-[#8B7355] hover:bg-[#5E584E] text-white rounded-xl text-xxs font-mono font-bold uppercase tracking-wide transition-all shadow-xs active:scale-95 cursor-pointer"
                              >
                                Kirim Jawaban Ujian
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleResetModuleQuiz(mat.id, questions)}
                                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xxs font-mono font-bold uppercase tracking-wide transition-all border border-stone-200 active:scale-95 cursor-pointer"
                              >
                                Ulangi Ujian Modul
                              </button>
                            )}

                            {feedback.submitted && feedback.failed && (
                              <span className="text-xxs text-rose-600 font-serif font-semibold">
                                ⚠️ Skor Anda {feedback.score}% (Belum mencapai batas lulus 70%). Silakan ulangi guna membuka kunci modul selanjutnya.
                              </span>
                            )}
                            {feedback.submitted && !feedback.failed && (
                              <span className="text-xxs text-emerald-700 font-serif font-bold">
                                🎉 Selamat! Anda telah Lulus Modul ini dengan Nilai Gemilang. Akses modul berikutnya telah terbuka otomatis!
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 4. TRANSLITERATION QUIZ */}
      {activeTab === 'quiz' && (
        <div id="transliteration-quiz-portal" className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm text-center">
            <h3 className="text-base font-bold text-[#3E3831] font-serif">Evaluasi Kuis Transliterasi Terintegrasi</h3>
            <p className="text-xs text-[#5E584E] mt-1">
              Uji ketajaman membaca Anda! Selesaikan kuis berbobot 5 pertanyaan ini guna mendaratkan skor kemahiran.
            </p>
          </div>

          {!quizFinished ? (
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-6 relative">
              
              {/* Top info and progress counts */}
              <div className="flex justify-between items-center border-b border-[#E8E2D9] pb-3">
                <span className="text-xs font-mono font-bold text-[#8B7355]">
                  PERTANYAAN {currentQuizIndex + 1} DARI {quizQuestions.length}
                </span>
                <span className="text-xs font-mono text-[#5E584E]">
                  Benar: {quizScore}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#FAF9F5] h-1.5 rounded-full overflow-hidden border border-[#E8E2D9]">
                <div 
                  className="bg-[#3E3831] h-full transition-all duration-300" 
                  style={{ width: `${((currentQuizIndex) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question visual prompt rendering */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-[#3E3831] leading-relaxed">
                  {quizQuestions[currentQuizIndex].question}
                </h4>

                {/* Draw large Aramaic prompt if exists */}
                {quizQuestions[currentQuizIndex].aramaicHint && (
                  <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#E8E2D9] flex items-center justify-center">
                    <span className={`text-[6.5rem] font-bold ${getFontClassForText()} text-[#3E3831]`}>
                      {quizQuestions[currentQuizIndex].aramaicHint}
                    </span>
                  </div>
                )}
              </div>

              {/* Options selection list or typed transliteration input */}
              {quizQuestions[currentQuizIndex].type === 'transliteration' ? (
                <div className="space-y-3 p-4 bg-[#FAF9F5] rounded-2xl border border-[#E8E2D9] text-left">
                  <label htmlFor="quiz-typed-translit" className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-1">
                    Ketik Transliterasi Karakter di Atas *
                  </label>
                  <div className="relative">
                    <input
                      id="quiz-typed-translit"
                      type="text"
                      disabled={showExplanation}
                      placeholder="Ketik di sini (contoh: Alaph, Beth, Gamal)..."
                      value={userTypedAnswer}
                      onChange={(e) => setUserTypedAnswer(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 text-[#3E3831] font-sans font-semibold placeholder:font-normal placeholder:text-stone-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && userTypedAnswer.trim() && !showExplanation) {
                          handleQuizAnswerSubmit();
                        }
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 block italic leading-relaxed">
                    💡 Ketik nama latin resmi huruf Aramaik tersebut (tidak sensitif huruf besar/kecil). Anda bisa melihat bagian "Daftar Huruf" untuk contekan nama pelafalannya!
                  </span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {quizQuestions[currentQuizIndex].options.map((option) => (
                    <button
                      key={option}
                      disabled={showExplanation}
                      onClick={() => setUserSelectedOption(option)}
                      className={`w-full p-3.5 text-left text-xs font-semibold rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                        userSelectedOption === option
                          ? 'bg-[#8B7355]/10 border-[#8B7355] text-[#3E3831]'
                          : 'bg-white hover:bg-[#FAF9F5] border-[#E8E2D9] text-[#5E584E]'
                      }`}
                    >
                      <span>{option}</span>
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                        userSelectedOption === option ? 'border-[#8B7355] bg-[#8B7355]' : 'border-stone-300'
                      }`}>
                        {userSelectedOption === option && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E2D9]">
                {!showExplanation ? (
                  <button
                    disabled={quizQuestions[currentQuizIndex].type === 'transliteration' ? !userTypedAnswer.trim() : !userSelectedOption}
                    onClick={handleQuizAnswerSubmit}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      (quizQuestions[currentQuizIndex].type === 'transliteration' ? userTypedAnswer.trim() : userSelectedOption)
                        ? 'bg-[#3E3831] hover:bg-[#2D2823] text-[#FAF9F5] shadow-sm'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Kunci Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="px-6 py-2.5 bg-[#3E3831] hover:bg-[#2D2823] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {currentQuizIndex + 1 < quizQuestions.length ? 'Pertanyaan Berikutnya' : 'Selesaikan Kuis'}
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

              {/* Instant feedback explanation banner */}
              {showExplanation && (
                <div className={`p-4 rounded-xl border transition-all ${
                  isAnswerCorrect 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-neutral-50 border-[#E8E2D9] text-amber-800'
                }`}>
                  <h5 className="font-bold text-xs flex items-center gap-1">
                    {isAnswerCorrect ? '🎉 Jawaban Anda Benar!' : '😓 Kurang Tepat!'}
                  </h5>
                  <p className="text-xxs mt-1 opacity-90 leading-relaxed">
                    Jawaban yang benar adalah <strong>{quizQuestions[currentQuizIndex].correctOption}</strong>. 
                    {quizQuestions[currentQuizIndex].aramaicHint && ` Karakter ini merepresentasikan pelafalan fonetis unik dalam tradisi aksara ${selectedFont.toUpperCase()}.`}
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] shadow-sm text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-[#FAF9F5] text-[#8B7355] border border-[#E8E2D9] rounded-full flex items-center justify-center animate-bounce">
                <Award className="w-10 h-10 text-[#8B7355]" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-[#3E3831] font-serif">Ujian Berhasil Diselesaikan!</h4>
                <p className="text-xs text-[#5E584E]">Hasil tes kuis transliterasi Anda telah terekam ke dalam dashboard progres.</p>
              </div>

              {/* Score Display Card */}
              <div className="bg-[#FAF9F5] p-5 rounded-xl border border-[#E8E2D9] max-w-xs mx-auto">
                <span className="text-xxs font-mono text-[#8B7355] uppercase tracking-widest block">Skor Kelulusan Anda</span>
                <span className="text-4xl font-extrabold text-[#8B7355] mt-1 block">
                  {Math.round((quizScore / quizQuestions.length) * 100)}%
                </span>
                <span className="text-xxs mt-2 text-[#5E584E] block">
                  ({quizScore} dari {quizQuestions.length} Terjawab Benar)
                </span>
              </div>

              {Math.round((quizScore / quizQuestions.length) * 100) >= 70 && (
                <div className="bg-[#FCFAF2] border border-[#8B7355]/50 p-4 rounded-xl max-w-xs mx-auto space-y-2 text-center shadow-xs">
                  <span className="text-xs font-bold text-emerald-800 block">🎉 Selamat! Anda Lulus Evaluasi A1</span>
                  <p className="text-[10px] text-[#5E584E] leading-relaxed">
                    Anda berhasil memperoleh skor kelulusan minimum (skor &ge; 70%). Sertifikat digital Anda yang ditandatangani oleh <strong>Rudolf A. Luhukay</strong> kini aktif!
                  </p>
                  <button 
                    onClick={() => setShowCertificateModal(true)}
                    className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-[#FAF9F5] rounded-xl text-xxs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wide"
                  >
                    <Award className="w-4 h-4" />
                    Cetak Sertifikat Kelulusan A1
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-[#E8E2D9] flex justify-center gap-3">
                <button
                  onClick={handleRestartQuiz}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Ulangi Kuis
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 bg-[#8B7355] hover:bg-[#5E584E] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Ulas di Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Real-time Typing Practice Sandbox (Additional practice) */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h4 className="text-sm font-bold text-[#3E3831] font-serif">Panggung Latihan Pelafalan Mandiri (Infinite Sandbox)</h4>
            </div>
            <p className="text-xxs text-[#5E584E] leading-relaxed">
              Panggung latih tanding tak terbatas! Kami mengundi karakter acak dari alfabet Aramaik Suryani di bawah. Silakan ketikkan nama transliterasinya dan dapatkan poin rintisan belajarmu!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#FAF9F5] p-5 rounded-xl border border-[#E8E2D9]">
              
              {/* Random Character Column */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-[#E8E2D9] shadow-sm">
                <span className="text-[10px] font-mono text-[#8B7355] uppercase font-bold tracking-wider mb-2 font-semibold">Tebak Karakter Ini:</span>
                <span className={`text-6xl font-bold ${getFontClassForText()} text-[#3E3831] animate-[pulse_3s_infinite]`}>
                  {ARAMAIC_ALPHABET[sandboxIdx].char}
                </span>
                <span className="text-[10px] font-mono text-stone-400 mt-2">Value: {ARAMAIC_ALPHABET[sandboxIdx].numericalValue} • {ARAMAIC_ALPHABET[sandboxIdx].syriacCharCodes}</span>
              </div>

              {/* Typing inputs */}
              <div className="md:col-span-8 space-y-3">
                <div className="space-y-1">
                  <label htmlFor="sandbox-translit-input" className="block text-[10px] uppercase font-mono tracking-wider font-bold text-stone-500">Transliterasi Bahasa Aramaik:</label>
                  <input
                    id="sandbox-translit-input"
                    type="text"
                    disabled={sandboxSubmitted}
                    placeholder="Contoh: Alaph, Beth, Gamal..."
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 text-[#3E3831]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !sandboxSubmitted) {
                        handleSandboxSubmit();
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="text-[11px] font-mono font-bold text-[#8B7355]">
                    Poin Sandbox: <span className="text-[#3E3831] bg-amber-100 px-1.5 py-0.5 rounded text-xs">{sandboxSessionScore} XP</span>
                  </div>

                  <div className="flex gap-2">
                    {!sandboxSubmitted ? (
                      <button
                        onClick={handleSandboxSubmit}
                        disabled={!sandboxInput.trim()}
                        className={`px-4 py-1.5 rounded-lg text-xxs font-bold transition-all cursor-pointer ${
                          sandboxInput.trim()
                            ? 'bg-[#3E3831] hover:bg-[#2D2823] text-white shadow-sm'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        Periksa
                      </button>
                    ) : (
                      <button
                        onClick={handleNextSandbox}
                        className="px-4 py-1.5 bg-[#8B7355] hover:bg-[#5E584E] text-white rounded-lg text-xxs font-bold transition-all cursor-pointer"
                      >
                        Berikutnya »
                      </button>
                    )}
                  </div>
                </div>

                {/* Accuracy Feedback */}
                {sandboxSubmitted && (
                  <div className={`p-2.5 rounded-lg border text-xxs leading-relaxed font-semibold transition-all ${
                    sandboxCorrect 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 text-left' 
                      : 'bg-red-50 border-red-200 text-red-800 text-left'
                  }`}>
                    {sandboxCorrect ? (
                      <span>🎉 Brilian! Jawaban Anda benar-benar tepat. Karakter ini adalah <strong>{ARAMAIC_ALPHABET[sandboxIdx].name}</strong>. Anda mengantongi +10 XP belajar!</span>
                    ) : (
                      <span>😓 Sedikit lagi! Jawaban yang benar adalah <strong>{ARAMAIC_ALPHABET[sandboxIdx].name}</strong> ({ARAMAIC_ALPHABET[sandboxIdx].meaning}). Semangat berlatih terus!</span>
                    )}
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

      {/* 5. INTERACTIVE ASSIGNMENTS & HOMEWORK SUBMISSION */}
      {activeTab === 'assignments' && (
        <div id="interactive-assignments" className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm">
            <h3 className="text-base font-bold text-[#3E3831] font-serif">Tugas Mandiri & Evaluasi Karakter</h3>
            <p className="text-xs text-[#5E584E] mt-1">
              Selesaikan tugas di bawah ini untuk mendapatkan umpan balik pabean dari Admin Rudolf. Gunakan virtual keyboard yang telah disediakan di bawah apabila Anda ingin mengetikkan rangkaian abjad orisinal Aramaik Suryani.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {assignments.map((assign) => {
              const submission = submissions.find(s => s.assignmentId === assign.id && s.studentId === studentId);
              const isSubmitted = !!submission;
              const isTypingActive = activeAssignmentId === assign.id;

              return (
                <div key={assign.id} className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left info column */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#3E3831] font-serif">{assign.title}</h4>
                      <span className="text-xxs font-mono text-[#8B7355]">
                        Batas Akhir: {assign.dueDate}
                      </span>
                    </div>

                    <p className="text-xs text-[#5E584E] leading-relaxed bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E8E2D9]">
                      {assign.description}
                    </p>

                    {isSubmitted ? (
                      <div className="space-y-3 pt-2">
                        <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E8E2D9]">
                          <span className="text-xxs font-mono text-[#8B7355] uppercase">Jawaban Anda:</span>
                          <p className="text-xs font-semibold text-[#3E3831] mt-1" style={{ direction: 'rtl' }}>
                            {submission.content}
                          </p>
                          <span className="text-[10px] text-stone-400 mt-1 block">Terkirim pada {submission.submittedAt}</span>
                        </div>

                        {/* Grade status indicator */}
                        {submission.status === 'graded' ? (
                          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold">Nilai: {submission.grade} / {assign.maxScore}</span>
                              <span className="text-xxs font-mono uppercase bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-800">Diterima</span>
                            </div>
                            <p className="text-xxs mt-1 opacity-90 leading-relaxed">
                              Umpan Balik Guru: "{submission.feedback}"
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E8E2D9] text-[#8B7355] flex justify-between items-center">
                            <span className="text-xxs font-semibold">Menunggu Peninjauan Admin Rudolf...</span>
                            <span className="text-xxs font-mono uppercase bg-[#F1EDE4] px-1.5 py-0.5 rounded text-[#8B7355] border border-[#E8E2D9]">Diproses</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xxs font-mono text-[#8B7355] uppercase mb-1 font-bold">
                            Isi Jawaban Lembar Kerja
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Ketikkan pembacaan transliterasi Latin Anda, atau klik tombol Keyboard di kanan/bawah untuk menyisipkan aksara Suryani..."
                            value={assignmentTypingAnswers[assign.id] || ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              setAssignmentTypingAnswers(prev => ({ ...prev, [assign.id]: v }));
                            }}
                            onFocus={() => setActiveAssignmentId(assign.id)}
                            className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8B7355]/30 text-[#423D33] font-sans"
                            style={{ direction: 'rtl' }}
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => {
                              if (isTypingActive) {
                                setActiveAssignmentId(null);
                              } else {
                                setActiveAssignmentId(assign.id);
                              }
                            }}
                            className={`p-2 rounded-xl text-xxs font-semibold transition-all cursor-pointer ${
                              isTypingActive 
                                ? 'bg-[#8B7355] text-white' 
                                : 'bg-[#FAF9F5] text-stone-700 hover:bg-stone-100 border border-[#E8E2D9]'
                            }`}
                          >
                            {isTypingActive ? '🔑 Tutup Keyboard' : '⌨️ Tampilkan Virtual Keyboard'}
                          </button>

                          <button
                            disabled={!(assignmentTypingAnswers[assign.id] || '').trim()}
                            onClick={() => handleSendAssignment(assign.id)}
                            className="px-4 py-2 bg-[#3E3831] hover:bg-[#2D2823] text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3 text-white" />
                            Kirim Jawaban
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Keyboard column */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    {isTypingActive ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-[#FAF9F5] rounded-xl border border-stone-200/50">
                          <span className="text-xxs font-mono text-stone-400 uppercase">Input Aktif</span>
                          <div className={`p-2 bg-white rounded-lg border border-stone-200 min-h-[44px] text-base font-bold ${getFontClassForText()} text-stone-800 text-right`} style={{ direction: 'rtl' }}>
                            {assignmentTypingAnswers[assign.id] || <span className="text-stone-300 font-sans text-xs">Ketuk di keyboard bawah...</span>}
                          </div>
                        </div>
                        <AramaicKeyboard
                          onKeyPress={handleKeyClick}
                          onBackspace={handleBackspace}
                          onClear={handleClear}
                          selectedFont={selectedFont}
                        />
                      </div>
                    ) : (
                      <div className="p-5 border-2 border-dashed border-stone-200 rounded-xl text-center flex flex-col items-center justify-center space-y-1.5 opacity-60">
                        <Sparkles className="w-6 h-6 text-stone-400" />
                        <h5 className="text-xs font-semibold text-stone-700">Gunakan Keyboard Pintar</h5>
                        <p className="text-xxs text-stone-500 max-w-[200px]">Aktifkan kotak pengisian tugas di sebelah kiri untuk mengetik kalimat Suryani secara otomatis.</p>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. WHITEBOARD ARAMAIC */}
      {activeTab === 'whiteboard' && (
        <WhiteboardAramaic
          selectedFont={selectedFont}
          onChangeFont={onChangeFont}
        />
      )}

      {/* 6. PROFILE & SETTINGS PAGE WITH EXPLICIT FONT SELECTION */}
      {activeTab === 'profile' && (
        <div id="student-profile-settings" className="space-y-6 text-left">
          
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm">
            <h3 className="text-base font-bold text-[#3E3831] font-serif">Profil Siswa & Pengaturan Aksara</h3>
            <p className="text-xs text-[#5E584E] mt-0.5">
              Sesuaikan pengaturan tampilan aksara liturgis Suryani dan pantau perolehan lencana keahlian transliterasi Anda di sini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Profile Card */}
            <div className="md:col-span-4 space-y-6">
              
              <div className="bg-[#3E3831] text-[#FAF9F5] p-6 rounded-2xl shadow-sm border border-[#4E463E] flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#faf9f5] text-[#3e3831] rounded-full flex items-center justify-center font-bold text-xl border-2 border-[#8B7355] font-serif shadow-sm">
                  {studentName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-serif text-white">{studentName}</h4>
                  <span className="text-[10px] font-mono text-stone-300">Siswa Resmi LMS Aramaik</span>
                </div>
                
                <div className="w-full pt-4 border-t border-stone-600/50 space-y-2 text-left">
                  <div className="flex justify-between text-xxs font-mono">
                    <span className="text-stone-400">ID Siswa:</span>
                    <span className="text-stone-200">{studentId}</span>
                  </div>
                  <div className="flex justify-between text-xxs font-mono">
                    <span className="text-stone-400">Hak Akses:</span>
                    <span className="text-emerald-400 uppercase font-bold">MEMBER / PESERTA</span>
                  </div>
                  <div className="flex justify-between text-xxs font-mono">
                    <span className="text-stone-400">Sertifikasi:</span>
                    <span className="text-[#8B7355]">Aproved (Aktif)</span>
                  </div>
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-4">
                <h5 className="text-xs font-bold font-mono tracking-wider text-[#8B7355] uppercase">Indikator Prestasi Belajar</h5>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">Abjad yang Dikuasai:</span>
                    <span className="font-bold text-[#3E3831] font-mono">{(progress.completedLetters?.length || 0)} / 22 Glyphs</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">Modul yang Direview:</span>
                    <span className="font-bold text-[#3E3831] font-mono">{(progress.completedMaterials?.length || 0)} Topic</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">Lencana Terkunci:</span>
                    <span className="font-bold text-[#3E3831] font-mono">
                      {[
                        (progress.completedLetters?.length || 0) >= 1,
                        (progress.completedMaterials?.length || 0) >= 1,
                        (progress.quizScores?.['general_quiz'] || 0) >= 80,
                        sandboxSessionScore >= 50
                      ].filter(Boolean).length} / 4 Lencana
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                    <span className="text-stone-500 font-bold">Poin Sandbox Belajar:</span>
                    <span className="font-extrabold text-[#8B7355] font-mono">{sandboxSessionScore} XP</span>
                  </div>
                </div>
              </div>

              {/* Status Sertifikasi A1 Terintegrasi */}
              <div className="bg-[#FCFAF2] p-5 rounded-2xl border border-[#8B7355]/40 shadow-sm space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 animate-pulse" />
                  <h5 className="text-xs font-bold font-serif text-[#3E3831]">Status Sertifikasi A1</h5>
                </div>
                
                {Math.round(progress.quizScores?.['general_quiz'] || 0) >= 70 ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-[#5E584E] leading-relaxed">
                      Selamat! Anda telah lulus Evaluasi Akhir Level A1 dengan hasil sangat memuaskan (Skor: <strong>{progress.quizScores?.['general_quiz']}%</strong>).
                    </p>
                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="w-full py-2 bg-[#8B7355] hover:bg-[#5E584E] text-[#FAF9F5] rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5 text-white" />
                      Cetak Sertifikat A1
                    </button>
                    <span className="text-[9px] text-emerald-700 font-mono text-center block font-bold">✓ TTD: Rudolf A. Luhukay</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] text-[#5E584E] leading-relaxed">
                      Lulus kuis evaluasi dengan skor &ge; 70% di tab <strong>"Evaluasi Kuis"</strong> untuk klaim sertifikasi fisik Anda.
                    </p>
                    <div className="w-full bg-[#FAF9F5] h-1.5 rounded-full overflow-hidden border border-stone-200">
                      <div className="bg-amber-500 h-full transition-all" style={{ width: `${Math.min(100, Math.round((progress.quizScores?.['general_quiz'] || 0) / 70 * 100))}%` }} />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-stone-500">
                      <span>Progres: {Math.round(progress.quizScores?.['general_quiz'] || 0)}%</span>
                      <span>Batas Kelulusan: 70%</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Interactive Font Configurator */}
            <div className="md:col-span-8 space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm space-y-6">
                
                <div className="border-b border-stone-100 pb-3">
                  <h4 className="text-sm font-bold text-[#3E3831] font-serif">Pengaturan Bentuk Font Aksara Syriak (Suryani)</h4>
                  <p className="text-xxs text-stone-500 mt-1 leading-relaxed">
                    Setiap dialek sejarah penulisan Aramaik memiliki gaya hiasan glif yang khas. Anda dapat mengubah gaya font di bawah untuk seluruh aplikasi menggunakan pilihan cepat dropdown atau radio button.
                  </p>
                </div>

                {/* 1. SELECTION CONTROLS (DROPDOWN) */}
                <div className="space-y-2">
                  <label htmlFor="settings-font-dropdown" className="text-xxs font-bold text-stone-500 uppercase tracking-widest font-mono block">
                    Pilihan A: Menu Dropdown (Dropdown Menu)
                  </label>
                  <select
                    id="settings-font-dropdown"
                    value={selectedFont}
                    onChange={(e) => onChangeFont(e.target.value as FontStyle)}
                    className="w-full max-w-md px-3.5 py-2 outline-none border border-[#E8E2D9] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#8B7355]/20 bg-stone-50 text-[#3E3831]"
                  >
                    <option value="estrangelo">Estrangelo (Karakter Klasik & Naskah Kuno)</option>
                    <option value="serto">Serto (Aksara Melengkung Barat / Kursif)</option>
                    <option value="madnkhaya">Madnkhaya (Aksara Hiasan Nestorian Timur)</option>
                  </select>
                </div>

                {/* 2. SELECTION CONTROLS (RADIO BUTTONS) */}
                <div className="space-y-3.5 pt-4 border-t border-[#FAF9F5]">
                  <span className="text-xxs font-bold text-stone-500 uppercase tracking-widest font-mono block">
                    Pilihan B: Tombol Pilihan (Radio Buttons)
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Estrangelo Radio */}
                    <label className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col text-left space-y-1.5 ${
                      selectedFont === 'estrangelo' 
                        ? 'border-[#8B7355] bg-[#8B7355]/5 text-[#3E3831]' 
                        : 'border-[#E8E2D9] hover:bg-[#FAF9F5] text-[#5E584E]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="settings-font-radio"
                          value="estrangelo"
                          checked={selectedFont === 'estrangelo'}
                          onChange={() => onChangeFont('estrangelo')}
                          className="text-[#8B7355] focus:ring-[#8B7355]"
                        />
                        <span className="text-xs font-bold">Estrangelo</span>
                      </div>
                      <span className="text-[10px] text-stone-400 leading-snug">Gaya huruf cetak tebal dan formal khas manuskrip klasik abad ke-2.</span>
                    </label>

                    {/* Serto Radio */}
                    <label className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col text-left space-y-1.5 ${
                      selectedFont === 'serto' 
                        ? 'border-[#8B7355] bg-[#8B7355]/5 text-[#3E3831]' 
                        : 'border-[#E8E2D9] hover:bg-[#FAF9F5] text-[#5E584E]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="settings-font-radio"
                          value="serto"
                          checked={selectedFont === 'serto'}
                          onChange={() => onChangeFont('serto')}
                          className="text-[#8B7355] focus:ring-[#8B7355]"
                        />
                        <span className="text-xs font-bold">Serto (West)</span>
                      </div>
                      <span className="text-[10px] text-stone-400 leading-snug">Gaya tulisan tangan melingkar dan praktis digunakan di barat Syriak.</span>
                    </label>

                    {/* Madnkhaya Radio */}
                    <label className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col text-left space-y-1.5 ${
                      selectedFont === 'madnkhaya' 
                        ? 'border-[#8B7355] bg-[#8B7355]/5 text-[#3E3831]' 
                        : 'border-[#E8E2D9] hover:bg-[#FAF9F5] text-[#5E584E]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="settings-font-radio"
                          value="madnkhaya"
                          checked={selectedFont === 'madnkhaya'}
                          onChange={() => onChangeFont('madnkhaya')}
                          className="text-[#8B7355] focus:ring-[#8B7355]"
                        />
                        <span className="text-xs font-bold">Madnkhaya (East)</span>
                      </div>
                      <span className="text-[10px] text-stone-400 leading-snug">Gaya Timur bersudut artistik yang digunakan dalam komunitas Nestorian.</span>
                    </label>
                  </div>
                </div>

                {/* 3. LIVE SHAPE COMPARISON TOOL */}
                <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E8E2D9] space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#8B7355] block">
                    Alat Pembanding Rupa Aksara (Live Font Previewer)
                  </span>

                  <div className="space-y-4 text-center">
                    
                    {/* Large active character rendering */}
                    <div className="py-6 border-b border-[#E8E2D9]/50">
                      <span className={`text-8xl font-bold ${getFontClassForText()} text-[#3E3831] block transition-all`}>
                        ܐܒܓܕ ܗܘܢ
                      </span>
                      <span className="text-[9px] font-mono tracking-widest text-[#8B7355] uppercase block mt-3">
                        Rangkaian Aksara Utama: Alaph - Beth - Gamal - Dalath - He - Waw - Nun
                      </span>
                    </div>

                    {/* Dialect script characteristics explanation */}
                    <div className="text-left space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-[#3E3831]">Metode Penulisan Aktif: {selectedFont.toUpperCase()}</span>
                      <p className="text-xxs text-[#5E584E] leading-relaxed">
                        {selectedFont === 'estrangelo' && 'Pecahan huruf cetak Estrangelo memiliki sudut penulisan persegi tegak tegap dengan ujung glif yang tidak terhubung secara luwes.'}
                        {selectedFont === 'serto' && 'Serto condong menyederhanakan penarikan kuas, melengkungkan persendian garis sambung sehingga sangat cepat ditulis layaknya steno.'}
                        {selectedFont === 'madnkhaya' && 'Madnkhaya mengimbuhkan tanda vokal melingkar runcing di atas maupun bawah huruf untuk mengunci kejelasan rima baca liturgi liturgis.'}
                      </p>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* 5. GORGEOUS PRINTABLE VINTAGE CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div id="certification-printable-modal" className="fixed inset-0 z-50 bg-[#3E3831]/80 backdrop-blur-xs overflow-y-auto p-2 sm:p-4 md:p-8 flex justify-center items-start print:absolute print:inset-0 print:bg-white print:p-0">
          
          <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 max-w-4xl w-full border border-[#E8E2D9] shadow-2xl space-y-4 md:space-y-6 relative my-auto print:border-none print:shadow-none print:p-0 print:rounded-none">
            
            {/* Modal Controls (Hidden in print mode) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center print:hidden border-b border-[#FAF9F5] pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600 shrink-0" />
                <h4 className="font-bold text-[#3E3831] font-serif text-sm">Dokumen Kelulusan Resmi - Level A1</h4>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#8B7355] hover:bg-[#5E584E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  Cetak / Print
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-xl transition-all cursor-pointer"
                  title="Tutup Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scale/Zoom Controls (Hidden in print mode) */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E2D9]/60 print:hidden text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600">Skala Ukuran Tampilan:</span>
                <span className="text-xs font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{certZoom}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setCertZoom(Math.max(30, certZoom - 5))}
                  className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-2xs"
                  title="Perkecil Ukuran"
                >
                  - Perkecil
                </button>
                <button 
                  onClick={() => {
                    const width = window.innerWidth;
                    if (width < 450) setCertZoom(45);
                    else if (width < 640) setCertZoom(55);
                    else if (width < 768) setCertZoom(70);
                    else if (width < 1024) setCertZoom(85);
                    else setCertZoom(100);
                  }}
                  className="px-2.5 py-1 bg-[#FAF7EF] hover:bg-stone-100 border border-amber-300 text-amber-950 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-2xs"
                  title="Sesuaikan otomatis sesuai layar perangkat Anda"
                >
                  Sesuaikan Layar (Auto)
                </button>
                <button 
                  onClick={() => setCertZoom(Math.min(130, certZoom + 5))}
                  className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-2xs"
                  title="Perbesar Ukuran"
                >
                  + Perbesar
                </button>
              </div>
            </div>

            {/* Print Notice (Hidden in print mode) */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/50 text-[11px] text-amber-900 leading-relaxed text-left print:hidden">
              💡 <strong>Petunjuk Cetak:</strong> Klik tombol <strong>Cetak / Print</strong> di atas. Pada dialog cetak browser Anda, pastikan opsi <strong>"Layout"</strong> diatur ke <strong>"Landscape"</strong> (Lekukan melebar), matikan <strong>"Margins"</strong> (atur ke "None" jika ada), dan wajib centang/aktifkan opsi <strong>"Background graphics"</strong> agar ornamen warna kertas kuno tampil sempurna pada kertas cetakan Anda.
            </div>

            {/* Certificate Canvas Body (Optimized for standard A4 landscape print sizes across all devices, with dynamic responsive container rendering) */}
            <div className="w-full flex justify-center items-start overflow-hidden print:overflow-visible print:h-auto" style={{ height: `calc(560px * ${certZoom / 100})`, transition: 'height 0.2s ease-in-out' }}>
              <div 
                style={{ 
                  transform: `scale(${certZoom / 100})`, 
                  transformOrigin: 'top center',
                  width: '800px',
                  minWidth: '800px',
                  height: '560px',
                  transition: 'transform 0.2s ease-in-out'
                }}
                className="bg-[#FAF7EF] border-8 border-double border-[#8B7355] p-10 rounded-2xl relative text-center select-none shadow-inner flex flex-col justify-between print:transform-none print:w-full print:h-auto print:border-8 print:p-16 print:my-0 origin-top"
              >
                
                {/* Double classical vintage corner ribbons or decals */}
                <div className="absolute top-4 left-4 text-[#8B7355] opacity-25 font-serif text-3xl">❖</div>
                <div className="absolute top-4 right-4 text-[#8B7355] opacity-25 font-serif text-3xl">❖</div>
                <div className="absolute bottom-4 left-4 text-[#8B7355] opacity-25 font-serif text-3xl">❖</div>
                <div className="absolute bottom-4 right-4 text-[#8B7355] opacity-25 font-serif text-3xl">❖</div>

                {/* Institution Seal/Header */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#8B7355] tracking-[0.25em] uppercase font-extrabold block">
                    Studi Alkitabiah & Preservasi Sastra Aramaik
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#3E3831] font-serif tracking-tight drop-shadow-xs">
                    PLATFORM BELAJAR MANDIRI ARAMAIK-SYRIAC
                  </h2>
                  <div className="w-40 h-[1.5px] bg-[#8B7355]/40 mx-auto mt-1.5"></div>
                </div>

                {/* Certificate Title */}
                <div className="space-y-0.5">
                  <h3 className="text-[#8B7355] font-serif text-base font-bold tracking-wider italic">
                    Sertifikat Kelulusan Resmi - Tingkat A1 (Pemula)
                  </h3>
                  <span className="text-[9px] font-mono text-[#746E64] block tracking-wide">
                    NOMOR IDENTIFIKASI KEMAHIRAN: ARM-A1-2026-{(studentId || 'STUDENT').slice(-6).toUpperCase()}
                  </span>
                </div>

                {/* Recipient Statement */}
                <div className="space-y-2 max-w-xl mx-auto">
                  <p className="text-[9px] text-[#5E584E] uppercase font-bold tracking-widest">
                    Dengan Rasa Bangga dan Kehormatan, Dianugerahkan Kepada:
                  </p>
                  <h1 className="text-2xl font-extrabold text-[#3E3831] font-serif underline decoration-double decoration-[#8B7355] py-0.5">
                    {studentName || 'Peserta Terpuji'}
                  </h1>
                  <p className="text-[11px] text-[#4E463E] leading-relaxed font-serif pt-1">
                    Atas dedikasi luar biasa, ketekunan emosional yang damai, serta kecemerlangan tingkat tinggi dalam menyerap seluruh materi 22 abjad Suryani, hukum menyambung kata, kaidah tanda vokal Pthaha-Zqapha, dan berhasil lulus dengan nilai gemilang pada <strong>Evaluasi Keras Ujian Akhir Level A1</strong>.
                  </p>
                </div>

                {/* Signatures & Certification details */}
                <div className="grid grid-cols-2 gap-8 items-end text-left">
                  
                  {/* Left side: Date of release */}
                  <div className="space-y-0.5 pb-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#8B7355] block">Tanggal Kelulusan</span>
                    <span className="text-xs font-bold text-[#3E3831] block">18 Juni 2026 (Aktif)</span>
                    <span className="text-[9px] font-mono text-stone-500 block">Sistem Otomasi LMS</span>
                  </div>

                  {/* Right side: Rudolf A. Luhukay Signature */}
                  <div className="text-right space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#8B7355] block">Pengajar Utama & Pendiri</span>
                    
                    {/* Real SVG Vector path replicating the physical signature of Rudolf A. Luhukay */}
                    <div className="py-0.5 flex flex-col items-end justify-center min-h-[50px]">
                      <svg viewBox="0 0 250 110" className="w-36 h-auto text-[#1A1A1A] hover:opacity-95" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        {/* The prominent cursive R & its beautiful left-side loop assembly */}
                        <path d="M 45 45 C 30 25, 10 32, 12 55 C 14 78, 38 82, 45 60 C 50 45, 42 22, 52 25 C 56 26, 52 50, 52 76" />
                        <path d="M 52 25 C 65 22, 75 28, 73 42 C 71 52, 60 52, 52 48" />
                        <path d="M 52 48 C 58 55, 62 65, 70 76" />
                        
                        {/* The sharp Capital A */}
                        <path d="M 88 32 L 80 76" />
                        <path d="M 88 32 L 98 76" />
                        <path d="M 78 58 L 100 58" strokeWidth="2.2" />

                        {/* Elegant handwritten "luhukay" letter string */}
                        {/* l */}
                        <path d="M 98 76 C 104 60, 114 22, 118 22 C 122 22, 118 55, 116 76" />
                        {/* u */}
                        <path d="M 116 76 C 121 62, 124 50, 128 50 C 132 50, 126 76, 131 76" />
                        <path d="M 131 76 C 136 62, 138 50, 142 50 C 145 50, 140 76, 144 76" strokeWidth="2.5" />
                        {/* h */}
                        <path d="M 144 76 C 150 60, 158 22, 162 22 C 166 22, 160 55, 158 76" />
                        <path d="M 158 60 C 164 50, 172 50, 172 65 L 170 76" />
                        {/* u */}
                        <path d="M 170 76 C 175 62, 180 50, 184 50 C 188 50, 182 76, 187 76" />
                        <path d="M 187 76 C 192 62, 194 50, 198 50 C 201 50, 196 76, 200 76" strokeWidth="2.5" />
                        {/* k */}
                        <path d="M 200 76 C 206 60, 214 22, 218 22 C 222 22, 216 55, 214 76" />
                        <path d="M 214 60 C 220 50, 224 50, 222 62 C 220 70, 217 76, 224 76" />
                        {/* a */}
                        <path d="M 224 76 C 228 76, 234 70, 234 60 C 234 52, 227 52, 224 60 C 221 68, 224 76, 230 76" />
                        {/* y */}
                        <path d="M 230 76 C 235 62, 238 50, 242 50 C 246 50, 240 76, 244 76" />
                        {/* Descender loop + sweeping tail underline going under the entire signature */}
                        <path d="M 244 76 C 248 85, 246 96, 238 104 C 230 110, 222 104, 226 95 C 230 88, 240 85, 252 83" />
                        
                        {/* The long returning signature baseline sweep from left to right */}
                        <path d="M 25 94 C 18 94, 15 90, 22 86 C 28 82, 35 88, 48 88 C 85 88, 140 86, 245 83" strokeWidth="2.6" />
                      </svg>
                      <div className="w-36 h-px bg-[#8B7355]/40 mt-0.5"></div>
                    </div>

                    <span className="text-[11px] font-extrabold text-[#3E3831] font-serif block">Rudolf A. Luhukay</span>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* PERSISTENT FLOATING AI ASSISTANT CHATBOT */}
      {/* ========================================== */}
      
      {/* 1. FLOATING RECRUITMENT TRIGGER (Only visible when chatbot closed) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#8B7355] hover:bg-[#3E3831] text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-[#FAF9F5]/30 font-sans font-bold text-xs uppercase tracking-wider"
          title="Tanya Asisten AI Aramaik Anda"
          id="ai-chatbot-trigger-floating"
        >
          <Bot className="w-4 h-4 text-amber-100 animate-pulse" />
          <span className="hidden sm:inline">Asisten AI Aramaik</span>
          <span className="inline sm:hidden">AI Bot</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* 2. CHAT DRAWER DIALOG BOX */}
      {isChatOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 bg-white border-2 border-[#8B7355] w-[calc(100vw-32px)] sm:w-[410px] h-[550px] rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
          id="ai-chatbot-frame-box"
        >
          {/* Header Panel */}
          <div className="bg-[#8B7355] text-white px-4 py-3.5 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2.5 text-left">
              <div className="p-1.5 bg-[#FAF9F5]/20 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider font-sans text-amber-50">Pembimbing Virtual Aramaik</h3>
                <span className="text-[10px] text-amber-100/85 block leading-none font-serif">Asisten AI Budaya & Aksara Suryani</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Clear chat button */}
              <button 
                onClick={() => {
                  if (window.confirm("Apakah Anda ingin menghapus seluruh riwayat percakapan Anda saat ini?")) {
                    setChatMessages([
                      {
                        role: 'model',
                        content: 'Shlama! Halo! Selamat datang kembali. Saya asisten bimbingan pribadi Aramaik Anda. Ada tata bahasa, kalimat, atau makna glif kuno abjad abjad tertentu yang bisa kita telaah?'
                      }
                    ]);
                  }
                }}
                className="p-1 text-amber-200 hover:text-white rounded-lg hover:bg-[#FAF9F5]/10 transition-colors text-[9px] font-mono font-bold uppercase shrink-0"
                title="Hapus Obrolan"
              >
                Reset
              </button>
              
              {/* Minimize close button */}
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 text-amber-200 hover:text-white rounded-lg hover:bg-[#FAF9F5]/10 transition-colors cursor-pointer shrink-0"
                title="Sembunyikan Obrolan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#FDFCF7] space-y-3.5 scrollbar-thin">
            
            {/* Iterated chat history values */}
            {chatMessages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] font-mono uppercase tracking-wide text-stone-400 mb-1 px-1">
                    {isUser ? `${studentName || 'Peserta'} (Saya)` : 'Asisten Aramaik AI'}
                  </span>
                  
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-xs text-left shadow-xs ${
                    isUser 
                      ? 'bg-[#3E3831] text-[#FAF9F5] rounded-tr-none font-sans font-medium' 
                      : 'bg-[#FAF9F5] border border-stone-200/60 rounded-tl-none'
                  }`}>
                    {/* Parse and render the text context helper */}
                    {(() => {
                      const text = msg.content;
                      return text.split('\n').map((line, lIdx) => {
                        if (!line.trim()) return <div key={lIdx} className="h-1.5" />;
                        
                        // Check if contains Syriac code characters
                        const containsSyriac = /[\u0700-\u074F]/.test(line);
                        
                        // Bold parsing **parts**
                        const parts = line.split(/(\*\*[^*]+\*\*)/g);
                        const formattedLine = parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={pIdx} className={isUser ? "font-bold text-amber-200/90" : "font-extrabold text-[#3E3831]"}>{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        });

                        return (
                          <p 
                            key={lIdx} 
                            className={`leading-relaxed mb-1 text-xs ${
                              containsSyriac 
                                ? 'font-aramaic text-sm text-[#8B7355] border-l-2 border-[#8B7355]/30 pl-2 py-0.5 my-1 bg-stone-50/50 font-bold' 
                                : isUser ? 'text-[#FAF9F5]' : 'font-serif text-[#4E463E]'
                            }`}
                          >
                            {formattedLine}
                          </p>
                        );
                      });
                    })()}
                  </div>
                </div>
              );
            })}

            {/* Active Response Loading animation indicators */}
            {isChatLoading && (
              <div className="flex flex-col items-start font-serif animate-pulse">
                <span className="text-[9px] font-mono uppercase tracking-wide text-stone-400 mb-1 px-1">Asisten Aramaik AI</span>
                <div className="flex items-center gap-2 p-2.5 bg-[#FAF9F5] border border-stone-200 rounded-2xl max-w-[85%] rounded-tl-none font-sans text-stone-500 text-[10px]">
                  <Bot className="w-3.5 h-3.5 animate-spin text-[#8B7355] shrink-0" />
                  <span>Gemini sedang merumuskan jawaban aramaik...</span>
                </div>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Learning Starter Prompt Templates */}
          <div className="px-3 py-2 bg-stone-50 border-t border-stone-150 shrink-0">
            <span className="text-[9px] font-mono font-bold text-stone-500 block text-left mb-1.5 uppercase tracking-wider">🎯 Alternatif Pertanyaan Cepat:</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
              {[
                { label: 'Syalom Aramaik', query: "Bagaimana menulis kata 'Shalom/Damai' dalam aksara Aramaik Suryani beserta cara membacanya?" },
                { label: 'Makna Alaph (ܐ)', query: "Jelaskan sejarah dan makna spiritual kuno di balik huruf utama Alaph (ܐ)" },
                { label: 'Sertô vs Estrangelô', query: "Apa perbedaan bentuk visual antara gaya kaligrafi Estrangelo (ܐܣܛܪܢܓܠܐ) dan gaya Serto (ܣܪطا)?" },
                { label: 'Tata Bahasa / Kasus', query: "Bagaimana pola struktur kalimat dasar (SPO) dalam bahasa Klasik Syriac?" }
              ].map((starter, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    setChatInput(starter.query);
                  }}
                  disabled={isChatLoading}
                  className="shrink-0 bg-white hover:bg-amber-50/60 disabled:opacity-40 border border-stone-200 rounded-lg px-2.5 py-1 text-[9.5px] font-serif text-[#5E584E] hover:text-amber-800 transition-all cursor-pointer snap-start active:scale-95 text-left"
                >
                  {starter.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Input Zone Box */}
          <form 
            onSubmit={handleSendChatMessage}
            className="p-3 bg-white border-t border-stone-150 flex gap-2 shrink-0 items-center"
          >
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isChatLoading}
              placeholder="Tulis pertanyaan belajar bahasa Aramaik..."
              className="flex-1 px-3 py-2 bg-stone-50 hover:bg-stone-100 focus:bg-white text-xs text-[#3E3831] border border-[#E8E2D9] focus:outline-none focus:ring-1 focus:ring-[#8B7355] rounded-xl font-serif transition-colors"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className="bg-[#8B7355] hover:bg-[#3E3831] disabled:bg-stone-200 text-white p-2 rounded-xl transition-all cursor-pointer shadow-xs shrink-0 disabled:text-stone-400"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Prompt footer info */}
          <div className="bg-stone-50 border-t border-stone-100 py-1 text-center shrink-0">
            <span className="text-[8px] font-mono text-stone-400 tracking-wider">Aramaic Wisdom Engine Powered by Gemini 3.5 Flash • AI Studio</span>
          </div>

        </div>
      )}

    </div>
  );
}
