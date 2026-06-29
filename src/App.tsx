/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, BookOpen, GraduationCap, LogOut, RefreshCw, 
  User as UserIcon, Shield, Layers, HelpCircle, ListTodo, CloudLightning
} from 'lucide-react';
import { 
  auth, db,
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, where 
} from './firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { User, Material, Assignment, Submission, FontStyle, UserProgress } from './types';
import { INITIAL_MATERIALS, INITIAL_QUIZ_QUESTIONS, INITIAL_ASSIGNMENTS } from './data/materials';
import { safeConfirm, safeAlert } from './utils/safeDialogs';
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
  const [user, setUser] = useState<User | null>(() => {
    const cachedUser = localStorage.getItem('aramaic_current_user');
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch (err) {}
    }
    return null;
  });
  const [isOriginallyAdmin, setIsOriginallyAdmin] = useState<boolean>(() => {
    return localStorage.getItem('aramaic_original_user_is_admin') === 'true';
  });
  const [fontStyle, setFontStyle] = useState<FontStyle>('estrangelo');

  // Custom confirmation & alert modals replacing native dialogs (which can fail in iframes)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  } | null>(null);

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  } | null>(null);

  // Admin login states
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [isLoggingInAdmin, setIsLoggingInAdmin] = useState(false);

  // Helper to sort materials list numerically by ID (e.g., mat_1, mat_2, ..., mat_50)
  const sortMaterialsList = (mats: Material[]): Material[] => {
    return [...mats].sort((a, b) => {
      const numA = parseInt(a.id.replace('mat_', ''), 10);
      const numB = parseInt(b.id.replace('mat_', ''), 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.id.localeCompare(b.id);
    });
  };

  // Curriculum & Task States
  const [materials, setMaterials] = useState<Material[]>(() => {
    try {
      const cached = localStorage.getItem('aramaic_materials');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed].sort((a, b) => {
            const numA = parseInt(a.id.replace('mat_', ''), 10);
            const numB = parseInt(b.id.replace('mat_', ''), 10);
            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB;
            }
            return a.id.localeCompare(b.id);
          });
        }
      }
    } catch (e) {}
    return INITIAL_MATERIALS;
  });
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const cached = localStorage.getItem('aramaic_assignments');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ASSIGNMENTS;
  });
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

    // Trigger seeding database directly on mount only if cached user is admin
    const cachedUserOnMount = localStorage.getItem('aramaic_current_user');
    if (cachedUserOnMount) {
      try {
        const u = JSON.parse(cachedUserOnMount);
        if (u && u.role === 'admin') {
          seedDatabaseIfNeeded();
        }
      } catch (e) {}
    }

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time collections sync when user is authenticated
  useEffect(() => {
    if (!user) return;

    // Start fetching & listening to collections
    let unsubUsers: () => void;
    if (user.role === 'admin' || isOriginallyAdmin) {
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
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
    } else {
      unsubUsers = onSnapshot(doc(db, 'users', user.id), (docSnap) => {
        if (docSnap.exists()) {
          const profileData = docSnap.data() as User;
          setUsers([profileData]);
          localStorage.setItem('aramaic_all_users', JSON.stringify([profileData]));
        }
      }, (err) => {
        console.warn("Unsatisfied rules or offline during single user fetch: ", err);
      });
    }

    const unsubMaterials = onSnapshot(collection(db, 'materials'), (snapshot) => {
      const list: Material[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as Material);
      });
      if (list.length > 0) {
        const sortedList = sortMaterialsList(list);
        setMaterials(sortedList);
        localStorage.setItem('aramaic_materials', JSON.stringify(sortedList));
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
        safeAlert("🔒 Akses Diblokir: Pendaftaran atau status akun Anda belum disetujui (PENDING) atau telah dinonaktifkan oleh Admin Rudolf Luhukay.");
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
    const sorted = sortMaterialsList(newMats);
    setMaterials(sorted);
    localStorage.setItem('aramaic_materials', JSON.stringify(sorted));
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
    const sorted = sortMaterialsList([...materials, newMat]);
    setMaterials(sorted);
    localStorage.setItem('aramaic_materials', JSON.stringify(sorted));
    try {
      await setDoc(doc(db, 'materials', newMat.id), newMat);
    } catch (err) {
      console.error("Firestore add material error:", err);
    }
  };

  const handleEditMaterial = async (editedMat: Material) => {
    const sorted = sortMaterialsList(materials.map(m => m.id === editedMat.id ? editedMat : m));
    setMaterials(sorted);
    localStorage.setItem('aramaic_materials', JSON.stringify(sorted));
    try {
      await setDoc(doc(db, 'materials', editedMat.id), editedMat);
    } catch (err) {
      console.error("Firestore edit material error:", err);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    const sorted = sortMaterialsList(materials.filter(m => m.id !== materialId));
    setMaterials(sorted);
    localStorage.setItem('aramaic_materials', JSON.stringify(sorted));
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

  const handleAdminSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setAdminLoginError("Silakan isi semua bidang.");
      return;
    }
    setIsLoggingInAdmin(true);
    setAdminLoginError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const fbUser = userCredential.user;
      const emailLower = fbUser.email?.toLowerCase() || '';

      const adminProfile: User = {
        id: fbUser.uid,
        name: emailLower === 'rudolflms@gmail.com' ? 'Rudolf A. Luhukay (Aramaic Scholar)' : 'Pendidik Aramaik',
        email: emailLower,
        role: 'admin',
        status: 'approved',
      };

      // Save to users collection in our Firestore/LocalStorage DB
      await setDoc(doc(db, 'users', fbUser.uid), adminProfile);

      // Perform local state login
      handleLogin(adminProfile);

      // Success cleanup
      setShowAdminLoginModal(false);
      setAdminEmail('');
      setAdminPassword('');
      safeAlert("✅ Selamat datang kembali, Pengajar! Portal Admin aktif.");
    } catch (err: any) {
      console.error("Admin sign-in failed:", err);
      let errMsg = "Email atau password tidak terdaftar atau salah.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errMsg = "Kredensial tidak valid atau akun Anda belum terdaftar sebagai admin.";
      } else if (err.message) {
        errMsg = err.message;
      }
      setAdminLoginError(`Gagal masuk: ${errMsg}`);
    } finally {
      setIsLoggingInAdmin(false);
    }
  };

  const handleLogout = async () => {
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Keluar",
      message: user?.role === 'admin' ? "Apakah Anda yakin ingin keluar dari Portal Admin?" : "Apakah Anda yakin ingin keluar dari akun Anda?",
      confirmText: "Keluar",
      cancelText: "Batal",
      onConfirm: async () => {
        try {
          await signOut(auth);
        } catch (e) {
          console.warn("Sign out error", e);
        }
        setUser(null);
        setIsOriginallyAdmin(false);
        localStorage.removeItem('aramaic_current_user');
        localStorage.setItem('aramaic_original_user_is_admin', 'false');
        setConfirmModal(null);
        setAlertModal({
          isOpen: true,
          title: "Berhasil Keluar",
          message: "Anda telah berhasil keluar dari akun Anda."
        });
      }
    });
  };

  const handleResetProgress = () => {
    setConfirmModal({
      isOpen: true,
      title: "Setel Ulang Progres",
      message: "Apakah Anda yakin ingin menyetel ulang seluruh kemajuan belajar (Progress) Anda ke kondisi awal? Ujian modul akan dikunci kembali.",
      confirmText: "Setel Ulang",
      cancelText: "Batal",
      onConfirm: () => {
        updateCachedProgress(DEFAULT_PROGRESS);
        setConfirmModal(null);
        setAlertModal({
          isOpen: true,
          title: "Progres Disetel Ulang",
          message: "Kemajuan belajar Anda telah berhasil disetel ulang!"
        });
      }
    });
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
    setConfirmModal({
      isOpen: true,
      title: "Pulihkan Bahan Ajar Standar",
      message: "Apakah Anda yakin ingin memulihkan materi, tugas, dan progress bawaan ke Cache? Semua data kustom akan diganti dengan bahan ajar resmi.",
      confirmText: "Pulihkan",
      cancelText: "Batal",
      onConfirm: async () => {
        setConfirmModal(null);
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
          setAlertModal({
            isOpen: true,
            title: "Berhasil Dipulihkan",
            message: "Semua materi prasetel, tugas, dan progress telah dipulihkan ke Cache lokal."
          });
        } catch (err) {
          console.error(err);
          setAlertModal({
            isOpen: true,
            title: "Gagal Memulihkan",
            message: "Terjadi kesalahan saat memulihkan database bawaan."
          });
        } finally {
          setSyncing(false);
        }
      }
    });
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

                {/* TEACHER/ADMIN PORTAL ENTRANCE - Shows if not authenticated yet */}
                {!(user.role === 'admin' || isOriginallyAdmin) && (
                  <button
                    onClick={() => setShowAdminLoginModal(true)}
                    className="px-2.5 py-1 bg-[#8B7355] hover:bg-[#3E3831] text-white text-[10px] font-mono font-bold rounded-lg transition-colors flex items-center gap-1.5 active:scale-95 shadow-sm"
                    title="Masuk khusus untuk Admin & Pengajar"
                  >
                    <Shield className="w-3 h-3" />
                    LOGIN ADMIN
                  </button>
                )}
              </div>

              <span className="h-6 w-px bg-stone-200" />

              {/* Reset Progress Button - only for students */}
              {user.role !== 'admin' && (
                <button
                  onClick={handleResetProgress}
                  className="p-1.5 hover:bg-stone-100 text-[#8B7355] hover:text-[#3E3831] rounded-lg transition-colors animate-in fade-in"
                  title="Setel Ulang Progress Belajar"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}

              {/* Logout Button - both for students and admin */}
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-stone-100 text-[#8B7355] hover:text-[#3E3831] rounded-lg transition-colors"
                title={user.role === 'admin' ? "Keluar dari Portal Admin" : "Keluar Akun"}
              >
                <LogOut className={`w-4 h-4 ${user.role === 'admin' ? 'text-red-600' : 'text-[#8B7355]'}`} />
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

      {/* HIGH-FIDELITY ADMIN LOGIN MODAL OVERLAY */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FAF9F5] border border-[#E8E2D9] max-w-sm w-full rounded-2xl shadow-xl overflow-hidden p-6 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <button 
              onClick={() => {
                setShowAdminLoginModal(false);
                setAdminEmail('');
                setAdminPassword('');
                setAdminLoginError('');
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-bold transition-colors text-sm"
            >
              ✕
            </button>

            {/* Crest Icon Header */}
            <div className="text-center mb-5">
              <div className="h-12 w-12 bg-stone-900 text-stone-100 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-2 shadow-sm">
                <Shield className="w-6 h-6 text-yellow-500" />
              </div>
              <h2 className="text-[#3E3831] font-serif font-bold text-lg">Portal Khusus Admin</h2>
              <p className="text-stone-500 text-xs mt-1 font-mono">
                Silakan autentikasi menggunakan akun Pengajar
              </p>
            </div>

            <form onSubmit={handleAdminSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Email Admin
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="rudolflms@gmail.com"
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#8B7355] focus:border-[#8B7355]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-white border border-[#FAF9F5]/20 rounded-xl text-stone-800 text-sm focus:outline-hidden focus:ring-1 focus:ring-[#8B7355] focus:border-[#8B7355]"
                  required
                />
              </div>

              {adminLoginError && (
                <div className="flex gap-2 items-start bg-red-50 text-red-800 p-3 rounded-lg border border-red-200 text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{adminLoginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingInAdmin}
                className="w-full py-2.5 bg-[#8B7355] hover:bg-[#3E3831] disabled:bg-stone-300 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
              >
                {isLoggingInAdmin ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menyinkronkan...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Masuk sebagai Pengajar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULL-FIDELITY REACT REUSABLE CUSTOM CONFIRMATION DIALOG MODAL */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-in fade-in duration-200" style={{ zIndex: 9999 }}>
          <div className="bg-[#FAF9F5] border border-[#E8E2D9] max-w-sm w-full rounded-2xl shadow-xl p-6 relative animate-in zoom-in-95 duration-200 text-left">
            <h3 className="text-[#3E3831] font-serif font-bold text-base mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed mb-6">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {confirmModal.cancelText || "Batal"}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-[#8B7355] hover:bg-[#3E3831] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                {confirmModal.confirmText || "Ya"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-FIDELITY REACT REUSABLE CUSTOM ALERT DIALOG MODAL */}
      {alertModal && alertModal.isOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-in fade-in duration-200" style={{ zIndex: 9999 }}>
          <div className="bg-[#FAF9F5] border border-[#E8E2D9] max-w-sm w-full rounded-2xl shadow-xl p-6 relative animate-in zoom-in-95 duration-200 text-left">
            <h3 className="text-[#3E3831] font-serif font-bold text-base mb-2">
              {alertModal.title}
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed mb-6">
              {alertModal.message}
            </p>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setAlertModal(null)}
                className="px-4 py-2 bg-[#3E3831] hover:bg-stone-800 text-[#FAF9F5] text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
