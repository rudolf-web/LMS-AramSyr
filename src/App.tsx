/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, BookOpen, GraduationCap, LogOut, RefreshCw, 
  User as UserIcon, Shield, Layers, HelpCircle, ListTodo, CloudLightning
} from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, where 
} from 'firebase/firestore';
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

  // Seeding initial data to Firestore database if it is empty (running in the background)
  const seedDatabaseIfNeeded = async () => {
    try {
      const DEFAULT_USERS: User[] = [
        {
          id: 'user_student_1',
          name: 'Siswa Yusuf (Murid Pemula)',
          email: 'siswa.yusuf@aramaic.org',
          role: 'member',
          status: 'approved',
          motivation: 'Ingin mendalami aksara kuno Aramaik dan makna glif di baliknya.'
        },
        {
          id: 'user_demo_public',
          name: 'Tamu Publik (Demo Eksplorasi)',
          email: 'demo.publik@aramaic.org',
          role: 'member',
          status: 'approved',
          motivation: 'Mengeksplorasi secara publik dan merasakan keindahan antarmuka pembelajaran Aramaik secara gratis (Khusus Bab 1).',
          isDemo: true
        },
        {
          id: 'user_admin',
          name: 'Rudolf A. Luhukay (Aramaic Scholar)',
          email: 'rudolflms@gmail.com',
          role: 'admin',
          status: 'approved',
          motivation: 'Mengajar aksara dan melestarikan warisan linguistik luhur.'
        }
      ];

      // 1. Check if users are empty
      const usersSnap = await getDocs(collection(db, 'users'));
      if (usersSnap.empty) {
        console.log("Seeding users into Firestore...");
        for (const u of DEFAULT_USERS) {
          await setDoc(doc(db, 'users', u.id), u);
        }
      }

      // Ensure djiyonathan7@gmail.com exists in users collection so Admin Rudolf can see him immediately
      const qJonathan = query(collection(db, 'users'), where('email', '==', 'djiyonathan7@gmail.com'));
      const snapJonathan = await getDocs(qJonathan);
      if (snapJonathan.empty) {
        console.log("Pre-seeding Jonathan (djiyonathan7@gmail.com) into Firestore users...");
        // Since we don't know his exact authenticated UID prior to his first active session on this device,
        // we use a recognized pre-seed ID. His first login will auto-migrate this profile to his actual UID.
        const jUser: User = {
          id: 'user_djiyonathan_pre',
          name: 'Jonathan (Peserta Kursus)',
          email: 'djiyonathan7@gmail.com',
          role: 'member',
          status: 'approved',
          motivation: 'Pembelajaran Aksara dan Bahasa Aramaik Suryani.'
        };
        await setDoc(doc(db, 'users', jUser.id), jUser);
      }

      // 2. Check if materials are empty
      const materialsSnap = await getDocs(collection(db, 'materials'));
      if (materialsSnap.empty) {
        console.log("Seeding materials into Firestore...");
        for (const m of INITIAL_MATERIALS) {
          await setDoc(doc(db, 'materials', m.id), m);
        }
      }

      // 3. Check if assignments are empty
      const assignmentsSnap = await getDocs(collection(db, 'assignments'));
      if (assignmentsSnap.empty) {
        console.log("Seeding assignments into Firestore...");
        for (const a of INITIAL_ASSIGNMENTS) {
          await setDoc(doc(db, 'assignments', a.id), a);
        }
      }

      // 4. Check if progress is empty
      const progressSnap = await getDocs(collection(db, 'progress'));
      if (progressSnap.empty) {
        console.log("Seeding Yusuf progress into Firestore...");
        await setDoc(doc(db, 'progress', 'user_student_1'), DEFAULT_PROGRESS);
      }
    } catch (err) {
      console.warn("Error seeding database, perhaps internet offline:", err);
    }
  };

  // 1. Initial cached local state loading
  useEffect(() => {
    setSyncing(true);
    try {
      const cachedUsers = localStorage.getItem('aramaic_all_users');
      if (cachedUsers) setUsers(JSON.parse(cachedUsers));

      const cachedMaterials = localStorage.getItem('aramaic_materials');
      if (cachedMaterials) setMaterials(JSON.parse(cachedMaterials));

      const cachedAssignments = localStorage.getItem('aramaic_assignments');
      if (cachedAssignments) setAssignments(JSON.parse(cachedAssignments));

      const cachedSubmissions = localStorage.getItem('aramaic_submissions');
      if (cachedSubmissions) setSubmissions(JSON.parse(cachedSubmissions));

      setFirebaseConnected(true);
    } catch (err) {
      console.warn("Failed loading cached state:", err);
      setFirebaseConnected(false);
    } finally {
      setSyncing(false);
    }

    // Recover session locally
    const cachedUser = localStorage.getItem('aramaic_current_user');
    if (cachedUser) {
      const parsedUser = JSON.parse(cachedUser) as User;
      setUser(parsedUser);
      if (parsedUser.role === 'admin' || localStorage.getItem('aramaic_original_user_is_admin') === 'true') {
        setIsOriginallyAdmin(true);
      }
    }

    // Auth state changed listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setSyncing(true);
        try {
          const email = firebaseUser.email?.toLowerCase() || '';
          
          // 1. Query users collection by email first to find any existing pre-seeded/registered profile
          const qUserByEmail = query(collection(db, 'users'), where('email', '==', email));
          const snapUserByEmail = await getDocs(qUserByEmail);
          
          let profile: User | null = null;
          let oldDocId: string | null = null;

          if (!snapUserByEmail.empty) {
            const matchedDoc = snapUserByEmail.docs[0];
            profile = matchedDoc.data() as User;
            oldDocId = matchedDoc.id;
          }

          const isDjiyonathan = email === 'djiyonathan7@gmail.com';

          if (profile) {
            // Profile exists! If the existing profile is on a different document ID (e.g. pre-seeded ID)
            // than the actual authenticated firebaseUser.uid, we clean up the old doc and save it under the real UID!
            if (oldDocId !== firebaseUser.uid) {
              console.log(`Migrating profile for ${email} from old ID ${oldDocId} to new uid ${firebaseUser.uid}`);
              profile.id = firebaseUser.uid;
              await setDoc(doc(db, 'users', firebaseUser.uid), profile);
              try {
                await deleteDoc(doc(db, 'users', oldDocId!));
              } catch (delErr) {
                console.warn("Failed to delete old pre-seeded profile doc:", delErr);
              }
            } else if (isDjiyonathan && profile.status === 'pending') {
              // Ensure djiyonathan is approved
              profile.status = 'approved';
              profile.name = 'Jonathan (Peserta Kursus)';
              await setDoc(doc(db, 'users', firebaseUser.uid), profile);
            }
          } else {
            // Create a brand new profile doc
            const isRudolf = email === 'rudolflms@gmail.com';
            const isYusuf = email === 'siswa.yusuf@aramaic.org';
            const isDemo = email === 'demo.publik@aramaic.org';

            if (isRudolf) {
              profile = {
                id: firebaseUser.uid,
                name: 'Rudolf A. Luhukay (Aramaic Scholar)',
                email: 'rudolflms@gmail.com',
                role: 'admin',
                status: 'approved',
                motivation: 'Mengajar aksara dan melestarikan warisan linguistik luhur.'
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), profile);
            } else if (isYusuf) {
              profile = {
                id: firebaseUser.uid,
                name: 'Siswa Yusuf (Murid Pemula)',
                email: 'siswa.yusuf@aramaic.org',
                role: 'member',
                status: 'approved',
                motivation: 'Ingin mendalami aksara kuno Aramaik dan makna glif di baliknya.'
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), profile);
            } else if (isDemo) {
              profile = {
                id: firebaseUser.uid,
                name: 'Tamu Publik (Demo Eksplorasi)',
                email: 'demo.publik@aramaic.org',
                role: 'member',
                status: 'approved',
                motivation: 'Mengeksplorasi secara publik dan merasakan keindahan antarmuka pembelajaran Aramaik secara gratis (Khusus Bab 1).',
                isDemo: true
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), profile);
            } else if (isDjiyonathan) {
              profile = {
                id: firebaseUser.uid,
                name: 'Jonathan (Peserta Kursus)',
                email: 'djiyonathan7@gmail.com',
                role: 'member',
                status: 'approved',
                motivation: 'Pembelajaran Aksara dan Bahasa Aramaik Suryani.'
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), profile);
            } else {
              // Custom student registered
              profile = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Siswa Baru',
                email: email,
                role: 'member',
                status: 'pending',
                motivation: 'Pendaftaran mandiri.'
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), profile);
            }
          }

          if (profile) {
            if (profile.role === 'admin') {
              // Always trigger seed/pre-seed routines when Admin logs in
              await seedDatabaseIfNeeded();
            }

            if (profile.role === 'member' && profile.status !== 'approved') {
              signOut(auth);
              setUser(null);
              localStorage.removeItem('aramaic_current_user');
            } else {
              setUser(profile);
              localStorage.setItem('aramaic_current_user', JSON.stringify(profile));
              if (profile.role === 'admin') {
                setIsOriginallyAdmin(true);
                localStorage.setItem('aramaic_original_user_is_admin', 'true');
              }
            }
          } else {
            signOut(auth);
            setUser(null);
            localStorage.removeItem('aramaic_current_user');
          }
        } catch (err) {
          console.error("Auth profile lookup error:", err);
        } finally {
          setSyncing(false);
        }
      } else {
        setUser(null);
        localStorage.removeItem('aramaic_current_user');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time collections sync when user is authenticated
  useEffect(() => {
    if (!user) return;

    // Start fetching & listening to collections
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const list: User[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as User);
      });
      if (list.length > 0) {
        setUsers(list);
        localStorage.setItem('aramaic_all_users', JSON.stringify(list));
      }
    }, (err) => {
      console.warn("Unsatisfied rules or offline during user fetch: ", err);
    });

    const unsubMaterials = onSnapshot(collection(db, 'materials'), (snapshot) => {
      const list: Material[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as Material);
      });
      if (list.length > 0) {
        setMaterials(list);
        localStorage.setItem('aramaic_materials', JSON.stringify(list));
      }
    }, (err) => {
      console.warn("Unsatisfied materials rules: ", err);
    });

    const unsubAssignments = onSnapshot(collection(db, 'assignments'), (snapshot) => {
      const list: Assignment[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as Assignment);
      });
      if (list.length > 0) {
        setAssignments(list);
        localStorage.setItem('aramaic_assignments', JSON.stringify(list));
      }
    }, (err) => {
      console.warn("Unsatisfied assignments rules: ", err);
    });

    let unsubSubmissions;
    if (user.role === 'admin' || isOriginallyAdmin) {
      unsubSubmissions = onSnapshot(collection(db, 'submissions'), (snapshot) => {
        const list: Submission[] = [];
        snapshot.forEach(doc => {
          list.push(doc.data() as Submission);
        });
        setSubmissions(list);
        localStorage.setItem('aramaic_submissions', JSON.stringify(list));
      }, (err) => {
        console.warn("Unsatisfied admin submissions: ", err);
      });
    } else {
      const q = query(collection(db, 'submissions'), where('studentId', '==', user.id));
      unsubSubmissions = onSnapshot(q, (snapshot) => {
        const list: Submission[] = [];
        snapshot.forEach(doc => {
          list.push(doc.data() as Submission);
        });
        setSubmissions(list);
        localStorage.setItem('aramaic_submissions', JSON.stringify(list));
      }, (err) => {
        console.warn("Unsatisfied student submissions: ", err);
      });
    }

    const unsubProgress = onSnapshot(doc(db, 'progress', user.id), (docSnap) => {
      if (docSnap.exists()) {
        const progData = docSnap.data() as UserProgress;
        setProgress(progData);
        localStorage.setItem('aramaic_progress', JSON.stringify(progData));
      }
    }, (err) => {
      console.warn("Unsatisfied progress query: ", err);
    });

    return () => {
      unsubUsers();
      unsubMaterials();
      unsubAssignments();
      unsubSubmissions();
      unsubProgress();
    };
  }, [user, isOriginallyAdmin]);

  // Validate logged in user approval status against latest users list
  useEffect(() => {
    if (!user) return;
    if (user.role === 'admin' || isOriginallyAdmin) return;

    const matchedUser = users.find(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (matchedUser) {
      if (matchedUser.status !== 'approved') {
        setUser(null);
        setIsOriginallyAdmin(false);
        localStorage.removeItem('aramaic_current_user');
        localStorage.removeItem('aramaic_original_user_is_admin');
        signOut(auth);
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
        signOut(auth);
      }
    }
  }, [users, user, isOriginallyAdmin]);

  // Sync member specific progress once they trigger login session
  useEffect(() => {
    if (!user || user.role !== 'member') return;

    const cachedProgress = localStorage.getItem('aramaic_progress');
    if (cachedProgress) {
      try {
        const parsedProg = JSON.parse(cachedProgress);
        if (parsedProg.memberId === user.id) {
          setProgress(parsedProg);
        } else {
          const initialProgUser = {
            ...DEFAULT_PROGRESS,
            memberId: user.id
          };
          setProgress(initialProgUser);
          localStorage.setItem('aramaic_progress', JSON.stringify(initialProgUser));
        }
      } catch (e) {
        const initialProgUser = {
          ...DEFAULT_PROGRESS,
          memberId: user.id
        };
        setProgress(initialProgUser);
        localStorage.setItem('aramaic_progress', JSON.stringify(initialProgUser));
      }
    } else {
      const initialProgUser = {
        ...DEFAULT_PROGRESS,
        memberId: user.id
      };
      setProgress(initialProgUser);
      localStorage.setItem('aramaic_progress', JSON.stringify(initialProgUser));
    }
  }, [user]);

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
  };

  // CALLBACKS FOR MEMBER/STUDENT ACTIVITIES:
  const handleCompleteMaterial = async (materialId: string) => {
    if (progress.completedMaterials.includes(materialId)) return;
    const updated = {
      ...progress,
      completedMaterials: [...progress.completedMaterials, materialId],
    };
    updateCachedProgress(updated);
    try {
      await setDoc(doc(db, 'progress', user?.id || progress.memberId), updated);
    } catch (err) {
      console.error("Firestore progress update error:", err);
    }
  };

  const handleCompleteLetter = async (letterChar: string) => {
    if (progress.completedLetters.includes(letterChar)) return;
    const updated = {
      ...progress,
      completedLetters: [...progress.completedLetters, letterChar],
    };
    updateCachedProgress(updated);
    try {
      await setDoc(doc(db, 'progress', user?.id || progress.memberId), updated);
    } catch (err) {
      console.error("Firestore letters progress update error:", err);
    }
  };

  const handleCompleteQuiz = async (quizId: string, scorePercentage: number) => {
    const updated = {
      ...progress,
      quizScores: {
        ...progress.quizScores,
        [quizId]: scorePercentage,
      },
    };
    updateCachedProgress(updated);
    try {
      await setDoc(doc(db, 'progress', user?.id || progress.memberId), updated);
    } catch (err) {
      console.error("Firestore quiz progress update error:", err);
    }
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
    try {
      await setDoc(doc(db, 'submissions', newSubmission.id), newSubmission);
    } catch (err) {
      console.error("Gagal mengirim jawaban ke Firestore:", err);
    }
  };

  // CALLBACKS FOR ADMIN ACTIONS:
  const handleAddMaterial = async (newMat: Material) => {
    const updated = [...materials, newMat];
    setMaterials(updated);
    localStorage.setItem('aramaic_materials', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'materials', newMat.id), newMat);
    } catch (err) {
      console.error("Firestore add material error:", err);
    }
  };

  const handleEditMaterial = async (editedMat: Material) => {
    const updated = materials.map(m => m.id === editedMat.id ? editedMat : m);
    setMaterials(updated);
    localStorage.setItem('aramaic_materials', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'materials', editedMat.id), editedMat);
    } catch (err) {
      console.error("Firestore edit material error:", err);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    const updated = materials.filter(m => m.id !== materialId);
    setMaterials(updated);
    localStorage.setItem('aramaic_materials', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'materials', materialId));
    } catch (err) {
      console.error("Firestore delete material error:", err);
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
    try {
      const targetSub = updated.find(sub => sub.id === submissionId);
      if (targetSub) {
        await setDoc(doc(db, 'submissions', submissionId), targetSub);
      }
    } catch (err) {
      console.error("Firestore grading submission error:", err);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out err", e);
    }
    setUser(null);
    setIsOriginallyAdmin(false);
    localStorage.removeItem('aramaic_current_user');
    localStorage.removeItem('aramaic_original_user_is_admin');
  };

  const handleRegisterNewUser = async (newUser: User) => {
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('aramaic_all_users', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'users', newUser.id), newUser);
    } catch (err) {
      console.error("Gagal mendaftarkan pengguna baru ke Firestore:", err);
    }
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: 'approved' | 'disapproved') => {
    const updated = users.map(u => u.id === userId ? { ...u, status: newStatus } : u);
    setUsers(updated);
    localStorage.setItem('aramaic_all_users', JSON.stringify(updated));
    try {
      const userRef = doc(db, 'users', userId);
      const targetUser = updated.find(u => u.id === userId);
      if (targetUser) {
        await setDoc(userRef, targetUser);
      } else {
        await updateDoc(userRef, { status: newStatus });
      }
    } catch (err) {
      console.error("Gagal memperbarui status pengguna di Firestore:", err);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm("Apakah Anda yakin ingin memulihkan materi, tugas, dan progress bawaan ke Cache? Semua data kustom akan diganti dengan bahan ajar resmi.")) {
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
      alert("✅ Cache lokal berhasil dipulihkan ke materi bawaan!");
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
      {user && (
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
            </div>

            {/* Quick Review controls & active session details */}
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
                className="p-1.5 hover:bg-stone-100 text-[#8B7355] hover:text-[#3E3831] rounded-lg transition-colors"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>

          </div>
        </header>
      )}

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
              isDemo={user.isDemo}
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



    </div>
  );
}
