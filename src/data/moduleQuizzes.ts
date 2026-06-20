import { FontStyle } from '../types';

export interface BiblicalPassage {
  reference: string;
  aramaicText: string;
  transliteration: string;
  translation: string;
  theologicalNote: string;
}

export interface ModuleQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// 1. GORGEOUS DETAILED BIBLICAL PASSAGES ACCORDING TO USER CONFIGURATION
export function getBiblicalPassage(materialId: string): BiblicalPassage | null {
  // Check the material number
  const match = materialId.match(/mat_(\d+)/);
  if (!match) return null;
  const num = parseInt(match[1]);

  if (num <= 5) {
    return {
      reference: "Yohanes 1:1 (Awal Mula Firman)",
      aramaicText: "ܒ݁ܪܺܫܺܝܬ݂ ܐܺܝܬ݂ܰܘܗ݂ܝ ܗܘܳܐ ܡܶܠܬ݂ܳܐ ܘܗܽܘ ܡܶܠܬ݂ܳܐ ܐܺܝܬ݂ܰܘܗ݂ܝ ܗܘܳܐ ܠܘܳܬ݂ ܐܰܠܳܗܳܐ܂",
      transliteration: "Breshith ithawhi hwa Meltha, w-hu Meltha ithawhi hwa lwath Alaha.",
      translation: "Pada mulanya adalah Firman; Firman itu bersama-sama dengan Allah.",
      theologicalNote: "Analisis Tata Bahasa: Kata 'Breshith' berarti 'pada mulanya' (kata depan b- + reshith 'awal'). 'Meltha' berarti 'Firman' merupakan kata benda feminin agung dalam sastra Semit."
    };
  } else if (num <= 10) {
    return {
      reference: "Kejadian (Breshith) 1:1 (Penciptaan Semesta)",
      aramaicText: "ܒ݁ܪܺܫܺܝܬ݂ ܒ݁ܪܳܐ ܐܰܠܳܗܳܐ ܝܳܬ݂ ܫܡܰܝܳܐ ܘܝܳܬ݂ ܐܰܪܥܳܐ܂",
      transliteration: "Breshith bra Alaha yath shmaya w-yath ar'a.",
      translation: "Pada mulanya Allah menciptakan langit dan bumi.",
      theologicalNote: "Analisis Tata Bahasa: Kata benda jamak 'shmaya' (langit) selalu memiliki akhiran definitif maskulin '-ya'. Kata kerja 'bra' merupakan bentuk lampau (perfect) orang ketiga tunggal maskulin."
    };
  } else if (num <= 16) {
    return {
      reference: "Matius 5:9 (Khotbah di Bukit)",
      aramaicText: "ܛܽܘܒ݂ܰܝܗܽܘܢ ܠܥܳܒ݂ܕ݁ܰܝ ܫܠܳܡܳܐ ܕ݁ܰܒ݂ܢܰܘܗ݂ܝ ܕ݁ܰܐܠܳܗܳܐ ܢܶܬ݂ܩܪܽܘܢ܂",
      transliteration: "Tubayhon l-`abday shlama d-banawhi d-Alaha nethqrun.",
      translation: "Berbahagialah orang yang membawa damai, karena mereka akan disebut anak-anak Allah.",
      theologicalNote: "Analisis Tata Bahasa: 'Shlama' (Damai) menggunakan imbuhan vokal Zqapha. Partikel 'd-' pada 'd-banawhi' mengindikasikan kepemilikan genitif (anak-anak dari Allah)."
    };
  } else if (num <= 20) {
    return {
      reference: "Doa Bapa Kami (Lukas 11:2)",
      aramaicText: "ܐܰܒ݂ܽܘܢ ܕ݁ܒ݂ܰܫܡܰܝܳܐ ܢܶܬ݂ܩܰܕ݁ܰܫ ܫܡܳܟ݂܂",
      transliteration: "Abun d-bashmayya nethqadash shmakh.",
      translation: "Bapa kami yang di surga, dikuduskanlah nama-Mu.",
      theologicalNote: "Analisis Tata Bahasa: 'Abun' merupakan gabungan dari 'Ab' (Bapa) + akhiran kata ganti orang pertama jamak '-un' (Kami). 'Nethqadash' adalah kata kerja berawalan Pasif Ethpaal."
    };
  } else if (num <= 25) {
    return {
      reference: "Yohanes 14:6 (Jalan Keselamatan)",
      aramaicText: "ܐܶܢܳܐ ܐܶܢܳܐ ܐܽܘܪܚܳܐ ܘܰܫܪܳܪܳܐ ܘܚܰܝܶܐ܂",
      transliteration: "Ena ena urkha wa-shrara wa-khaye.",
      translation: "Akulah jalan dan kebenaran dan hidup.",
      theologicalNote: "Analisis Tata Bahasa: Kata ganti 'Ena' (Aku) berpadu ganda untuk penegasan predikatif mutlak. Kata benda feminin 'Urkha' (Jalan) diakhiri Alaph definitif."
    };
  } else if (num <= 30) {
    return {
      reference: "Mazmur 23:1 (Tuhan Gembalaku)",
      aramaicText: "ܡܳܪܝܳܐ ܢܶܪܥܶܝܢܝ ܘܡܶܕ݁ܶܡ ܠܳܐ ܢܶܚܣܰܪܰܢܝ܂",
      transliteration: "Marya nar'eyni w-medem la nakhsreni.",
      translation: "Tuhan adalah gembalaku, takkan kekurangan aku.",
      theologicalNote: "Analisis Tata Bahasa: Kata benda agung 'Marya' ditransliterasikan sebagai panggilan asali Tuhan. Kata kerja 'nar'eyni' adalah imperfek dengan sufiks objek 'aku'."
    };
  } else if (num <= 35) {
    return {
      reference: "Yohanes 8:32 (Kebenaran yang Merdeka)",
      aramaicText: "ܘܬ݂ܶܕ݁ܥܽܘܢ ܫܪܳܪܳܐ ܘܗܽܘ ܫܪܳܪܳܐ ܢܚܰܪܰܪܟ݂ܽܘܢ܂",
      transliteration: "W-thed'un shrara w-hu shrara nkhararkhon.",
      translation: "Dan kamu akan mengetahui kebenaran, dan kebenaran itu akan memerdekakan kamu.",
      theologicalNote: "Analisis Tata Bahasa: 'Nkhararkhon' dibentuk dari verba intensif Pael 'Kharrar' (memerdekakan) ditambah sufiks pronominal orang kedua jamak '-khon'."
    };
  } else if (num <= 40) {
    return {
      reference: "Matius 6:10 (Kerajaan Bapa)",
      aramaicText: "ܬ݁ܺܐܬ݂ܶܐ ܡܰܠܟ݁ܽܘܬ݂ܳܟ݂ ܢܶܗܘܶܐ ܨܶܒ݂ܝܳܢܳܟ݂ ܐܰܝܟ݁ܰܢܳܐ ܕ݁ܒ݂ܰܫܡܰܝܳܐ ܐܳܦ݂ ܒ݁ܰܐܪܥܳܐ܂",
      transliteration: "Tithe malkhuthakh nehwe sebyanakh aykhanna d-bashmayya aph b-ar'a.",
      translation: "Datanglah kerajaan-Mu, jadilah kehendak-Mu di bumi seperti di surga.",
      theologicalNote: "Analisis Tata Bahasa: Kata benda abstrak 'Malkhutha' (Kerajaan/Kedaulatan) digabung dengan sufiks kepunyaan orang kedua tunggal maskulin '-akh'."
    };
  } else if (num <= 45) {
    return {
      reference: "Kolose 3:14 (Kasih Pengikat Sempurna)",
      aramaicText: "ܘܥܰܠ ܗܳܠܶܝܢ ܟ݁ܽܠܗܶܝܢ ܚܽܘܒ݁ܳܐ ܕ݁ܗܽܘܝܽܘ ܐܰܣܳܪܳܐ ܕ݁ܰܓ݂ܡܺܝܪܽܘܬ݂ܳܐ܂",
      transliteration: "W-al helyn kulheyn khubba d-huyu asara d-gmirutha.",
      translation: "Dan di atas semuanya itu: kenakanlah kasih, yang mempersatukan dan menyempurnakan.",
      theologicalNote: "Analisis Tata Bahasa: 'Khubba' (Kasih) adalah subjek kalimat, sedangkan 'huyu' merupakan kontraksi dari kata ganti 'hu' (ia) + 'iyu' (adalah) membantuk predikat tegas."
    };
  } else {
    return {
      reference: "Yohanes 1:14 (Firman Menjadi Manusia)",
      aramaicText: "ܘܡܶܠܬ݂ܳܐ ܒ݁ܶܣܪܳܐ ܗܘܳܐ ܘܰܐܓ݁ܶܢ ܒ݁ܰܢ ܘܰܚܙܰܝܢ ܫܽܘܒ݂ܚܶܗ܂",
      transliteration: "W-Meltha besra hwa w-agen ban w-khzayn shubkheh.",
      translation: "Firman itu telah menjadi daging, dan diam di antara kita, dan kita telah melihat kemuliaan-Nya.",
      theologicalNote: "Analisis Tata Bahasa: Penggunaan kata kerja bantu kopulatif 'hwa' (menjadi/terjadi) dan verba asimilasi padat 'agen' (mendirikan kemah di dalam diri kita)."
    };
  }
}

