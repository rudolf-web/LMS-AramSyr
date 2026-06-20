import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Check, FileText, Video, Volume2, Globe, Clock, ShieldCheck, Award, MessageSquare, Users, CheckCircle, XCircle, UserCheck, ShieldAlert,
  FileSpreadsheet, FileUp, Sparkles, Code2, Link2, ExternalLink, Columns
} from 'lucide-react';
import { Material, Assignment, Submission, FontStyle, User } from '../types';

interface DashboardAdminProps {
  adminName: string;
  materials: Material[];
  assignments: Assignment[];
  submissions: Submission[];
  onAddMaterial: (material: Material) => void;
  onEditMaterial: (material: Material) => void;
  onDeleteMaterial: (materialId: string) => void;
  onGradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
  selectedFont: FontStyle;
  users: User[];
  onUpdateUserStatus: (userId: string, status: 'approved' | 'disapproved') => void;
}

export default function DashboardAdmin({
  adminName,
  materials,
  assignments,
  submissions,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial,
  onGradeSubmission,
  selectedFont,
  users,
  onUpdateUserStatus,
}: DashboardAdminProps) {
  const [activeTab, setActiveTab] = useState<'materials' | 'submissions' | 'users'>('materials');

  // New Material form states
  const [isEditing, setIsEditing] = useState<string | null>(null); // materialId being edited or null for adding
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Abjad' | 'Tata Bahasa' | 'Percakapan' | 'Sejarah & Budaya'>('Abjad');
  const [formType, setFormType] = useState<Material['type']>('text');
  const [formUrl, setFormUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBodyText, setFormBodyText] = useState('');
  const [formMinutes, setFormMinutes] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [uploadNote, setUploadNote] = useState('');
  const [uploading, setUploading] = useState(false);

  // Grading states
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState<number>(100);
  const [feedbackText, setFeedbackText] = useState('');

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('Abjad');
    setFormType('text');
    setFormUrl('');
    setFormDescription('');
    setFormBodyText('');
    setFormMinutes(10);
    setIsEditing(null);
    setShowForm(false);
    setUploadNote('');
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3.5 * 1024 * 1024) {
      alert(`⚠️ File terlalu besar: ${(file.size / (1024 * 1024)).toFixed(2)} MB\n\nUntuk file di atas 3.5MB (seperti video panjang atau buku tebal), disarankan mengunggah ke Google Drive / Dropbox / Sharepoint Anda, lalu menempelkan tautan berbagi langsung (Direct Link) pada input link di bawah agar muatan data LMS tetap optimal!`);
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setFormUrl(base64String);
      setUploadNote(`✅ Berhasil mengunggah lokal: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      setUploading(false);
    };
    reader.onerror = () => {
      alert("Terjadi kesalahan memproses file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      alert('Silakan isi Judul dan Deskripsi Singkat Materi!');
      return;
    }

    const materialData: Material = {
      id: isEditing || `mat_custom_${Date.now()}`,
      title: formTitle,
      category: formCategory,
      type: formType,
      contentUrl: formUrl || undefined,
      description: formDescription,
      bodyText: formBodyText || undefined,
      estimatedMinutes: Number(formMinutes) || 5,
    };

    if (isEditing) {
      onEditMaterial(materialData);
      alert('Materi berhasil diperbarui!');
    } else {
      onAddMaterial(materialData);
      alert('Materi baru berhasil ditambahkan!');
    }

    resetForm();
  };

  const handleEditClick = (mat: Material) => {
    setIsEditing(mat.id);
    setFormTitle(mat.title);
    setFormCategory(mat.category);
    setFormType(mat.type);
    setFormUrl(mat.contentUrl || '');
    setFormDescription(mat.description);
    setFormBodyText(mat.bodyText || '');
    setFormMinutes(mat.estimatedMinutes);
    setUploadNote(mat.contentUrl && mat.contentUrl.startsWith('data:') ? '✅ Berisi dokumen lokal terunggah (Base64)' : '');
    setShowForm(true);
  };

  const handleDeleteClick = (materialId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus materi pengajaran ini? Tindakan ini bersifat ireversibel.')) {
      onDeleteMaterial(materialId);
    }
  };

  const handleGradeFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmissionId) return;

    onGradeSubmission(gradingSubmissionId, Number(gradeValue), feedbackText);
    alert('Penilaian dan umpan balik berhasil dikirim ke panel siswa!');
    setGradingSubmissionId(null);
    setFeedbackText('');
  };

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
    <div id="admin-container" className="space-y-6">
      
      {/* Welcome Admin Banner */}
      <div className="bg-[#3E3831] text-[#FAF9F5] p-6 rounded-3xl shadow-sm border border-[#4E463E] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-[#8B7355]" />
            <span className="text-xxs font-mono text-[#8B7355] uppercase tracking-widest font-bold">Admin Portal</span>
          </div>
          <h2 className="text-xl font-bold font-serif text-white">Panel Administrator: {adminName}</h2>
          <p className="text-xs text-stone-300">
            Platform instruktur mandiri untuk mendesain kurikulum Aramaic dan meninjau kematangan tugas transliterasi peserta kursus.
          </p>
        </div>
        <div className="flex bg-[#2D2823] border border-[#4E463E] p-1 rounded-xl shrink-0 gap-1 flex-wrap">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'materials' ? 'bg-[#8B7355] text-white shadow' : 'text-stone-300 hover:text-stone-100'
            }`}
          >
            Atur Kurikulum & Materi
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
              activeTab === 'submissions' ? 'bg-[#8B7355] text-white shadow' : 'text-stone-300 hover:text-stone-100'
            }`}
          >
            Review Tugas Murid
            {submissions.filter(s => s.status === 'pending').length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-[#8B7355] text-white shadow' : 'text-stone-300 hover:text-stone-100'
            }`}
          >
            Persetujuan Pendaftaran
            {users.filter(u => u.role === 'member' && u.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded text-[9px] font-mono font-bold animate-pulse">
                {users.filter(u => u.role === 'member' && u.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* CORE VIEW ADMIN ROUTER */}

      {/* TAB A: MATERIALS MANAGEMENT */}
      {activeTab === 'materials' && (
        <div id="admin-materials-manager" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm">
            <div>
              <h3 className="text-base font-bold text-[#3E3831] font-serif">Daftar Modul Belajar & Aksara</h3>
              <p className="text-xs text-[#5E584E] mt-0.5">Sajikan materi orisinal, link YouTube demonstratif, audio pronouncer MP3, atau file dokumentasi PDF.</p>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="px-4 py-2 bg-[#8B7355] hover:bg-[#5E584E] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              {showForm ? 'Sembunyikan Form' : 'Tambah Materi Baru'}
            </button>
          </div>

          {/* Form to Create/Edit Material */}
          {showForm && (
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-md space-y-4">
              <h4 className="text-sm font-bold text-[#3E3831] font-serif border-b border-[#E8E2D9] pb-2">
                {isEditing ? 'Ubah Rincian Dokumen Materi' : 'Buat Materi Rumpun Baru'}
              </h4>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Title */}
                  <div className="md:col-span-6">
                    <label className="block text-xs font-bold text-[#8B7355] mb-1">JUDUL MATERI *</label>
                    <input
                      type="text"
                      required
                      placeholder="cth: Cara Merangkai Huruf Alaph dan Beth"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8B7355]/40 text-[#3E3831] font-sans"
                    />
                  </div>

                  {/* Category */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-[#8B7355] mb-1">KATEGORI *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none text-[#3E3831]"
                    >
                      <option value="Abjad">Abjad (Alfabet)</option>
                      <option value="Tata Bahasa">Tata Bahasa (Grammar)</option>
                      <option value="Percakapan">Percakapan (Speaking)</option>
                      <option value="Sejarah & Budaya">Sejarah & Budaya</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-[#8B7355] mb-1">TIPE MEDIA *</label>
                    <select
                      value={formType}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setFormType(val);
                        setUploadNote('');
                      }}
                      className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none text-[#3E3831] font-semibold"
                    >
                      <option value="text">📖 Hanya Buku Teks / HTML</option>
                      <option value="video">🎥 Sajian Video YouTube Embed</option>
                      <option value="audio">🎵 Putaran Audio Orisinal (MP3)</option>
                      <option value="document">📂 Dokumen / Upload PDF/Word/Excel/PPT</option>
                      <option value="iframe">🔗 Embed Iframe (Assemblr, Geogebra, dll)</option>
                      <option value="html">💻 Embed HTML / Widget Kustom</option>
                      <option value="web_link">🌐 Tautan Web / Platform Eksternal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Estimations */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-[#8B7355] mb-1">DURASI BELAJAR (MENIT)</label>
                    <input
                      type="number"
                      min={1}
                      value={formMinutes}
                      onChange={(e) => setFormMinutes(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none text-[#3E3831]"
                    />
                  </div>

                  {/* Content URL/Embed Text */}
                  <div className="md:col-span-9">
                    <label className="block text-xs font-bold text-[#8B7355] mb-1">
                      {formType === 'iframe' && 'MASUKKAN LINK ATAU MATRIKS KODE KUSTOM <IFRAME> (dari Assemblr Edu, Google Slides, dll)'}
                      {formType === 'html' && 'TEMPELKAN EMBED KODE HTML KUSTOM INTERAKTIF'}
                      {formType === 'video' && 'LINK EMBED YOUTUBE ATAU URL VIDEO'}
                      {formType === 'audio' && 'LINK TRANSRAMA / AUDIO MP3 URL'}
                      {formType === 'document' && 'LINK GOOGLE DRIVE / DROPBOX / TAUTAN DOKUMEN LAIN'}
                      {formType === 'web_link' && 'TAUTAN WEB PLATFORM EKSTERNAL (Quizizz, Mentimeter, dll)'}
                      {formType === 'text' && 'LINK KONTEN TAMBAHAN OPSIONAL (Bila Ada)'}
                    </label>
                    
                    {formType === 'html' ? (
                      <textarea
                        rows={3}
                        placeholder="cth: <div style='background:#f4ece1; padding:20px; border-radius:10px;'><h3 style='color:#8b7355;'>Widget Interaktif</h3><button onclick='alert(&quot;Halo dari Aramaik!&quot;)'>Klik Saya</button></div>"
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none text-[#3E3831] font-mono leading-relaxed"
                      />
                    ) : formType === 'iframe' ? (
                      <textarea
                        rows={3}
                        placeholder='cth: <iframe src="https://assemblrworld.com/edu/embed/..." width="100%" height="400"></iframe> ATAU cukup tempel URL-nya saja'
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none text-[#3E3831] font-mono leading-relaxed"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder={
                          formType === 'video' ? 'cth: https://www.youtube.com/embed/RImI6h2m618' :
                          formType === 'audio' ? 'cth: https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' :
                          formType === 'document' ? 'cth: https://notes.yale.edu/syllabus/handout.pdf' :
                          formType === 'web_link' ? 'cth: https://quizizz.com/join?gc=123456' :
                          'Tinggalkan kosong bila tidak ada link pendukung.'
                        }
                        value={formUrl}
                        onChange={(e) => setFormUrl(e.target.value)}
                        className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none text-[#3E3831] font-mono"
                      />
                    )}

                    {/* Local File Upload Component for Document, Audio, and Video */}
                    {(formType === 'document' || formType === 'audio' || formType === 'video') && (
                      <div className="mt-3 p-3.5 bg-[#FAF9F5]/80 border border-dashed border-[#8B7355]/30 rounded-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-stone-700 block flex items-center gap-1">
                              <FileUp className="w-3.5 h-3.5 text-[#8B7355]" />
                              Metode Alternatif: Unggah File Langsung (Max 3.5MB)
                            </span>
                            <p className="text-[10px] text-stone-500">
                              Mendukung PDF, Word (.docx), Excel (.xlsx), PPT (.pptx), MP3 Audio, Audio Rekaman, atau Gambar.
                            </p>
                          </div>
                          
                          <label className="px-4 py-1.5 bg-[#8B7355]/10 hover:bg-[#8B7355]/20 text-[#8B7355] rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 border border-[#8B7355]/20 flex items-center gap-1.5 active:scale-95">
                            <FileUp className="w-3.5 h-3.5" />
                            {uploading ? 'Memproses Berkas...' : 'Pilih File / Cari Berkas'}
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp3,.wav,.png,.jpg,.jpeg,.gif"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {uploadNote && (
                          <div className="mt-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 rounded-lg p-2 border border-emerald-200/50 flex items-center justify-between">
                            <span>{uploadNote}</span>
                            <button 
                              type="button" 
                              onClick={() => { setFormUrl(''); setUploadNote(''); }}
                              className="text-rose-700 hover:underline cursor-pointer font-bold text-[9px]"
                            >
                              Hapus Upload
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Short description */}
                <div>
                  <label className="block text-xs font-bold text-[#8B7355] mb-1">DESKRIPSI SINGKAT *</label>
                  <input
                    type="text"
                    required
                    maxLength={140}
                    placeholder="Tuliskan rangkuman isi materi dalam satu kalimat pendek."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none text-[#3E3831]"
                  />
                </div>

                {/* Main Body content module */}
                <div>
                  <label className="block text-xs font-bold text-[#8B7355] mb-1">NASKAH PENUH MODUL (MENDUKUNG MULTILINE)</label>
                  <textarea
                    rows={6}
                    placeholder="Sajikan naskah modul pengajaran terperinci. Gunakan simbol Aramaik untuk mendemonstrasikan aksara luhur."
                    value={formBodyText}
                    onChange={(e) => setFormBodyText(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none text-[#3E3831] font-serif"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8B7355] hover:bg-[#5E584E] text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    {isEditing ? 'Perbarui Materi' : 'Simpan Materi'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of active materials */}
          <div className="space-y-4">
            {materials.map((mat) => (
              <div key={mat.id} className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm hover:border-[#8B7355]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-stone-100 rounded-xl mt-1 shrink-0 bg-[#FAF9F5] border border-[#E8E2D9]">
                    {mat.type === 'video' && <Video className="w-5 h-5 text-amber-600" />}
                    {mat.type === 'audio' && <Volume2 className="w-5 h-5 text-indigo-600" />}
                    {mat.type === 'document' && <FileText className="w-5 h-5 text-emerald-600" />}
                    {mat.type === 'text' && <Globe className="w-5 h-5 text-stone-600" />}
                    {mat.type === 'iframe' && <Columns className="w-5 h-5 text-teal-600" />}
                    {mat.type === 'html' && <Code2 className="w-5 h-5 text-purple-600" />}
                    {mat.type === 'web_link' && <ExternalLink className="w-5 h-5 text-blue-600" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-[#FAF9F5] text-[#8B7355] border border-[#E8E2D9] text-[9px] font-mono rounded font-bold">
                        {mat.category}
                      </span>
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[9px] font-mono rounded font-medium">
                        {mat.type === 'text' && '📖 Buku Teks'}
                        {mat.type === 'video' && '🎥 Video'}
                        {mat.type === 'audio' && '🎵 Audio'}
                        {mat.type === 'document' && '📂 Dokumen'}
                        {mat.type === 'iframe' && '🔗 Tersemat (iFrame)'}
                        {mat.type === 'html' && '💻 Widget HTML'}
                        {mat.type === 'web_link' && '🌐 Link Web'}
                      </span>
                      <span className="text-xxs text-[#8B7355] font-mono flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-[#8B7355]" />
                        {mat.estimatedMinutes} Menit
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#3E3831] font-serif">{mat.title}</h4>
                    <p className="text-xs text-[#5E584E] line-clamp-1">{mat.description}</p>
                    {mat.contentUrl && (
                      <span className="text-[10px] text-stone-400 font-mono block max-w-md truncate">
                        {mat.contentUrl.startsWith('data:') ? '📂 File Terunggah Secara Lokal (Base64)' : `URL: ${mat.contentUrl}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 md:justify-end">
                  <button
                    onClick={() => handleEditClick(mat)}
                    className="p-2 bg-[#FAF9F5] hover:bg-stone-150 text-[#3E3831] rounded-xl hover:text-stone-900 border border-[#E8E2D9] transition-colors flex items-center gap-1 text-xxs font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(mat.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl border border-red-100 transition-colors flex items-center gap-1 text-xxs font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Hapus
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB B: SUBMISSIONS GRADIND AREA */}
      {activeTab === 'submissions' && (
        <div id="admin-submissions-reviewer" className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm">
            <h3 className="text-base font-bold text-[#3E3831] font-serif">Cek Log Pengumpulan & Skor Peserta</h3>
            <p className="text-xs text-[#5E584E] mt-0.5">Semua kiriman tugas tertulis siswa di seluruh kelas terangkum di sini untuk diperiksa, ditanggapi, dan diberi bobot nilai.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left list of submissions */}
            <div className="lg:col-span-7 space-y-4">
              {submissions.length === 0 ? (
                <div className="p-8 bg-white text-center text-stone-400 rounded-2xl border border-[#E8E2D9] select-none">
                  Belum ada siswa yang mengirimkan tugas lembar kerja.
                </div>
              ) : (
                submissions.map((sub) => {
                  const assignment = assignments.find(a => a.id === sub.assignmentId) || { title: 'Tugas Mandiri', maxScore: 100 };
                  const isGraded = sub.status === 'graded';
                  const isSelected = gradingSubmissionId === sub.id;

                  return (
                    <div 
                      key={sub.id} 
                      className={`bg-white p-5 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'border-[#8B7355] ring-1 ring-[#8B7355]' 
                          : isGraded 
                            ? 'border-[#E8E2D9] hover:border-[#8B7355]/40' 
                            : 'border-amber-200 bg-amber-50/10 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 border-b border-[#E8E2D9] pb-3">
                        <div>
                          <span className="text-[10px] font-mono text-[#8B7355] font-extrabold uppercase">
                            {assignment.title}
                          </span>
                          <h4 className="text-xs font-bold text-[#3E3831] mt-1 font-serif">
                            Siswa: {sub.studentName}
                          </h4>
                        </div>

                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase ${
                          isGraded 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isGraded ? 'Sudah Dinilai' : 'Butuh Penilaian'}
                        </span>
                      </div>

                      {/* Submitted response text styled correctly */}
                      <div className="my-3 bg-[#FAF9F5] p-3 rounded-xl border border-[#E8E2D9]">
                        <span className="text-[9px] font-mono text-[#8B7355] block mb-1">Teks Jawaban Siswa (RTL Flow):</span>
                        <p className={`text-sm font-semibold text-[#3E3831] ${getFontClass()} text-right`} style={{ direction: 'rtl' }}>
                          {sub.content}
                        </p>
                      </div>

                      {/* Score metrics summary */}
                      {isGraded ? (
                        <div className="flex justify-between items-center bg-[#FAF9F5] p-3 rounded-xl border border-[#E8E2D9] text-[#5E584E]">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-[#8B7355] block">Skor Kelulusan:</span>
                            <span className="text-xs font-bold text-stone-800">{sub.grade} / {assignment.maxScore}</span>
                          </div>
                          <div className="space-y-0.5 text-right">
                            <span className="text-[10px] font-mono text-[#8B7355] block">Umpan Balik Instruktur:</span>
                            <span className="text-xxs italic text-stone-600 block">"{sub.feedback}"</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              setGradingSubmissionId(sub.id);
                              setGradeValue(100);
                              setFeedbackText('');
                            }}
                            className="px-3 py-1.5 bg-[#8B7355] hover:bg-[#5E584E] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-white" />
                            Nilai Tugas Ini
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

            {/* Right scoring controls form panel */}
            <div className="lg:col-span-5">
              {gradingSubmissionId ? (() => {
                const sub = submissions.find(s => s.id === gradingSubmissionId);
                const assignment = sub ? assignments.find(a => a.id === sub.assignmentId) : null;
                if (!sub || !assignment) return null;

                return (
                  <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-md space-y-4">
                    <h4 className="text-sm font-bold text-[#3E3831] font-serif flex items-center gap-1 justify-center border-b border-[#E8E2D9] pb-2">
                      <Award className="w-4 h-4 text-[#8B7355]" />
                      Kotak Penilaian Tugas
                    </h4>
                    <p className="text-xxs text-[#5E584E]">
                      Anda sedang memberikan skor evaluasi untuk <strong>{sub.studentName}</strong> pada tugas: "{assignment.title}".
                    </p>

                    <form onSubmit={handleGradeFormSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-xxs font-mono text-[#8B7355] uppercase mb-1 font-bold">
                          Skor Kriteria (Maksimal {assignment.maxScore}) *
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          max={assignment.maxScore}
                          value={gradeValue}
                          onChange={(e) => setGradeValue(Number(e.target.value))}
                          className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8B7355]/30 text-[#3E3831]"
                        />
                      </div>

                      <div>
                        <label className="block text-xxs font-mono text-[#8B7355] uppercase mb-1 font-bold">
                          Pesan Evaluasi & Umpan Balik *
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder="cth: Goresan Alaph-Beth yang luar biasa presisi! Jaga lafal glottalnya agar tetap lantang."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8B7355]/30 text-[#423D33]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setGradingSubmissionId(null)}
                          className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
                        >
                          Kirim Nilai
                        </button>
                      </div>

                    </form>
                  </div>
                );
              })() : (
                <div className="p-8 border-2 border-dashed border-[#E8E2D9] rounded-2xl text-center flex flex-col items-center justify-center space-y-2 opacity-60 bg-[#FAF9F5]">
                  <MessageSquare className="w-10 h-10 text-[#8B7355]" />
                  <h4 className="text-xs font-bold text-[#3E3831]">Panel Evaluasi Kosong</h4>
                  <p className="text-xxs text-[#5E584E] max-w-[200px]">Silakan klik tombol "Nilai Tugas Ini" pada deretan submissions di kiri untuk membuka panel grading.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB C: STUDENTS ACCESS APPROVAL (USER MANAGEMENT) */}
      {activeTab === 'users' && (
        <div id="admin-users-approval" className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-sm">
            <h3 className="text-base font-bold text-[#3E3831] font-serif">Pemberian Izin & Persetujuan Akun Murid</h3>
            <p className="text-xs text-[#5E584E] mt-0.5">
              Tinjau esai motivasi pendaftar baru mandiri. Sebagai admin, Anda berhak menyetujui (Approved) agar mereka dapat login, atau menolak (Disapproved) akses masuk mereka.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-sm">
            <div className="p-4 bg-[#FAF9F5] border-b border-[#E8E2D9] flex items-center justify-between">
              <span className="text-xs font-bold text-[#3E3831] uppercase tracking-wider font-mono">Daftar Pendaftaran Aktif</span>
              <span className="text-xxs font-mono text-[#8B7355]">Total: {users.filter(u => u.role === 'member').length} Pendaftar</span>
            </div>

            <div className="divide-y divide-[#E8E2D9]">
              {users.filter(u => u.role === 'member').length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  Belum ada siswa yang mendaftar atau terdaftar di database.
                </div>
              ) : (
                users.filter(u => u.role === 'member').map((student) => {
                  return (
                    <div key={student.id} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-[#FAF9F5]/30 transition-colors">
                      
                      <div className="space-y-3 max-w-2xl flex-1 text-left">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="text-sm font-bold text-[#3E3831] font-serif">{student.name}</h4>
                          <span className="text-stone-300">•</span>
                          <span className="text-xs font-mono text-stone-500">{student.email}</span>
                          <span className="text-stone-300">•</span>
                          <span className="text-xxs font-mono bg-[#FAF9F5] text-stone-600 px-2 py-0.5 rounded border border-[#E8E2D9]">
                            ID: {student.id}
                          </span>
                          
                          {/* Status Badge */}
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            student.status === 'approved' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : student.status === 'disapproved'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {student.status === 'approved' && '● Approved (Bisa Login)'}
                            {student.status === 'disapproved' && '● Disapproved (Ditolak)'}
                            {student.status === 'pending' && '● Pending (Menunggu)'}
                          </span>
                        </div>

                        {/* Motivation Essay Render */}
                        <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E8E2D9] space-y-1 text-left">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-[#8B7355] block font-bold">
                            Alasan & Motivasi Ikut Kursus Aramaik:
                          </span>
                          <p className="text-xs text-[#423D33] leading-relaxed italic">
                            "{student.motivation || 'Tidak memasukkan motivasi.'}"
                          </p>
                        </div>
                      </div>

                      {/* Admin Decision Tools */}
                      <div className="flex sm:flex-row md:flex-col lg:flex-row items-center gap-2 shrink-0 md:justify-end">
                        <button
                          onClick={() => onUpdateUserStatus(student.id, 'approved')}
                          disabled={student.status === 'approved'}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                            student.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-400 border border-emerald-100 cursor-not-allowed opacity-50'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                          title="Izinkan murid ini masuk dan mulai belajar"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Setujui (Approve)
                        </button>

                        <button
                          onClick={() => onUpdateUserStatus(student.id, 'disapproved')}
                          disabled={student.status === 'disapproved'}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                            student.status === 'disapproved'
                              ? 'bg-red-50 text-red-400 border border-red-100 cursor-not-allowed opacity-50'
                              : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                          }`}
                          title="Tolak akses login siswa ke platform"
                        >
                          <XCircle className="w-4 h-4" />
                          Tolak (Disapprove)
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
