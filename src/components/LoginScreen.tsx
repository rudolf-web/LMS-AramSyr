import React, { useState } from 'react';
import { Shield, BookOpen, Clock, UserCheck, ShieldAlert, Sparkles, LogIn, Lock, Mail, Clipboard, KeyRound } from 'lucide-react';
import { User } from '../types';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  users: User[];
  onRegister: (newUser: User) => void;
}

export default function LoginScreen({ onLogin, users, onRegister }: LoginScreenProps) {
  const [view, setView] = useState<'login' | 'register'>('login');
  
  // Login input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [isGooglePanelOpen, setIsGooglePanelOpen] = useState(false);

  // Register input states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMotivation, setRegMotivation] = useState('');
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Handle traditional Login
  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const email = loginEmail.trim();
    const password = loginPassword;

    if (!email || !password) {
      setLoginError('Silakan masukkan email dan password.');
      return;
    }

    try {
      // Firebase length check is 6 characters. If they typed 'admin' which is 5 chars,
      // let's internally use 'admin123' to authenticate seamlessly!
      let authPassword = password;
      if (email.toLowerCase() === 'rudolflms@gmail.com' && password === 'admin') {
        authPassword = 'admin123';
      }

      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, authPassword);
      } catch (authErr: any) {
        // If user is a seed / default account (Yusuf or Rudolf) and doesn't exist yet in their new auth project,
        // automatically register them on their fresh Firebase Auth project in background!
        if (
          (email.toLowerCase() === 'siswa.yusuf@aramaic.org' && password === 'password123') ||
          (email.toLowerCase() === 'demo.publik@aramaic.org' && password === 'demopublik123') ||
          (email.toLowerCase() === 'rudolflms@gmail.com' && password === 'admin')
        ) {
          userCredential = await createUserWithEmailAndPassword(auth, email, authPassword);
        } else {
          throw authErr;
        }
      }

      // Check if user has a profile in the local database
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!foundUser) {
        // Create an approved profile if they managed to authenticate (or if it's the admin)
        const isRudolf = email.toLowerCase() === 'rudolflms@gmail.com';
        const isDemo = email.toLowerCase() === 'demo.publik@aramaic.org';
        const newResolvedUser: User = {
          id: userCredential.user.uid,
          name: isRudolf 
            ? 'Rudolf A. Luhukay (Aramaic Scholar)' 
            : isDemo 
              ? 'Tamu Publik (Demo Eksplorasi)' 
              : 'Siswa Baru',
          email: email.toLowerCase(),
          role: isRudolf ? 'admin' : 'member',
          status: 'approved',
          motivation: isDemo 
            ? 'Mengeksplorasi secara publik dan merasakan keindahan antarmuka pembelajaran Aramaik secara gratis (Khusus Bab 1).'
            : 'Belajar mandiri via Firebase Auth.',
          isDemo: isDemo
        };
        onRegister(newResolvedUser);
        onLogin(newResolvedUser);
        return;
      }

      // Role-based status checking
      if (foundUser.role === 'member') {
        if (foundUser.status === 'pending') {
          setLoginError('📋 Pendaftaran Anda masih dalam status PENDING. Mohon menunggu persetujuan (approval) dari Admin Rudolf sebelum Anda bisa masuk.');
          await signOut(auth);
          return;
        }
        if (foundUser.status === 'disapproved') {
          setLoginError('🛑 Mohon maaf, pendaftaran Anda ditolak (DISAPPROVED) oleh Admin Rudolf. Silakan hubungi pengajar.');
          await signOut(auth);
          return;
        }
      }

      // Successful login
      onLogin(foundUser);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setLoginError('Kombinasi email atau password salah. Silakan periksa kembali atau daftar baru.');
      } else if (err.code === 'auth/weak-password') {
        setLoginError('Password minimal harus terdiri dari 6 karakter.');
      } else {
        setLoginError(`Gagal Masuk: ${err.message || 'Kesalahan autentikasi.'}`);
      }
    }
  };

  // Handle Google generic & auto Admin login
  const handleGoogleSignInAction = () => {
    setLoginError('');
    const trimmedEmail = googleEmail.trim().toLowerCase();

    if (!trimmedEmail) {
      setLoginError('Silakan masukkan alamat email Google Anda.');
      return;
    }

    // Check if it is specifically rudolflms@gmail.com
    if (trimmedEmail === 'rudolflms@gmail.com') {
      const adminUser = users.find((u) => u.email.toLowerCase() === 'rudolflms@gmail.com') || {
        id: 'user_admin',
        name: 'Rudolf A. Luhukay (Aramaic Scholar)',
        email: 'rudolflms@gmail.com',
        role: 'admin' as const,
        status: 'approved' as const,
        motivation: 'Mengajar aksara dan melestarikan warisan linguistik luhur.'
      };
      onLogin(adminUser);
      return;
    }

    if (trimmedEmail === 'demo.publik@aramaic.org') {
      const demoUser = users.find((u) => u.email.toLowerCase() === 'demo.publik@aramaic.org') || {
        id: 'user_demo_public',
        name: 'Tamu Publik (Demo Eksplorasi)',
        email: 'demo.publik@aramaic.org',
        role: 'member' as const,
        status: 'approved' as const,
        motivation: 'Mengeksplorasi secara publik dan merasakan keindahan antarmuka pembelajaran Aramaik secara gratis (Khusus Bab 1).',
        isDemo: true
      };
      onLogin(demoUser);
      return;
    }

    // Lookup other user by email in the registered users list
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!foundUser) {
      setLoginError('Akun Google ini belum terdaftar di platform kami. Silakan isi form Pendaftaran terlebih dahulu.');
      return;
    }

    // Check approval status
    if (foundUser.role === 'member') {
      if (foundUser.status === 'pending') {
        setLoginError('📋 Akun Anda terdeteksi di database namun masih berstatus PENDING. Mohon menunggu persetujuan Admin Rudolf sebelum dapat masuk.');
        return;
      }
      if (foundUser.status === 'disapproved') {
        setLoginError('🛑 Akses akun Google ini ditolak (DISAPPROVED) oleh Admin Rudolf.');
        return;
      }
    }

    // Automatically login approved members
    onLogin(foundUser);
  };

  // Handle Sign-Up submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccessMsg('');

    const email = regEmail.trim();
    const password = regPassword;
    const name = regName.trim();
    const motivation = regMotivation.trim();

    if (!name || !email || !password || !motivation) {
      setRegisterError('Semua isian formulir wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setRegisterError('Password minimal harus terdiri dari 6 karakter.');
      return;
    }

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Create local pending profile linked to Firebase UID
      const isRudolf = email.toLowerCase() === 'rudolflms@gmail.com';
      const newPendingUser: User = {
        id: userCredential.user.uid,
        name: name,
        email: email.toLowerCase(),
        role: isRudolf ? 'admin' : 'member',
        status: isRudolf ? 'approved' : 'pending',
        motivation: motivation,
      };

      onRegister(newPendingUser);
      
      // Clear registration fields
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegMotivation('');
      
      if (isRudolf) {
        setRegisterSuccessMsg(
          '🎉 PENDAFTARAN BERHASIL! Anda terdaftar sebagai Admin Rudolf. Silakan login untuk mengelola sistem.'
        );
      } else {
        setRegisterSuccessMsg(
          '🎉 PENDAFTARAN BERHASIL! Data Anda telah terkirim ke Firebase Auth & Sistem Lokal. Akun Anda saat ini berstatus PENDING dan sedang menunggu peninjauan/persetujuan (approval) dari Admin Rudolf. Silakan cek berkala halaman ini untuk masuk.'
        );
      }
      
      // Auto sign out to prevent auto-login of pending user
      await signOut(auth);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setRegisterError('Email ini sudah terdaftar di Firebase Auth. Silakan login atau gunakan email lain.');
      } else if (err.code === 'auth/invalid-email') {
        setRegisterError('Format email tidak valid.');
      } else if (err.code === 'auth/weak-password') {
        setRegisterError('Password terlalu lemah. Minimal terdiri dari 6 karakter.');
      } else {
        setRegisterError(`Gagal Mendaftar: ${err.message || 'Terjadi kesalahan.'}`);
      }
    }
  };


  return (
    <div id="login-screen-bg" className="min-h-screen flex items-center justify-center bg-[#F9F6F0] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[radial-gradient(#E8E2D9_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#3E3831]/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#8B7355]/5 blur-3xl" />

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-[#E8E2D9] shadow-xl relative z-10 transition-all duration-300">
        
        {/* App Branding Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-[#3E3831] text-[#FAF9F5] rounded-full flex items-center justify-center shadow-lg border-2 border-[#8B7355] transition-transform duration-500 hover:rotate-12">
            <span className="text-4xl font-semibold select-none font-aramaic">ܐܒ</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-[#3E3831] tracking-tight font-serif">
            LMS Bahasa Aramaik
          </h2>
          <p className="mt-2 text-xs font-mono text-[#8B7355] uppercase tracking-widest flex items-center justify-center gap-1 font-bold">
            <span>𐡀𐡁𐡂𐡃</span>
            <span>•</span>
            <span>Syriac Learning Portal</span>
            <span>•</span>
            <span>𐡄𐡅𐡆𐡇</span>
          </p>
          <p className="mt-2 text-xs text-[#5E584E] max-w-sm mx-auto">
            Akses Pembelajaran mandiri Bahasa Aram-syriac
          </p>
        </div>

        {/* VIEW A: LOGIN VIEW */}
        {view === 'login' && (
          <div className="space-y-6">
            
            {/* Success notification banner */}
            {registerSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5 shadow-sm">
                <UserCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{registerSuccessMsg}</p>
              </div>
            )}

            {/* Error messaging state */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start gap-2 shadow-sm animate-shake">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{loginError}</p>
              </div>
            )}

            {/* Clean Traditional Login Form */}
            <form onSubmit={handleTraditionalLogin} className="space-y-4">
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="login-email-input" className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-1">
                    E-mail Peserta
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      placeholder="Masukkan alamat email terdaftar"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 text-[#423D33] font-sans"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="login-password-input" className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password-input"
                      type="password"
                      required
                      placeholder="Masukkan password Anda"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 text-[#423D33] font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Login Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#8B7355] hover:bg-[#5E584E] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Masuk ke Kursus (MEMBER LOGIN)
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#E8E2D9]"></div>
              <span className="flex-shrink mx-4 text-[10px] text-stone-400 font-mono uppercase tracking-widest">Atau</span>
              <div className="flex-grow border-t border-[#E8E2D9]"></div>
            </div>

            {/* Google Login with optional auto-login for Admin Rudolf or approved member accounts */}
            <div className="space-y-3">
              <button
                type="button"
                id="google-sign-in"
                onClick={() => {
                  setIsGooglePanelOpen(!isGooglePanelOpen);
                  setLoginError('');
                }}
                className="w-full py-3 bg-white hover:bg-[#FAF9F5] border-2 border-[#E8E2D9] hover:border-[#8B7355]/40 text-[#3E3831] font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
              >
                <img 
                  src='https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_"G"_logo.svg' 
                  alt="Google Brand" 
                  className="w-4 h-4"
                  onError={(e) => {
                    // Fallback to stylized vector circle if blocked or unavailable
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="font-sans font-extrabold uppercase text-[#8B7355] tracking-tight">Masuk dengan Google</span>
              </button>

              {isGooglePanelOpen && (
                <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E8E2D9] space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-500">
                      Simulasi Google Sign-In
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setIsGooglePanelOpen(false)}
                      className="text-[10px] text-stone-400 hover:text-stone-600 font-bold"
                    >
                      Batal
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      id="google-email-input"
                      type="email"
                      placeholder="Masukkan email Google Anda..."
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 text-[#3E3831]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleGoogleSignInAction();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleGoogleSignInAction}
                      className="w-full py-2 bg-[#8B7355] hover:bg-[#5E584E] text-white text-xxs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Lanjutkan Masuk
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Link to Sign Up View */}
            <div className="pt-4 border-t border-[#E8E2D9] text-center">
              <p className="text-xs text-[#5E584E]">
                Belum pernah mendaftar kursus bahasa Aramaik ini?
              </p>
              <button
                type="button"
                onClick={() => {
                  setView('register');
                  setRegisterSuccessMsg('');
                  setRegisterError('');
                  setLoginError('');
                }}
                className="mt-2 text-xs font-bold text-[#8B7355] hover:text-[#3E3831] hover:underline transition-all cursor-pointer font-serif text-md"
              >
                ➔ Klik di Sini untuk Pendaftaran / Sign-Up
              </button>
            </div>

          </div>
        )}

        {/* VIEW B: SIGN UP FORM VIEW */}
        {view === 'register' && (
          <div className="space-y-6">
            
            <div className="border-b border-[#E8E2D9] pb-3 text-center">
              <h3 className="text-base font-bold text-[#3E3831] font-serif">Formulir Pendaftaran Kelas Aramaik</h3>
              <p className="text-[11px] text-[#5E584E] mt-1">
                Silakan isi data diri Anda secara lengkap. Berkas pendaftaran akan divalidasi manual dan disetujui oleh pengajar.
              </p>
            </div>

            {/* Error in form input */}
            {registerError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start gap-1.5 shadow-sm">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p>{registerError}</p>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              
              <div>
                <label htmlFor="reg-name-input" className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-1">
                  Nama Lengkap *
                </label>
                <input
                  id="reg-name-input"
                  type="text"
                  required
                  placeholder="cth: Yusuf Al-Khalid"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 text-[#3E3831] font-sans"
                />
              </div>

              <div>
                <label htmlFor="reg-email-input" className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-1">
                  Email Akun *
                </label>
                <input
                  id="reg-email-input"
                  type="email"
                  required
                  placeholder="cth: yusuf@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 text-[#3E3831] font-sans"
                />
              </div>

              <div>
                <label htmlFor="reg-password-input" className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-1">
                  Password Akun *
                </label>
                <input
                  id="reg-password-input"
                  type="password"
                  required
                  placeholder="Buat password untuk login"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 text-[#3E3831] font-sans"
                />
              </div>

              <div>
                <label htmlFor="reg-motivation-textarea" className="block text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-1">
                  Motivasi Mengikuti Kursus Aramaik *
                </label>
                <textarea
                  id="reg-motivation-textarea"
                  required
                  rows={3}
                  placeholder="Mohon ketikkan alasan Anda terpanggil mempelajari aksara Aramaik Suryani luhur ini..."
                  value={regMotivation}
                  onChange={(e) => setRegMotivation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#E8E2D9] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 text-[#3E3831] font-sans leading-relaxed"
                />
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#3E3831] hover:bg-[#2D2823] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#8B7355]" />
                Kirim Formulir Pendaftaran (Sign-Up)
              </button>

            </form>

            {/* Back to Login toggler */}
            <div className="pt-4 border-t border-[#E8E2D9] text-center">
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setRegisterError('');
                }}
                className="text-xs font-bold text-[#8B7355] hover:text-[#3E3831] hover:underline cursor-pointer"
              >
                ➔ Sudah punya akun? Kembali ke Halaman Log In
              </button>
            </div>

          </div>
        )}

        {/* Footer legalities */}
        <div className="text-center pt-2">
          <span className="text-[9px] text-[#8B7355] block font-mono">
            Syriac-Aramaic Language LMS Portal v1.2 • 2026
          </span>
        </div>

      </div>
    </div>
  );
}