// 2. 3 DISTINCT DETERMINISTIC QUESTIONS PER MODULE WITH 70% PASS BAR
export function getModuleQuestions(materialId: string): ModuleQuestion[] {
  const match = materialId.match(/mat_(\d+)/);
  const num = match ? parseInt(match[1]) : 1;

  // Generate 3 unique questions tailored for each module index
  const questions: ModuleQuestion[] = [
    {
      id: `${materialId}_q1`,
      question: "",
      options: [],
      correctAnswer: "",
      explanation: ""
    },
    {
      id: `${materialId}_q2`,
      question: "",
      options: [],
      correctAnswer: "",
      explanation: ""
    },
    {
      id: `${materialId}_q3`,
      question: "",
      options: [],
      correctAnswer: "",
      explanation: ""
    }
  ];

  // Tailored items for Modules
  switch(num) {
    case 1:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Berapa lamakah bahasa Aramaik Suryani telah dituturkan oleh peradaban manusia secara historis?",
        options: ["Lebih dari 100 Tahun", "Sekitar 500 Tahun", "Lebih dari 3.000 Tahun", "Kurang dari 1.000 Tahun"],
        correctAnswer: "Lebih dari 3.000 Tahun",
        explanation: "Pengantar modul menegaskan bahasa Semit luhur ini aktif digunakan selama lebih dari 3.000 tahun secara lisan maupun sastra."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Gaya tulisan Aramaik Suryani manakah yang berkarakter persegi tegak, kaku, dan berwibawa tinggi?",
        options: ["Serto", "Estrangelo", "Madnkhaya", "Kufi"],
        correctAnswer: "Estrangelo",
        explanation: "Estrangelo (ܐܸܣܛܪܲܢܓܹܠܵܐ) adalah gaya penulisan paling klasik yang tegap, tegas, dan berwibawa."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Bagaimanakah arah penulisan teks bahasa Aramaik Suryani secara baku?",
        options: ["Kiri ke Kanan (LTR)", "Atas ke Bawah (VTL)", "Kanan ke Kiri (RTL) melintang", "Bebas sesuai keinginan penulis"],
        correctAnswer: "Kanan ke Kiri (RTL) melintang",
        explanation: "Sama seperti rumpun bahasa Semit purba lainnya, Aramaik ditulis eksklusif dari kanan ke kiri."
      };
      break;

    case 2:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Ada berapa jumlah konsonan dasar dalam abjad Aramaik-Syriac?",
        options: ["22 Huruf", "28 Huruf", "26 Huruf", "30 Huruf"],
        correctAnswer: "22 Huruf",
        explanation: "Abjad Aramaik hanya terdiri dari 22 huruf konsonan dasar tanpa variasi kapital/kecil."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Apakah sistem abjad Aramaik memiliki konsepsi pembeda antara Huruf Kapital dan Huruf Kecil?",
        options: ["Ya, di setiap awal kalimat harus kapital", "Sama sekali tidak memiliki huruf kapital/kecil", "Hanya nama orang yang menggunakan kapital", "Bergantung pada jenis font yang dipilih"],
        correctAnswer: "Sama sekali tidak memiliki huruf kapital/kecil",
        explanation: "Sistem paleografi Aramaik murni datar tanpa pengenalan sistem lettercase kapital mupun kecil."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Mengapa kita disarankan belajar abjad secara perlahan dan tenang?",
        options: ["Agar lulus tanpa harus membaca", "Agar melatih kelenturan memori jiwa dan goresan secara intuitif artistik", "Karena bahasa ini sangat membosankan", "Karena tidak ada ujian akhir"],
        correctAnswer: "Agar melatih kelenturan memori jiwa dan goresan secara intuitif artistik",
        explanation: "Pendekatan meditatif yang damai membuat struktur glif kaligrafi terekam kuat dan menenangkan pikiran."
      };
      break;

    case 3:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Apakah arti filosofis purba dari karakter abjad pertama 'Alaph' (ܐ)?",
        options: ["Rumah Jiwa", "Pintu Ilmu", "Sapi Jantan / Kekuatan", "Unta Sabar"],
        correctAnswer: "Sapi Jantan / Kekuatan",
        explanation: "Alaph (ܐ) secara historis melambangkan kepala lembu jantan yang menyimbolkan kekuatan, kepemimpinan, dan permulaan."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Dari segi penyambungan kata, apakah keistimewaan mutlak dari huruf Alaph (ܐ)?",
        options: ["Bisa menyambung bebas ke kanan dan kiri", "Tidak bisa digandeng dari arah kiri oleh huruf setelahnya", "Hanya bisa ditulis di akhir kata saja", "Selalu menempel pada huruf Dalath"],
        correctAnswer: "Tidak bisa digandeng dari arah kiri oleh huruf setelahnya",
        explanation: "Alaph adalah salah satu huruf non-konektor kiri (tidak bisa menyambung ke kiri)."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Berapakah nilai numerik (Gematria) yang dikandung oleh huruf Alaph?",
        options: ["Nilai 10", "Nilai 5", "Nilai 1", "Nilai 22"],
        correctAnswer: "Nilai 1",
        explanation: "Sebagai huruf pembuka abjad, Alaph merepresentasikan angka 1 dalam tradisi gematria Semit."
      };
      break;

    case 4:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Apakah arti kata 'Beth' (ܒ) dalam kosa kata Semit kuno?",
        options: ["Unta Padang Pasir", "Rumah / Tempat Bernaung", "Buku Catatan", "Tangan Terbuka"],
        correctAnswer: "Rumah / Tempat Bernaung",
        explanation: "Materi menjelaskan 'Beth' (ܒ) melambangkan 'Rumah' (Beytha), lambang keteduhan, keluarga, dan kedamaian batin."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Kapan huruf Beth (ܒ) dilafalkan lembut seperti desis [V] atau [W] tipis?",
        options: ["Bila diberikan tanda pengeras di atasnya", "Bila diletakkan tanda pelemas (Rukakha) di bawahnya", "Selalu diletakkan di awal kata", "Bila diikuti oleh huruf Nun"],
        correctAnswer: "Bila diletakkan tanda pelemas (Rukakha) di bawahnya",
        explanation: "Konsep Qushaya (pengeras) dan Rukakha (pelemas) mengubah vokal Beth dari bunyi [B] mantap menjadi bunyi desis [V] yang santun."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Apakah lambang nilai matematika Gematria dari huruf Beth?",
        options: ["Angka 1", "Angka 2", "Angka 5", "Angka 10"],
        correctAnswer: "Angka 2",
        explanation: "Beth menempati urutan kedua dalam barisan abjad dan bernilai numerik 2."
      };
      break;

    case 5:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Karakter Gamal (ܓ) merepresentasikan simbol makhluk apa?",
        options: ["Singa Padang Pasir", "Unta yang Sabar", "Burung Elang Jauh", "Ikan Pengarung Samudra"],
        correctAnswer: "Unta yang Sabar",
        explanation: "Gamal (ܓ) melambangkan 'Unta' (Gmla) penjelajah padang gurun gersang yang penuh kesabaran."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Pelafalan standar keras dari huruf Gamal (ܓ) terdengar seperti huruf apa?",
        options: ["Huruf [G] dalam 'Garam'", "Huruf [T] dalam 'Tidur'", "Huruf [S] dalam 'Sumpah'", "Huruf [L] dalam 'Lampu'"],
        correctAnswer: "Huruf [G] dalam 'Garam'",
        explanation: "Karakter Gamal keras (Qushaya) disuarakan bulat seperti letupan bunyi konsonan [G]."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Berapakah nilai Gematria dari huruf Gamal?",
        options: ["Angka 1", "Angka 2", "Angka 3", "Angka 4"],
        correctAnswer: "Angka 3",
        explanation: "Uraian teologi menempatkan Gamal pada peringkat ketiga, melambangkan bilangan numerik 3."
      };
      break;

    case 6:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Apakah simbol harfiah utama dari huruf Dalath (ܕ)?",
        options: ["Sebuah Tangga Kebajikan", "Pintu Pembuka Ilmu", "Kunci Gerbang Istana", "Perahu Nelayan"],
        correctAnswer: "Pintu Pembuka Ilmu",
        explanation: "Dalath (ܕ) menggambarkan 'Pintu' (Daltha) yang terbuka mengalirkan ilmu kesusastraan mulia."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Apa penanda krusial yang mutlak ada pada huruf Dalath (ܕ) guna membedakannya dari huruf Resh (ܪ)?",
        options: ["Garis melintang panjang di tengah", "Titik wajib yang diletakkan di BAWAH huruf", "Titik wajib yang diletakkan di ATAS huruf", "Ekor melingkar di ujung kiri"],
        correctAnswer: "Titik wajib yang diletakkan di BAWAH huruf",
        explanation: "Secara ortografi, Dalath (ܕ) memiliki titik di bawahnya, sedangkan Resh (ܪ) memiliki titik di atasnya."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Aram-syriac menggunakan huruf Dalath sebagai kata penunjuk kepemilikan/agen yang setara dengan apa?",
        options: ["Kata tanya 'Siapa'", "Partikel penghubung kepemilikan 'Dari/Yang' (D-)", "Penolak subjek negatif 'Bukan'", "Kata perintah 'Mari'"],
        correctAnswer: "Partikel penghubung kepemilikan 'Dari/Yang' (D-)",
        explanation: "Partikel 'D-' (ܕ) adalah preposisi relatif penting bermakna 'yang' atau 'dari' dalam tata kalimat."
      };
      break;

    case 17:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Apakah nama tanda vokal di dalam bahasa Aramaik-Syriac yang diletakkan di atas huruf dan berbunyi pendek [a]?",
        options: ["Rbasa", "Habasa", "Pthaha", "Zqapha"],
        correctAnswer: "Pthaha",
        explanation: "Pthaha adalah tanda vokal yang berbunyi [a] pendek, direpresentasikan dengan garis miring atau lambang khusus di atas huruf."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Apakah nama tanda vokal yang menghasilkan bunyi [aw] atau [o] bulat panjang?",
        options: ["Zqapha", "Pthaha", "Habasa", "Rbasa"],
        correctAnswer: "Zqapha",
        explanation: "Zqapha merupakan vokal bulat panjang yang menghasilkan suara vokal [o] atau [aw] dalam tradisi Serto."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Kedua tanda vokal dasar ini (Pthaha & Zqapha) diletakkan di bagian mana pada glif huruf konsonan?",
        options: ["Selalu di dalam perut huruf", "Mayoritas di ATAS huruf", "Hanya boleh setelah huruf selesai ditulis", "Di sebelah kiri huruf secara horizontal"],
        correctAnswer: "Mayoritas di ATAS huruf",
        explanation: "Tanda Pthaha dan Zqapha diletakkan di atas huruf konsonan yang bersangkutan untuk mengunci bunyi vokalnya."
      };
      break;

    case 21:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Manakah contoh huruf dalam aksara Serto yang bersikap menolak disambung ke arah kiri (non-konektor kiri)?",
        options: ["Beth (ܒ) dan Mim (ܡ)", "Dalath (ܕ) dan Resh (ܪ)", "Kaph (ܟ) dan Lamadh (ܠ)", "Shin (ܫ) dan Taw (ܬ)"],
        correctAnswer: "Dalath (ܕ) dan Resh (ܪ)",
        explanation: "Huruf Dalath (ܕ), Resh (ܪ), Waw (ܘ), dan Alaph (ܐ) adalah contoh huruf yang enggan atau menolak disambung ke arah kiri."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Mengapa pemahaman aturan hukum sambung aksara mengalir sangat vital bagi pembelajar?",
        options: ["Agar dapat menulis kaligrafi dari kiri ke kanan", "Untuk mengidentifikasi batas rangkaian huruf pembentuk kata mandiri", "Agar menghemat tinta tulisan", "Sebagai syarat administratif kementerian luar negeri"],
        correctAnswer: "Untuk mengidentifikasi batas rangkaian huruf pembentuk kata mandiri",
        explanation: "Rangkaian huruf tersambung akan terputus jika bertemu huruf non-konektor kiri, pemahaman ini membantu mengenali batas kata."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Apa bentuk visual huruf Mim (ܡ) ketika berada di ujung akhir sebuah kata dalam penulisan mengalir?",
        options: ["Sama seperti di awal", "Memanjang ke bawah dengan ekor runcing", "Lepas sepenuhnya menjadi lingkaran kosong", "Dihapus dan diganti titik tunggal"],
        correctAnswer: "Memanjang ke bawah dengan ekor runcing",
        explanation: "Bentuk Mim akhir (Mim-final) memiliki goresan ke bawah yang artistik dan menutup kata dengan tegas."
      };
      break;

    case 22:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Bagaimanakah cara bahasa Aramaik Suryani menyatakan bentuk kata benda definitif ('the' / penunjuk tetap)?",
        options: ["Menambahkan partikel 'Al-' di depan kata", "Menambahkan akhiran huruf Alaph (ܐ) panjang di ujung belakang kata", "Mengulang kata benda tersebut dua kali", "Mengubah warna tinta pada huruf pertama"],
        correctAnswer: "Menambahkan akhiran huruf Alaph (ܐ) panjang di ujung belakang kata",
        explanation: "Khasiat utama tata bahasa Semit timur laut adalah State Emphaticus, di mana akhiran Alaph ditambahkan untuk menegaskan objek benda."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Apakah arti harfiah dari kosa kata definitif mulia 'Shlama' (ܫܠܳܡܳܐ)?",
        options: ["Kitab Suci itu", "Rumah yang Damai", "Damai Sejahtera / Keselamatan itu", "Guru Pengajar Agung"],
        correctAnswer: "Damai Sejahtera / Keselamatan itu",
        explanation: "'Shlama' dibentuk dari akar kata Sh-L-M ditambah Alaph definitif, bermakna 'Kedamaian / Keharmonisan itu'."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Apakah pelafalan kosa kata 'Kthaba' (ܟ݁ܬ݂ܳܒ݂ܳܐ) merepresentasikan obyek apa?",
        options: ["Sebuah Meja Makan", "Kitab Suci / Buku tersebut", "Cahaya Bintang Malam", "Pena Tulis Bambu"],
        correctAnswer: "Kitab Suci / Buku tersebut",
        explanation: "'Kthaba' (ܟ݁ܬ݂ܳܒ݂ܳܐ) berarti 'kitab' atau 'buku' yang telah definitif (kemasukan akhiran Alaph)."
      };
      break;

    case 23:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Di manakah posisi meletakkan kata sambung tunggal 'Waw' (ܘ) ketika menghubungkan dua frasa?",
        options: ["Hanya berdiri sendiri dengan ruang jarak sela", "Digabung menyatu langsung di awal kata berikutnya tanpa spasi", "Ditulis di akhir kata pertama", "Ditiadakan di dalam penulisan resmi"],
        correctAnswer: "Digabung menyatu langsung di awal kata berikutnya tanpa spasi",
        explanation: "Sebagai preposisi proklitik berpaku tunggal, 'Waw' nempel langsung di depan kata berikutnya."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Apakah makna dari kemunculan preposisi berikat 'D-' (ܕ-) di depan suatu kata benda?",
        options: ["Merupakan bentuk tanya terbuka", "Penunjuk kepemilikan genitif ('dari/'yang dimiliki oleh')", "Kata perintah melarang tindakan", "Pengecil ukuran makna obyek"],
        correctAnswer: "Penunjuk kepemilikan genitif ('dari/'yang dimiliki oleh')",
        explanation: "Partikel Dalath preposisional 'D-' berfungsi sebagai tanda relatif genitif yang mengikat kepemilikan objek."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Bagaimana menterjemahkan kosa kata gabungan 'Beytha d-Abba' (ܒ݁ܰܝܬ݁ܳܐ ܕ݁ܐܰܒ݂ܳܐ)?",
        options: ["Rumah milik Ayah", "Pintu dan Jendela", "Ayah sedang membaca buku", "Sekolah tempat belajar bersama"],
        correctAnswer: "Rumah milik Ayah",
        explanation: "Beytha (Rumah) + d- (dari/kepunyaan) + Abba (Ayah) diterjemahkan utuh menjadi 'Rumah milik Ayah'."
      };
      break;

    case 36:
      questions[0] = {
        id: `${materialId}_q1`,
        question: "Apakah karakteristik utama dari konjugasi verba pola 'Pael' di level B1?",
        options: ["Membentuk makna pasif murni", "Menggandakan huruf konsonan tengah untuk makna intensif / aktif kuat", "Hanya dipakai untuk subjek feminin jamak", "Menghilangkan sufiks akhir verba"],
        correctAnswer: "Menggandakan huruf konsonan tengah untuk makna intensif / aktif kuat",
        explanation: "Pola Pael merepresentasikan struktur verba intensif aktif intens dengan pemadatan artikulasi di huruf tengah."
      };
      questions[1] = {
        id: `${materialId}_q2`,
        question: "Bagaimanakah makna kata kerja berubah bila beralih dari pola dasar Peal ke pola Pael?",
        options: ["Dari positif menjadi negatif berbalik", "Dari makna biasa menjadi makna intensif berulang / kausatif", "Berubah menjadi bentuk kata tanya", "Menjadi kata benda abstrak"],
        correctAnswer: "Dari makna biasa menjadi makna intensif berulang / kausatif",
        explanation: "Misalkan 'shbaq' (meninggalkan) berubah menjadi pola Pael 'shabbaq' (membebaskan sepenuhnya / mengampuni dosa)."
      };
      questions[2] = {
        id: `${materialId}_q3`,
        question: "Manakah dialek bacaan vokal yang mempergunakan pelafalan Pael dengan vokal tebal bulat?",
        options: ["Dialek Barat (Serto)", "Dialek Timur (Madnkhaya)", "Dialek Kuno Nabatean", "Gaya tulisan Yunani Koine"],
        correctAnswer: "Dialek Timur (Madnkhaya)",
        explanation: "Dialek Timur Madnkhaya melestarikan vocal-vokal bulat asali pelafalan Semit timur laut secara presisi."
      };
      break;

    default:
      // General fallbacks based on levels
      if (num <= 20) {
        // Level A1 General Quiz
        questions[0] = {
          id: `${materialId}_q1`,
          question: `Apa muatan esensi utama pembelajaran pada ${getShortTitle(materialId)}?`,
          options: ["Tata Bahasa Kompleks dan Sintaksis", "Pengenalan Dasar Abjad, Glif, dan Vokal", "Percakapan Tingkat Tinggi di Pengadilan", "Penulisan Naskah Kuno Kulit Domba"],
          correctAnswer: "Pengenalan Dasar Abjad, Glif, dan Vokal",
          explanation: "Seluruh rangkaian 20 modul tingkat awal di Level A1 didedikasikan untuk menguasai pengenalan abjad konsonan dasar dan tanda pengucapan vokal."
        };
        questions[1] = {
          id: `${materialId}_q2`,
          question: "Dari manakah arah kita mulai membaca kalimat dalam bahasa Aram-syriac?",
          options: ["Atas ke bawah", "Kiri ke kanan", "Kanan ke kiri", "Bebas sesuai estetik visual"],
          correctAnswer: "Kanan ke kiri",
          explanation: "Bahasa Aramaik merupakan rumpun Semit sejati, dengan demikian seluruh materi dibaca dari kanan ke kiri."
        };
        questions[2] = {
          id: `${materialId}_q3`,
          question: "Mengapa penting menandai selesai setiap modul pengajaran mandiri ini?",
          options: ["Untuk mendapatkan koin game online", "Melacak laju konsistensi belajar guna membuka kuncian modul berikutnya", "Agar terhapus otomatis dari akun", "Agar kuota internet admin bertambah"],
          correctAnswer: "Melacak laju konsistensi belajar guna membuka kuncian modul berikutnya",
          explanation: "Sistem gating pembelajaran sekuensial kami mengharuskan penyelesaian modul terstruktur demi efektivitas pemahaman bertahap."
        };
      } else if (num <= 35) {
        // Level A2 General Quiz
        questions[0] = {
          id: `${materialId}_q1`,
          question: "Partikel 'd-' pada Level A2 sering kali berfungsi untuk menjembatani hubungan apa?",
          options: ["Frase Kepemilikan (Genitif) atau Penghubung Relatif", "Pernyataan Sumpah Serapah", "Pertanyaan Masa Depan", "Pemberhentian Suku Kata"],
          correctAnswer: "Frase Kepemilikan (Genitif) atau Penghubung Relatif",
          explanation: "Partikel preposisi tunggal 'd-' nempel di awal kata untuk menyatakan kepemilikan ('milik/dari') atau penghubung kalimat bermakna 'yang'."
        };
        questions[1] = {
          id: `${materialId}_q2`,
          question: "Apa sufiks vokal penanda kata benda maskulin definitif yang paling dominan?",
          options: ["Akhiran vokal pendek [i]", "Huruf Alaph panjang (ܐ) di ujung akhir kata", "Prefiks huruf Beth murni", "Tanda silang melintang"],
          correctAnswer: "Huruf Alaph panjang (ܐ) di ujung akhir kata",
          explanation: "State Emphaticus bahasa Aram-syriac lazim menambahkan huruf Alaph di ujung akhir kata benda guna memberikan penekanan definitif."
        };
        questions[2] = {
          id: `${materialId}_q3`,
          question: "Berhasil lulus kuis modul ini dengan skor minimum berapa persen untuk membuka modul berikutnya?",
          options: ["Minimal 50%", "Minimal 70%", "Minimal 60%", "Harus 100% sempurna"],
          correctAnswer: "Minimal 70%",
          explanation: "Standar kelulusan kurikulum untuk membuka gembok akses modul berikutnya diatur minimal 70%."
        };
      } else {
        // Level B1 General Quiz
        questions[0] = {
          id: `${materialId}_q1`,
          question: "Konjugasi Verba tingkat lanjut pola 'Ethpeel' pada materi Level B1 melambangkan apa?",
          options: ["Makna Pasif atau Refleksif dari verba dasar", "Perintah Kausatif yang Memaksa", "Kelampauan Masa Lalu Sekali", "Keinginan Masa Depan yang Hebat"],
          correctAnswer: "Makna Pasif atau Refleksif dari verba dasar",
          explanation: "Pola berikat awalan Eth- (Ethpeel, Ethpaal) adalah bentuk baku untuk menyusun kata kerja bermakna pasif atau reflektif."
        };
        questions[1] = {
          id: `${materialId}_q2`,
          question: "Apakah nama naskah Alkitab kuno bahasa Aramaik Suryani yang legendaris?",
          options: ["Peshitta", "Vulgata", "Septuaginta", "Pentateukh Samaria"],
          correctAnswer: "Peshitta",
          explanation: "Naskah Peshitta (ܦܫܺܝܛܬ݁ܳܐ) adalah versi standar Alkitab kuno dalam bahasa Aramaik-Syriac yang berarti 'Sederhana' atau 'Terbuka'."
        };
        questions[2] = {
          id: `${materialId}_q3`,
          question: "Apakah keuntungan mempelajari asimilasi linguistik Aramaik dengan bahasa Semit lainnya?",
          options: ["Membatalkan pemahaman tata bahasa asli", "Mempermudah intuisi kosakata serumpun, kesamaan sejarah, dan akar trikonsonan", "Hanya membuang waktu produktif", "Menghapus kewajiban membayar biaya server"],
          correctAnswer: "Mempermudah intuisi kosakata serumpun, kesamaan sejarah, dan akar trikonsonan",
          explanation: "Bahasa Semit memiliki struktur akar tri-konsonan (three-consonant roots) yang sama, menyederhanakan pemahaman lintas rumpun."
        };
      }
  }

  return questions;
}

function getShortTitle(materialId: string): string {
  const match = materialId.match(/mat_(\d+)/);
  if (!match) return "Modul Pengajaran";
  return `Modul ${match[1]}`;
}
