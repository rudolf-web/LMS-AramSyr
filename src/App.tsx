/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, BookOpen, GraduationCap, LogOut, RefreshCw, 
  User as UserIcon, Shield, Layers, HelpCircle, ListTodo, CloudLightning
} from 'lucide-react';
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { User, Material, Assignment, Submission, FontStyle, UserProgress } from './types';
import { INITIAL_MATERIALS, INITIAL_QUIZ_QUESTIONS, INITIAL_ASSIGNMENTS } from './data/materials';
import LoginScreen from './components/LoginScreen';
import DashboardStudent from './components/DashboardStudent';
import DashboardAdmin from './components/DashboardAdmin';

// Default mock student progress structure
const DEFAULT_PROGRESS: UserProgress = {
  memberId: 'user_student_1',
  completedMaterials: ['mat_1'], // Starts with introductory reading completed
  completedLetters: ['ܐ', 'ܒ'], // Started reviewing Alaph and Beth
  quizScores: { 'general_quiz': 80 }, // Seeded mock score for overview
  streakDays: 4,
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isOriginallyAdmin, setIsOriginallyAdmin] = useState<boolean>(() => {
    return localStorage.getItem('aramaic_original_user_is_admin') === 'true';
  });
  const [fontStyle, setFontStyle] = useState<FontStyle>('estrangelo');

  // Curriculum & Task States
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [users, setUsers] = useState<User[]>([]);

  // Firebase status variables
  const [firebaseConnected, setFirebaseConnected] = useState<boolean | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Initialize Data & synchronize with Cloud Firestore (or localStorage fallback)
  useEffect(() => {
    async function initializeAndSyncData() {
      setSyncing(true);
      try {
        // --- 1. SYNCING REGISTERED USERS ---
        const usersCol = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCol);
        let currentUsers: User[] = [];

        const DEFAULT_USERS: User[] = [
          {
            id: 'user_student_1',
            name: 'Siswa Yusuf (Murid Pemula)',
            email: 'siswa.yusuf@aramaic.org',
            password: 'password123',
            role: 'member',
            status: 'approved',
            motivation: 'Ingin mendalami aksara kuno Aramaik dan makna glif di baliknya.'
          },
          {
            id: 'user_admin',
            name: 'Rudolf A. Luhukay (Aramaic Scholar)',
            email: 'rudolflms@gmail.com',
            password: 'admin',
            role: 'admin',
            status: 'approved',
            motivation: 'Mengajar aksara dan melestarikan warisan linguistik luhur.'
          }
        ];

        if (usersSnapshot.empty) {
          // Sync default seeding to Firebase
          for (const u of DEFAULT_USERS) {
            await setDoc(doc(db, 'users', u.id), u);
          }
          currentUsers = DEFAULT_USERS;
        } else {
          usersSnapshot.forEach(docSnap => {
            currentUsers.push(docSnap.data() as User);
          });
        }
        setUsers(currentUsers);
        localStorage.setItem('aramaic_all_users', JSON.stringify(currentUsers));

        // --- 2. SYNCING MATERIALS ---
        const matsCol = collection(db, 'materials');
        const matsSnapshot = await getDocs(matsCol);
        let currentMaterials: Material[] = [];

        if (matsSnapshot.empty) {
          for (const m of INITIAL_MATERIALS) {
            await setDoc(doc(db, 'materials', m.id), m);
          }
          currentMaterials = INITIAL_MATERIALS;
        } else {
          matsSnapshot.forEach(docSnap => {
            currentMaterials.push(docSnap.data() as Material);
          });
          if (currentMaterials.length === 0) {
            for (const m of INITIAL_MATERIALS) {
              await setDoc(doc(db, 'materials', m.id), m);
            }
            currentMaterials = INITIAL_MATERIALS;
          }
        }
        setMaterials(currentMaterials);
        localStorage.setItem('aramaic_materials', JSON.stringify(currentMaterials));

        // --- 3. SYNCING ASSIGNMENTS ---
        const assignCol = collection(db, 'assignments');
        const assignSnapshot = await getDocs(assignCol);
        let currentAssignments: Assignment[] = [];

        if (assignSnapshot.empty) {
          for (const a of INITIAL_ASSIGNMENTS) {
            await setDoc(doc(db, 'assignments', a.id), a);
          }
          currentAssignments = INITIAL_ASSIGNMENTS;
        } else {
          assignSnapshot.forEach(docSnap => {
            currentAssignments.push(docSnap.data() as Assignment);
          });
          if (currentAssignments.length === 0) {
            for (const a of INITIAL_ASSIGNMENTS) {
              await setDoc(doc(db, 'assignments', a.id), a);
            }
            currentAssignments = INITIAL_ASSIGNMENTS;
          }
        }
        setAssignments(currentAssignments);
        localStorage.setItem('aramaic_assignments', JSON.stringify(currentAssignments));

        // --- 4. SYNCING TASK SUBMISSIONS ---
        const subCol = collection(db, 'submissions');
        const subSnapshot = await getDocs(subCol);
        let currentSubmissions: Submission[] = [];

        const demoSubmission: Submission = {
          id: 'sub_demo_1',
          assignmentId: 'assign_1',
          studentId: 'user_student_1',
          studentName: 'Siswa Yusuf (Murid Pemula)',
          submittedAt: '17 Juni 2026, 18:15',
          content: 'ܐܒܓܕ — Alaph melambangkan seekor sapi jantan yang berarti kekuatan luhur, Beth melambangkan rumah tempat bernaung, Gamal melambangkan unta penolong melintasi padang gurun gersang, dan Dalath melambangkan pintu gerbang raga.',
          status: 'pending',
        };

        if (subSnapshot.empty) {
          await setDoc(doc(db, 'submissions', demoSubmission.id), demoSubmission);
          currentSubmissions = [demoSubmission];
        } else {
          subSnapshot.forEach(docSnap => {
            currentSubmissions.push(docSnap.data() as Submission);
          });
          if (currentSubmissions.length === 0) {
            await setDoc(doc(db, 'submissions', demoSubmission.id), demoSubmission);
            currentSubmissions = [demoSubmission];
          }
        }
        setSubmissions(currentSubmissions);
        localStorage.setItem('aramaic_submissions', JSON.stringify(currentSubmissions));

        setFirebaseConnected(true);
      } catch (err) {
        console.warn('Firebase connection failed, falling back to cached system localStorage.', err);
        setFirebaseConnected(false);

        // Fallback restoration
        const cachedUsers = localStorage.getItem('aramaic_all_users');
        const parsedUsers = cachedUsers ? JSON.parse(cachedUsers) : [];
        setUsers(parsedUsers && parsedUsers.length > 0 ? parsedUsers : [
          {
            id: 'user_student_1',
            name: 'Siswa Yusuf (Murid Pemula)',
            email: 'siswa.yusuf@aramaic.org',
            password: 'password123',
            role: 'member',
            status: 'approved',
            motivation: 'Ingin mendalami aksara kuno Aramaik dan makna glif di baliknya.'
          },
          {
            id: 'user_admin',
            name: 'Rudolf A. Luhukay (Aramaic Scholar)',
            email: 'rudolflms@gmail.com',
            password: 'admin',
            role: 'admin',
            status: 'approved',
            motivation: 'Mengajar aksara dan melestarikan warisan linguistik luhur.'
          }
        ]);

        const cachedMaterials = localStorage.getItem('aramaic_materials');
        const parsedMaterials = cachedMaterials ? JSON.parse(cachedMaterials) : [];
        setMaterials(parsedMaterials && parsedMaterials.length > 0 ? parsedMaterials : INITIAL_MATERIALS);

        const cachedAssignments = localStorage.getItem('aramaic_assignments');
        const parsedAssignments = cachedAssignments ? JSON.parse(cachedAssignments) : [];
        setAssignments(parsedAssignments && parsedAssignments.length > 0 ? parsedAssignments : INITIAL_ASSIGNMENTS);

        const cachedSubmissions = localStorage.getItem('aramaic_submissions');
        const parsedSubmissions = cachedSubmissions ? JSON.parse(cachedSubmissions) : [];
        setSubmissions(parsedSubmissions && parsedSubmissions.length > 0 ? parsedSubmissions : [
          {
            id: 'sub_demo_1',
            assignmentId: 'assign_1',
            studentId: 'user_student_1',
            studentName: 'Siswa Yusuf (Murid Pemula)',
            submittedAt: '17 Juni 2026, 18:15',
            content: 'ܐܒܓܕ — Alaph melambangkan seekor sapi jantan yang berarti kekuatan luhur, Beth melambangkan rumah tempat bernaung, Gamal melambangkan unta penolong melintasi padang gurun gersang, dan Dalath melambangkan pintu gerbang raga.',
            status: 'pending',
          }
        ]);
      } finally {
        setSyncing(false);
      }
    }

    initializeAndSyncData();
 
    // Recover cached active session
    const cachedUser = localStorage.getItem('aramaic_current_user');
    if (cachedUser) {
      const parsedUser = JSON.parse(cachedUser) as User;
      setUser(parsedUser);
      if (parsedUser.role === 'admin' || localStorage.getItem('aramaic_original_user_is_admin') === 'true') {
        setIsOriginallyAdmin(true);
        localStorage.setItem('aramaic_original_user_is_admin', 'true');
      }
    }
  }, []);

  // Validate logged in user approval status against latest cloud database users list
  useEffect(() => {
    if (!user) return;
    // Admins or simulated admins do not require further approval checks
    if (user.role === 'admin' || isOriginallyAdmin) return;

    // For regular members
    const matchedUser = users.find(u => u.id === user.id);
    if (matchedUser) {
      if (matchedUser.status !== 'approved') {
        setUser(null);
        setIsOriginallyAdmin(false);
        localStorage.removeItem('aramaic_current_user');
        localStorage.removeItem('aramaic_original_user_is_admin');
        alert("🔒 Akses Diblokir: Pendaftaran atau status akun Anda belum disetujui (PENDING) atau telah dinonaktifkan oleh Admin Rudolf Luhukay.");
      } else if (user.status !== 'approved' || user.name !== matchedUser.name || user.role !== matchedUser.role) {
        setUser(matchedUser);
        localStorage.setItem('aramaic_current_user', JSON.stringify(matchedUser));
      }
    } else {
      if (users.length > 0) {
        setUser(null);
        setIsOriginallyAdmin(false);
        localStorage.removeItem('aramaic_current_user');
        localStorage.removeItem('aramaic_original_user_is_admin');
      }
    }
  }, [users, user, isOriginallyAdmin]);

  // Sync member specific progress once they trigger login session
  useEffect(() => {
    if (!user || user.role !== 'member') return;

    async function syncMemberProgressCloud() {
      if (firebaseConnected) {
        try {
          const progDocRef = doc(db, 'progress', user.id);
          const progSnap = await getDoc(progDocRef);
          if (progSnap.exists()) {
            const fetchedProgress = progSnap.data() as UserProgress;
            setProgress(fetchedProgress);
            localStorage.setItem('aramaic_progress', JSON.stringify(fetchedProgress));
          } else {
            const initialProgUser = {
              ...DEFAULT_PROGRESS,
              memberId: user.id
            };
            await setDoc(progDocRef, initialProgUser);
            setProgress(initialProgUser);
            localStorage.setItem('aramaic_progress', JSON.stringify(initialProgUser));
          }
        } catch (e) {
          console.warn("Gagal sinkron progress awan siswa Yusuf, diredir ke lokal", e);
        }
      } else {
        const cachedProgress = localStorage.getItem('aramaic_progress');
        if (cachedProgress) {
          setProgress(JSON.parse(cachedProgress));
        } else {
          const initialProgUser = {
            ...DEFAULT_PROGRESS,
            memberId: user.id
          };
          setProgress(initialProgUser);
          localStorage.setItem('aramaic_progress', JSON.stringify(initialProgUser));
        }
      }
    }

    syncMemberProgressCloud();
  }, [user, firebaseConnected]);

  // Update cached states storage
  const updateCachedMaterials = async (newMats: Material[]) => {
    setMaterials(newMats);
    localStorage.setItem('aramaic_materials', JSON.stringify(newMats));
  };

  const updateCachedSubmissions = async (newSubs: Submission[]) => {
    setSubmissions(newSubs);
    localStorage.setItem('aramaic_submissions', JSON.stringify(newSubs));
  };

  const updateCachedProgress = async (newProg: UserProgress) => {
    setProgress(newProg);
    localStorage.setItem('aramaic_progress', JSON.stringify(newProg));
    if (firebaseConnected) {
      try {
        await setDoc(doc(db, 'progress', newProg.memberId), newProg);
      } catch (err) {
        console.error("Gagal sinkron ke Firebase", err);
      }
    }
  };

  // CALLBACKS FOR MEMBER/STUDENT ACTIVITIES:
  const handleCompleteMaterial = (materialId: string) => {
    if (progress.completedMaterials.includes(materialId)) return;
    const updated = {
      ...progress,
      completedMaterials: [...progress.completedMaterials, materialId],
    };
    updateCachedProgress(updated);
  };

  const handleCompleteLetter = (letterChar: string) => {
    if (progress.completedLetters.includes(letterChar)) return;
    const updated = {
      ...progress,
      completedLetters: [...progress.completedLetters, letterChar],
    };
    updateCachedProgress(updated);
  };


  const handleCompleteQuiz = (quizId: string, scorePercentage: number) => {
    const updated = {
      ...progress,
      quizScores: {
        ...progress.quizScores,
        [quizId]: scorePercentage,
      },
    };
    updateCachedProgress(updated);
  };

  const handleSubmitAssignmentAnswer = async (assignmentId: string, answerText: string) => {
    const newSubmission: Submission = {
      id: `sub_custom_${Date.now()}`,
      assignmentId: assignmentId,
      studentId: user?.id || 'user_student_1',
      studentName: user?.name || 'Siswa Yusuf (Murid Pemula)',
      submittedAt: new Date().toLocaleString('id-ID'),
      content: answerText,
      status: 'pending',
    };
    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('aramaic_submissions', JSON.stringify(updatedSubmissions));

    if (firebaseConnected) {
      try {
        await setDoc(doc(db, 'submissions', newSubmission.id), newSubmission);
      } catch (err) {
        console.error("Gagal sinkron submission ke Firebase", err);
      }
    }
  };

  // CALLBACKS FOR ADMIN ACTIONS:
  const handleAddMaterial = async (newMat: Material) => {
    const updated = [...materials, newMat];
    setMaterials(updated);
    localStorage.setItem('aramaic_materials', JSON.stringify(updated));

    if (firebaseConnected) {
      try {
        await setDoc(doc(db, 'materials', newMat.id), newMat);
      } catch (err) {
        console.error("Gagal sinkron tambah materi ke Firebase", err);
      }
    }
  };

  const handleEditMaterial = async (editedMat: Material) => {
    const updated = materials.map(m => m.id === editedMat.id ? editedMat : m);
    setMaterials(updated);
    localStorage.setItem('aramaic_materials', JSON.stringify(updated));

    if (firebaseConnected) {
      try {
        await setDoc(doc(db, 'materials', editedMat.id), editedMat);
      } catch (err) {
        console.error("Gagal sinkron edit materi ke Firebase", err);
      }
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    const updated = materials.filter(m => m.id !== materialId);
    setMaterials(updated);
    localStorage.setItem('aramaic_materials', JSON.stringify(updated));

    if (firebaseConnected) {
      try {
        await deleteDoc(doc(db, 'materials', materialId));
      } catch (err) {
        console.error("Gagal hapus materi di Firebase", err);
      }
    }
  };

  const handleGradeSubmission = async (submissionId: string, gradeValue: number, feedbackText: string) => {
    const updated = submissions.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          grade: gradeValue,
          feedback: feedbackText,
          status: 'graded' as const,
        };
      }
      return sub;
    });
    setSubmissions(updated);
    localStorage.setItem('aramaic_submissions', JSON.stringify(updated));

    if (firebaseConnected) {
      try {
        const targetSub = updated.find(s => s.id === submissionId);
        if (targetSub) {
          await setDoc(doc(db, 'submissions', submissionId), targetSub);
        }
      } catch (err) {
        console.error("Gagal sinkron grading ke Firebase", err);
      }
    }
  };

  // Session login / logout
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('aramaic_current_user', JSON.stringify(loggedInUser));

    // Update original admin flags
    if (loggedInUser.role === 'admin') {
      setIsOriginallyAdmin(true);
      localStorage.setItem('aramaic_original_user_is_admin', 'true');
    } else if (loggedInUser.id !== 'user_student_1') {
      // If logging in as a normal student (and NOT the admin swap role simulated student)
      setIsOriginallyAdmin(false);
      localStorage.setItem('aramaic_original_user_is_admin', 'false');
    }

    // Seed progress record specifically for Yusuf
    if (loggedInUser.role === 'member') {
      const storedProgress = localStorage.getItem('aramaic_progress');
      if (!storedProgress) {
        updateCachedProgress(DEFAULT_PROGRESS);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsOriginallyAdmin(false);
    localStorage.removeItem('aramaic_current_user');
    localStorage.removeItem('aramaic_original_user_is_admin');
  };

  const handleRegisterNewUser = async (newUser: User) => {
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('aramaic_all_users', JSON.stringify(updated));

    if (firebaseConnected) {
      try {
        await setDoc(doc(db, 'users', newUser.id), newUser);
      } catch (err) {
        console.error("Gagal mendaftarkan user ke Firebase", err);
      }
    }
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: 'approved' | 'disapproved') => {
    const updated = users.map(u => u.id === userId ? { ...u, status: newStatus } : u);
    setUsers(updated);
    localStorage.setItem('aramaic_all_users', JSON.stringify(updated));

    if (firebaseConnected) {
      try {
        const targetUser = updated.find(u => u.id === userId);
        if (targetUser) {
          await setDoc(doc(db, 'users', userId), targetUser);
        }
      } catch (err) {
        console.error("Gagal update status user di Firebase", err);
      }
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm("Apakah Anda yakin ingin memulihkan materi, tugas, dan progress bawaan ke database Cloud Firestore & Cache? Semua data kustom akan diganti dengan bahan ajar resmi.")) {
      return;
    }
    setSyncing(true);
    try {
      // Clear localStorage
      localStorage.setItem('aramaic_materials', JSON.stringify(INITIAL_MATERIALS));
      localStorage.setItem('aramaic_assignments', JSON.stringify(INITIAL_ASSIGNMENTS));
      // demo submission
      const demoSubmission: Submission = {
        id: 'sub_demo_1',
        assignmentId: 'assign_1',
        studentId: 'user_student_1',
        studentName: 'Siswa Yusuf (Murid Pemula)',
        submittedAt: '17 Juni 2026, 18:15',
        content: 'ܐܒܓܕ — Alaph melambangkan seekor sapi jantan yang berarti kekuatan luhur, Beth melambangkan rumah tempat bernaung, Gamal melambangkan unta penolong melintasi padang gurun gersang, dan Dalath melambangkan pintu gerbang raga.',
        status: 'pending',
      };
      localStorage.setItem('aramaic_submissions', JSON.stringify([demoSubmission]));
      localStorage.setItem('aramaic_progress', JSON.stringify(DEFAULT_PROGRESS));

      setMaterials(INITIAL_MATERIALS);
      setAssignments(INITIAL_ASSIGNMENTS);
      setSubmissions([demoSubmission]);
      setProgress(DEFAULT_PROGRESS);

      if (firebaseConnected) {
        // Overwrite / seed materials in Firebase
        for (const m of INITIAL_MATERIALS) {
          await setDoc(doc(db, 'materials', m.id), m);
        }
        // Overwrite / seed assignments in Firebase
        for (const a of INITIAL_ASSIGNMENTS) {
          await setDoc(doc(db, 'assignments', a.id), a);
        }
        // Overwrite / seed demo submission
        await setDoc(doc(db, 'submissions', demoSubmission.id), demoSubmission);
        // Reset Yusuf's progress
        await setDoc(doc(db, 'progress', 'user_student_1'), {
          ...DEFAULT_PROGRESS,
          memberId: 'user_student_1'
        });
        alert("✅ Database Cloud Firestore dan Cache lokal berhasil dipulihkan ke materi bawaan!");
      } else {
        alert("✅ Cache lokal berhasil dipulihkan ke materi bawaan!");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memulihkan database.");
    } finally {
      setSyncing(false);
    }
  };

  // Quick switch role connector to ease review processes as described in prompt
  const handleToggleRoleClick = () => {
    if (!user) return;
    const currentRole = user.role;
    const alternativeUser: User = currentRole === 'admin' 
      ? {
          id: 'user_student_1',
          name: 'Siswa Yusuf (Murid Pemula)',
          email: 'siswa.yusuf@aramaic.org',
          role: 'member',
        }
      : {
          id: 'user_admin',
          name: 'Rudolf A. Luhukay (Aramaic Scholar)',
          email: 'rudolflms@gmail.com',
          role: 'admin',
        };
    handleLogin(alternativeUser);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-stone-700 font-sans flex flex-col justify-between">
      
      {/* Top Main Navigation Header */}
      <header className="bg-white border-b border-[#E8E2D9] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Crest */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#3E3831] text-[#FAF9F5] rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
              ܐ
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#8B7355] uppercase tracking-widest block font-bold leading-none">
                LMS Platform
              </span>
              <h1 className="text-sm font-semibold text-[#3E3831] tracking-tight">
                Bahasa Aramaik Suryani
              </h1>
            </div>
            {firebaseConnected !== null && (
              <div className="hidden sm:flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold rounded-lg shrink-0 ${
                  firebaseConnected 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                    : 'bg-amber-50 text-amber-800 border border-amber-100'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${firebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {firebaseConnected ? 'FIREBASE CLOUD ACTIVE' : 'LOCAL CACHE MODE'}
                </div>
                <button 
                  onClick={handleResetDatabase}
                  disabled={syncing}
                  className="flex items-center gap-1 px-2 py-1 text-[9px] font-mono font-bold bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-600 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                  title="Klik untuk memulihkan materi, tugas dan database bawaan luhur."
                  id="reset-db-btn"
                >
                  <RefreshCw className={`h-2.5 w-2.5 ${syncing ? 'animate-spin' : ''}`} />
                  PULIHKAN DATA
                </button>
              </div>
            )}
          </div>

          {/* Quick Review controls & active session details */}
          {user ? (
            <div className="flex items-center gap-3">
              
              {/* Desktop Greeting & Role badge */}
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-stone-800">{user.name}</span>
                <span className="text-[10px] text-stone-500 font-mono">{user.email}</span>
              </div>

              {/* Connected Role Badge indicator with Quick Switch Link */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg flex items-center gap-1 border ${
                  user.role === 'admin'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {user.role === 'admin' ? (
                    <>
                      <Shield className="w-3 h-3 text-red-700" />
                      ADMIN
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                      PESERTA
                    </>
                  )}
                </span>

                {/* SUPERVISOR SHORTCUT SWITCHER - RESTRICTED ONLY TO ADMINS */}
                {(user.role === 'admin' || isOriginallyAdmin) && (
                  <button
                    onClick={handleToggleRoleClick}
                    className="px-2.5 py-1 bg-[#1C1611] hover:bg-stone-800 text-[#FDFBF7] text-[10px] font-mono font-bold rounded-lg transition-colors flex items-center gap-1 active:scale-95"
                    title="Ganti peran instan (Admin <-> Siswa) guna memudahkan review"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                    SWAP ROLE
                  </button>
                )}
              </div>

              <span className="h-6 w-px bg-stone-200" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-stone-100 text-stone-500 hover:text-stone-800 rounded-lg transition-colors"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 font-mono">
              <span>Aksara Suryani Tutorial • Ute-18</span>
            </div>
          )}

        </div>
      </header>

      {/* Main Core Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          user.role === 'admin' ? (
            <DashboardAdmin
              adminName={user.name}
              materials={materials}
              assignments={assignments}
              submissions={submissions}
              onAddMaterial={handleAddMaterial}
              onEditMaterial={handleEditMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              onGradeSubmission={handleGradeSubmission}
              selectedFont={fontStyle}
              users={users}
              onUpdateUserStatus={handleUpdateUserStatus}
            />
          ) : (
            <DashboardStudent
              studentName={user.name}
              studentId={user.id}
              materials={materials}
              assignments={assignments}
              submissions={submissions.filter(sub => sub.studentId === user.id)}
              onSubmitAssignment={handleSubmitAssignmentAnswer}
              quizQuestions={INITIAL_QUIZ_QUESTIONS}
              selectedFont={fontStyle}
              onChangeFont={setFontStyle}
              progress={progress}
              onCompleteMaterial={handleCompleteMaterial}
              onCompleteLetter={handleCompleteLetter}
              onCompleteQuiz={handleCompleteQuiz}
            />
          )
        ) : (
          <LoginScreen 
            onLogin={handleLogin} 
            users={users}
            onRegister={handleRegisterNewUser}
          />
        )}
      </main>

      {/* Aesthetic Footer Signoff */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-400 font-mono mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-500">LMS Aramaik Suryani</span>
            <span>•</span>
            <span>Gerbang Keilmuan Bahasa-Bahasa Semitik Kuno</span>
          </div>
          <div>
            @ 2026 Rudolf LMS. Dilengkapi rendering aksara <strong>Estrangelo</strong>, <strong>Serto</strong>, dan <strong>Madnkhaya</strong>.
          </div>
        </div>
      </footer>

    </div>
  );
}
