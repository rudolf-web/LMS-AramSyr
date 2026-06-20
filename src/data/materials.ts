import { Material, QuizQuestion, Assignment } from '../types';

export const INITIAL_MATERIALS: Material[] = [
  // ================= LEVEL A1 (MODUL 1 - 20) =================
  {
    id: 'mat_1',
    title: '[Level A1] Modul 1: Selamat Datang di Dunia Sastra Aramaik',
    category: 'Sejarah & Budaya',
    type: 'text',
    description: 'Awali petualangan Anda dengan mengenali akar rumpun bahasa Semit kuno yang sarat nilai historis.',
    bodyText: 'Halo Sahabat Pembelajar! \n\nSelamat datang di pintu gerbang Bahasa Aramaik Suryani. Bahasa ini adalah salah satu pusaka peradaban dunia yang telah dituturkan selama lebih dari 3.000 tahun di kawasan Bulan Sabit Subur Timur Tengah. \n\nLangkah pertama Anda di level A1 ini akan terasa sangat menyenangkan dan menenangkan. Kita tidak akan terburu-buru. Di modul ini, kita belajar bahwa Aramaik serumpun dengan Arab dan Ibrani. Gaya tulisan utamanya yang akan kita kenal adalah:\n1. Estrangelo (ܐܸܣܛܪܲܢܓܹܠܵܐ): Aksara resmi klasik yang tegap dan berwibawa.\n2. Serto (ܣܸܪܛܳܐ): Gaya barat yang melengkung lembut dan luwes.\n3. Madnkhaya (ܡܲܕ݂ܢܚܵܝܵܐ): Ragam timur yang penuh ornamen vokal melingkar.\n\nMari tarik napas dalam-dalam, nikmati prosesnya, dan mulailah dengan senyum!',
    estimatedMinutes: 8
  },
  {
    id: 'mat_2',
    title: '[Level A1] Modul 2: Anatomi 22 Huruf Abjad Suryani',
    category: 'Abjad',
    type: 'text',
    description: 'Pelajari rupa-rupa 22 glif dasar dari kanan ke kiri dengan cara sederhana dan menyenangkan.',
    bodyText: 'Sahabat Pembelajar, tahukah Anda bahwa abjad Aramaik hanya terdiri dari 22 konsonan? Ya, tidak ada huruf kapital maupun huruf kecil di sini!\n\nYang paling menarik, seluruh teks ditulis dan dibaca dari **KANAN ke KIRI (RTL)**. Pada modul kedua ini, kita melihat sekilas bentuk-bentuk huruf utama mulai dari Alaph (ܐ) hingga Taw (ܬ).\n\nTips Nyaman Belajar:\nJangan mencoba menghafal ke-22 huruf ini dalam satu malam. Nikmati keindahan lengkungan glifnya seperti Anda menikmati seni kaligrafi yang menyejukkan jiwa.',
    estimatedMinutes: 10
  },
  {
    id: 'mat_3',
    title: '[Level A1] Modul 3: Membaca Karakter Agung - Alaph (ܐ)',
    category: 'Abjad',
    type: 'audio',
    contentUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    description: 'Mendengarkan pengucapan dan makna filosofis huruf pertama Alaph sebagai lambang kesatuan.',
    bodyText: 'Huruf Alaph (ܐ) melambangkan angka 1 dan arti historisnya adalah "Sapi Jantan" atau simbol kekuatan dan kepemimpinan.\n\nFakta Menarik:\nAlaph adalah huruf yang sangat mandiri. Ia tidak bisa digandeng dari arah kiri oleh huruf apapun setelahnya. Suara dasarnya lembut, seperti hamzah dalam bahasa Arab atau penutup napas yang halus.\n\nDengarkan audio di atas untuk merasakan getaran suara Alaph yang tenang.',
    estimatedMinutes: 7
  },
  {
    id: 'mat_4',
    title: '[Level A1] Modul 4: Eksplorasi Rumah Jiwa - Beth (ܒ)',
    category: 'Abjad',
    type: 'text',
    description: 'Memahami filosofi huruf Beth yang berarti "Rumah" atau tempat bernaung yang damai.',
    bodyText: 'Selamat atas kemajuan Anda! Sekarang kita beralih ke huruf Beth (ܒ). Beth melambangkan "Rumah" (Beytha).\n\nDalam tata bahasa Semit, rumah melambangkan keamanan, kehangatan keluarga, dan kedamaian hati. Pelafalan Beth memiliki dua ragam vokal:\n- Keras: Terdengar seperti suara [B] mantap jika diberi tanda pengeras di atasnya.\n- Lembut: Terdengar seperti desisan lembut [V] atau [W] tipis jika diletakkan tanda pelemas di bawahnya.\n\nRasakan kelembutan pelafalan ini saat Anda melatih goresan Beth Anda.',
    estimatedMinutes: 6
  },
  {
    id: 'mat_5',
    title: '[Level A1] Modul 5: Melangkah Tegap Bersama - Gamal (ܓ)',
    category: 'Abjad',
    type: 'text',
    description: 'Mengenal huruf Gamal yang melambangkan sarana transportasi gurun atau "Unta".',
    bodyText: 'Huruf ketiga kuno kita adalah Gamal (ܓ), melambangkan "Unta" (Gmla) yang sabar menjelajahi padang pasir luas.\n\nDalam pembelajaran mandiri ini, bayangkan ketabahan Unta sebagai lambang ketekunan belajar kita yang berbuah manis. Pelafalannya mirip seperti huruf [G] dalam kata "Garam" atau vokal lembut di tenggorokan seperti ghain.\n\nIngatlah: Setiap langkah kecil Anda membaca aksara ini adalah kemajuan besar bagi ketajaman memori Anda!',
    estimatedMinutes: 8
  },
  {
    id: 'mat_6',
    title: '[Level A1] Modul 6: Kunci Pintu Pengetahuan - Dalath (ܕ)',
    category: 'Abjad',
    type: 'text',
    description: 'Mempelajari Dalath yang berarti "Pintu" pembuka ilmu yang mencerahkan pikiran.',
    bodyText: 'Huruf Dalath (ܕ) melambangkan bendera segitiga kecil dengan titik wajib di bawahnya guna membedakannya dari huruf Resh (ܪ).\n\nSecara filosofis, Dalath menggambarkan "Pintu" (Daltha). Pintu ini terbuka lebar menyambut Anda masuk ke dalam khazanah bahasa kuno terlengkap. Suaranya terdengar seperti huruf [D] atau desis lembut "th" seperti dalam kata bahasa Inggris "the". Letakkan jemari Anda dengan rileks saat menulis Dalath.',
    estimatedMinutes: 9
  },
  {
    id: 'mat_7',
    title: '[Level A1] Modul 7: Tinjauan Interaktif Menggambar 4 Huruf Pertama',
    category: 'Abjad',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/RImI6h2m618',
    description: 'Video visual tutorial menggoreskan pena untuk Alaph, Beth, Gamal, dan Dalath.',
    bodyText: 'Tonton video di atas secara santai. Amati aliran garis penanya yang anggun.\n\nLatihan Sederhana:\nDi atas selembar kertas putih, buatlah goresan:\nܐ (Alaph) - ܒ (Beth) - ܓ (Gamal) - ܕ (Dalath)\n\nLuar biasa, Anda kini sudah menguasai rangkaian abjad pembuka (A-B-G-D) yang legendaris!',
    estimatedMinutes: 12
  },
  {
    id: 'mat_8',
    title: '[Level A1] Modul 8: Hembusan Jeda Syahdu - He (ܗ) & Waw (ܘ)',
    category: 'Abjad',
    type: 'text',
    description: 'Menguasai pelafalan suara desah napas He dan vokal penghubung Waw.',
    bodyText: 'Kita beranjak ke huruf berikutnya:\n- He (ܗ): Bernilai numerik 5, melambangkan hembusan jendela udara segar. Dan dilafalkan sebagai desahan halus [H].\n- Waw (ܘ): Bernilai 6, melambangkan pasak pengait atau kancing baju yang menghubungkan kalimat demi kalimat (berarti "Dan").\n\nKedua huruf ini memberikan ketukan ritme bernapas yang lambat dan nyaman saat kita melafalkan kalimat liturgi.',
    estimatedMinutes: 8
  },
  {
    id: 'mat_9',
    title: '[Level A1] Modul 9: Melirik Kilau Cahaya - Zain (ܙ) & Heth (ܚ)',
    category: 'Abjad',
    type: 'text',
    description: 'Mempelajari getaran tajam Zain serta desah dalam tenggorokan dari huruf Heth.',
    bodyText: 'Petualangan kita makin menarik dengan bertemunya dua abjad kontras:\n- Zain (ܙ): Bernilai numerik 7, dilafalkan nyaring seperti [Z] dalam kata "Zebra".\n- Heth (ܚ): Bernilai numerik 8, dilafalkan dengan suara gesekan tenggorokan bagian dalam, terdengar hangat dan bersih.\n\nTips Nyaman:\nKeluarkan napas tipis di tenggorokan saat melafalkan Heth (ܚ). Rasakan kehangatannya. Sempurna!',
    estimatedMinutes: 7
  },
  {
    id: 'mat_10',
    title: '[Level A1] Modul 10: Ketepatan Sempurna - Teth (ܛ) & Yodh (ܝ)',
    category: 'Abjad',
    type: 'text',
    description: 'Memahami huruf emfatis Teth dan huruf vokal semi-konsonan Yodh.',
    bodyText: 'Mari berkenalan dengan:\n- Teth (ܛ): Bernilai numerik 9, huruf [T] tebal dengan lidah merapat ke langit-langit keras.\n- Yodh (ܝ): Huruf terkecil secara fisik namun bernilai tinggi yaitu 10! Melambangkan genggaman "Tangan" yang aktif berkarya.\n\nYodh kerap kali bertindak seperti vokal [I] panjang yang menyejukkan rima pembacaan kita.',
    estimatedMinutes: 8
  },
  {
    id: 'mat_11',
    title: '[Level A1] Modul 11: Kekuatan Sentuhan - Kaph (ܟ) & Lamadh (ܠ)',
    category: 'Abjad',
    type: 'text',
    description: 'Mempelajari lekukan telapak tangan Kaph dan simbol tongkat gembala Lamadh.',
    bodyText: 'Dua huruf ini sangat sering Anda temui:\n- Kaph (ܟ): Melambangkan telapak tangan terbuka, dilafalkan [K] tajam atau [Kh] lembut berdesis.\n- Lamadh (ܠ): Melambangkan tongkat gembala yang menggiring domba menuju hamparan rumput hijau yang tenang. Dilafalkan sebaga huruf [L].\n\nLamadh memiliki tiang vertikal menjulang ke atas, sangat anggun dipandang.',
    estimatedMinutes: 6
  },
  {
    id: 'mat_12',
    title: '[Level A1] Modul 12: Simbol Kehidupan Semesta - Mim (ܡ) & Nun (ܢ)',
    category: 'Abjad',
    type: 'text',
    description: 'Menguak lambang samudra air Mim yang sejuk dan simbol kebangkitan Nun.',
    bodyText: 'Kombinasi air dan kehidupan:\n- Mim (ܡ): Bernilai numerik 40, melambangkan "Air" (Mayya) yang menyegarkan dahaga rohani. Suara [M] lembut.\n- Nun (ܢ): Bernilai numerik 50, melambangkan pergerakan air atau benih kehidupan baru. Suara [N] yang mendengung rileks.\n\nMim dan Nun memiliki rupa penulisan khusus di akhir kata (final form) agar menghemat ruang naskah.',
    estimatedMinutes: 7
  },
  {
    id: 'mat_13',
    title: '[Level A1] Modul 13: Perisai Kehati-hatian - Semkath (ܣ) & E (ܥ)',
    category: 'Abjad',
    type: 'text',
    description: 'Mempelajari lingkaran murni Semkath dan suara guttural dalam huruf E.',
    bodyText: 'Langkah mulia berlanjut:\n- Semkath (ܣ): Berbentuk lingkaran bulat penuh menawan yang melambangkan "Pilar Penopang". Dilafalkan sebagai desis [S] bersih.\n- E / Ayin (ܥ): Menyuarakan resonansi guttural serak-serak basah yang khas dalam bahasa Semitik Timur Tengah.\n\nJangan berkecil hati jika suara Ayin terasa sulit di awal; latihan perlahan akan menyempurnakannya secara alami.',
    estimatedMinutes: 8
  },
  {
    id: 'mat_14',
    title: '[Level A1] Modul 14: Ungkapan Manis dari Jiwa - Pe (ܦ) & Sadhe (ܨ)',
    category: 'Abjad',
    type: 'text',
    description: 'Mengenal simbol mulut manis Pe dan pancaran keadilan dari huruf Sadhe.',
    bodyText: 'Mari ekspresikan kata-kata baik:\n- Pe (ܦ): Melambangkan "Mulut" (Puma) penyampai petuah bijak. Dilafalkan [P] atau [F] lembut.\n- Sadhe (ܨ): Melambangkan "Kail Pancing" atau simbol kejujuran moral. Dilafalkan sebagai huruf [Ts] empati dengan desisan kuat.\n\nKedua abjad ini merupakan rintisan bagi Anda menuju kemahiran membaca mutlak.',
    estimatedMinutes: 7
  },
  {
    id: 'mat_15',
    title: '[Level A1] Modul 15: Puncak Penghormatan - Qoph (ܩ) & Resh (ܪ)',
    category: 'Abjad',
    type: 'text',
    description: 'Memahami getaran kuat pangkal tenggorokan Qoph dan huruf kepala Resh.',
    bodyText: 'Memasuki barisan huruf akhir:\n- Qoph (ܩ): Bernilai numerik 100, dilafalkan dari bagian paling belakang tenggorokan Anda.\n- Resh (ܪ): Bernilai numerik 200, melambangkan "Kepala" pemilik kebijaksanaan pikiran. Berbentuk lengkungan dengan titik tegas di atasnya.\n\nResh menyuarakan getaran konsonan [R] yang bergulir agung.',
    estimatedMinutes: 8
  },
  {
    id: 'mat_16',
    title: '[Level A1] Modul 16: Penutup Barisan Mulia - Shin (ܫ) & Taw (ܬ)',
    category: 'Abjad',
    type: 'text',
    description: 'Mempelajari busur Shin dan simbol tanda perjanjian penutup Taw.',
    bodyText: 'Tibalah kita di akhir barisan 22 huruf:\n- Shin (ܫ): Melambangkan rahang gigi atau pusaran api yang membakar semangat belajar kita. Dilafalkan [Sh] tebal.\n- Taw (ܬ): Lambang penutup bermakna "Tanda Batas" atau penyelesaian paripurna. Dilafalkan sebagai huruf [T] atau [Th] desis halus.\n\nSelamat! Anda kini telah melintasi seluruh 22 gerbang karakter dasar Aramaik Suryani dengan sangat baik.',
    estimatedMinutes: 9
  },
  {
    id: 'mat_17',
    title: '[Level A1] Modul 17: Harmoni Vokal Dasar - Pthaha & Zqapha',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Belajar mengeja suku kata dengan harakat vokal pembuka [A] pendek dan panjang.',
    bodyText: 'Di materi tata bahasa ini, kita akan mempelajari bagaimana cara mengucapkan kata utuh menggunakan sistem tanda vokal:\n- Pthaha (ܦܬ݂ܳܚܳܐ): Garis diagonal di atas huruf yang menghasilkan bunyi vokal [A] cerah dan pendek (seperti kata "Bapak").\n- Zqapha (ܙܩܳܦ݂ܳܐ): Berwujud seperti huruf melengkung kecil di atas abjad yang mendengungkan bunyi [O] atau [A] panjang ditiup tebal.\n\nMengeja suku kata ini terasa seperti melantunkan seloka puitis yang damai.',
    estimatedMinutes: 10
  },
  {
    id: 'mat_18',
    title: '[Level A1] Modul 18: Tanda Syahdu - Vokal Rbasa & Habasa',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Memperdalam pelafalan harakat penyejuk vokal [E] dan [I] tenang.',
    bodyText: 'Penyejuk rima ejaan kita:\n- Rbasa (ܪܒ݂ܳܨܳܐ): Tanda vokal berupa titik ganda miring yang melambangkan bunyi [E] tipis bersemangat.\n- Habasa (ܚܒ݂ܳܨܳܐ): Tanda vokal berupa titik tunggal di bawah garis atau di dalam huruf Yodh yang meresonansikan bunyi [I] jernih.\n\nMari kita gabungkan di kertas latihan: ܒ (Beth) + Habasa = Bi. Menyenangkan, bukan?',
    estimatedMinutes: 8
  },
  {
    id: 'mat_19',
    title: '[Level A1] Modul 19: Kosakata Kehidupan Pertama',
    category: 'Percakapan',
    type: 'text',
    description: 'Menghafal kosakata perdana bertema harmoni keluarga dan rasa syukur.',
    bodyText: 'Mari kita ucapkan dan rasakan keindahan maknanya:\n- ܐܰܒ݂ܳܐ (Abba): Ayah tercinta yang membimbing dengan tabah.\n- ܐܶܡܳܐ (Imma): Ibu penyayang yang meneduhi seisi rumah.\n- ܒ݁ܪܳܐ (Bra): Anak laki-laki penerus harapan.\n- ܒ݁ܰܝܬ݁ܳܐ (Beytha): Rumah perlindungan yang tenteram dan sejuk.\n\nLatihlah menulis kata-kata penuh kasih ini pada tablet Anda.',
    estimatedMinutes: 9
  },
  {
    id: 'mat_20',
    title: '[Level A1] Modul 20: Gerbang Kelulusan Ujian Akhir Level A1',
    category: 'Sejarah & Budaya',
    type: 'document',
    description: 'Persiapan batin dan tinjauan komprehensif 22 huruf untuk mengajukan sertifikat kelulusan tercetak.',
    bodyText: 'Selamat yang tak terhingga! Anda telah berhasil meniti 20 modul dasar di Level A1. \n\nKini tiba saatnya meraih pengakuan formal atas kegigihan disiplin belajar Anda. Di akhir modul ini, Anda dipersilakan menuju menu "Evaluasi Kuis" di tab atas. Selesaikan kuis evaluasi komprehensif tersebut. \n\nApabila Anda berhasil mendaratkan skor minimal 70%, sistem akan langsung membuka **Sertifikat Digital Resmi Aramaik Suryani** yang ditandatangani langsung oleh Rudolf A. Luhukay, bersumber dari arsip pengajar terverifikasi, dan siap untuk Anda CETAK / PRINT langsung sebagai tanda pencapaian gemilang Anda!',
    estimatedMinutes: 15
  },

  // ================= LEVEL A2 (MODUL 21 - 35) =================
  {
    id: 'mat_21',
    title: '[Level A2] Modul 21: Hukum Sambung Aksara Mengalir Serto',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Mempelajari rahasia sambungan huruf serto mengalir bagai aliran sungai jernih.',
    bodyText: 'Selamat datang di Level A2! Anda berada di tingkat menengah pemula.\n\nDi sini kita belajar bahwa aksara Serto meliuk-liuk secara organik di dalam sebuah kata. Ada huruf yang bersikap sosial (menyambung ke depan dan belakang) seperti Beth (ܒ) dan Mim (ܡ). Namun ada pula huruf pemalu yang enggan menyambung ke kiri seperti Dalath (ܕ), Resh (ܪ), dan Waw (ܘ).\n\nMemahami aturan kemandirian huruf ini membuat Anda makin intuitif mengenali struktur teks kuno.',
    estimatedMinutes: 10
  },
  {
    id: 'mat_22',
    title: '[Level A2] Modul 22: Penggunaan Kata Sandang dan Penunjuk Subjek',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Menambahkan imbuhan penjelas kata benda tunggal maskulin dan feminin.',
    bodyText: 'Berbeda dengan bahasa Inggris yang memakai "the", bahasa Aramaik Suryani menambahkan akhiran huruf Alaph (ܐ) panjang di ujung kata untuk menyatakan kata benda definitif.\n\nContoh konkret:\n- ܫܠܳܡܳܐ (Shlama) = Damai sejahtera itu.\n- ܟ݁ܬ݂ܳܒ݂ܳܐ (Kthaba) = Kitab suci tersebut.\n\nDengan imbuhan akhir ini, kalimat Anda menjadi lebih terstruktur dan lugas.',
    estimatedMinutes: 8
  },
  {
    id: 'mat_23',
    title: '[Level A2] Modul 23: Kata Hubung Penghubung Rasa - Waw & D-',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Mengintegrasikan kata sambung "dan" serta penunjuk kepunyaan "dari" ke dalam frase.',
    bodyText: 'Partikel sederhana berdaya magis:\n- ܘ- (Waw-): Digabung langsung di awal kata berikutnya untuk mengikat unsur setara ("Dan").\n- ܕ- (D-): Partikel kepunyaan ("Yang" / "Dari").\n\nFrase agung:\nܒ݁ܰܝܬ݁ܳܐ ܕ݁ܐܰܒ݂ܳܐ (Beytha d-Abba) = Rumah dari Ayah.\n\nBukankah penulisan teranyar ini tampak sangat ringkas dan menawan?',
    estimatedMinutes: 7
  },
  {
    id: 'mat_24',
    title: '[Level A2] Modul 24: Kata Ganti Orang Tunggal Penentram Perbincangan',
    category: 'Percakapan',
    type: 'text',
    description: 'Latihan menggunakan kata Aku (Eno), Kamu (Ant), dan Dia (Hu) secara ramah.',
    bodyText: 'Ucapkan dengan lafal lembut:\n- ܐܶܢܳܐ (Eno) = Saya / Aku bernaung.\n- ܐܰܢ݁ܬ݁ (Ant) = Engkau / Kamu pembelajar santun.\n- ܗܽܘ (Hu) = Dia laki-laki.\n- ܗܺܝ (Hi) = Dia perempuan.\n\nSaat berbicara dengan kawan, selipkan kata ini untuk mempererat keakraban sejati.',
    estimatedMinutes: 8
  },
  {
    id: 'mat_25',
    title: '[Level A2] Modul 25: Misteri Numerik - Rahasia Gematria Abjad',
    category: 'Sejarah & Budaya',
    type: 'text',
    description: 'Mengungkap nilai numerik di balik setiap goresan rahasia kaligrafi Aramaik.',
    bodyText: 'Dalam peradaban kuno, angka tidak ditulis dengan lambang khusus melainkan mengganti nilainya dengan abjad konsonan. \n\nMisal:\nܐ (Alaph) = 1, ܒ (Beth) = 2, ܝ (Yodh) = 10, ܩ (Qoph) = 100.\n\nHal ini melahirkan cabang ilmu Gematria, di mana setiap rangkaian kata memiliki pesan sandi angka spiritual yang melambangkan keharmonisan semesta.',
    estimatedMinutes: 12
  },
  {
    id: 'mat_26',
    title: '[Level A2] Modul 26: Kata Sifat Berkarakter Harmonis',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Aturan penyesuaian gender kata sifat mengikuti kata benda yang diterangkan.',
    bodyText: 'Dalam Aramaik Suryani, kata sifat harus mengikuti gender dan jumlah dari kata benda yang disertainya. \n\nContoh:\n- ܒ݁ܰܝܬ݁ܳܐ ܫܰܦ݁ܺܝܪܳܐ (Beytha shaphira) = Rumah yang indah (Maskulin).\n- ܡܕ݂ܺܝܢ݁ܬ݁ܳܐ ܫܰܦ݁ܺܝܪܬ݁ܳܐ (Mdritha shaphirtha) = Kota yang indah (Feminin).\n\nHarmoni keselarasan bunyi akhir ini melahirkan sensasi kepuasan estetis yang mendalam bagi pendengarnya.',
    estimatedMinutes: 9
  },
  {
    id: 'mat_27',
    title: '[Level A2] Modul 27: Kata Kerja Masa Lalu Tunggal - Pola Peal',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Memahami bagaimana menyatakan tindakan yang telah selesai dikerjakan.',
    bodyText: 'Untuk menyatakan perbuatan yang sudah lampau (Perfect Tense) dalam pola aktif dasar Peal:\n- ܟ݁ܬ݂ܰܒ݂ (Kthab) = Dia (laki-laki) telah menulis sebuah risalah damai.\n- ܟ݁ܬ݂ܰܒ݂ܬ݁ (Kthabth) = Engkau telah menulis.\n\nLakukan analisis ini dengan tenang di lembar jawab Anda.',
    estimatedMinutes: 10
  },
  {
    id: 'mat_28',
    title: '[Level A2] Modul 28: Harapan Masa Depan - Imperfek Tunggal',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Merangkai kalimat prospektif masa depan atau keinginan berkelanjutan.',
    bodyText: 'Menyatakan perbuatan yang sedang atau akan dilakukan (Imperfect Tense):\n- ܢܶܟ݁ܬ݁ܽܘܒ݂ (Nektob) = Dia akan menulis.\n- ܐܶܟ݁ܬ݁ܽܘܒ݂ (Ektob) = Saya akan menulis.\n\nIni adalah landasan penting untuk menyusun doa harapan di masa depan.',
    estimatedMinutes: 9
  },
  {
    id: 'mat_29',
    title: '[Level A2] Modul 29: Kalimat Tanya yang Membuka Ruang Dialog',
    category: 'Percakapan',
    type: 'text',
    description: 'Kata tanya sopan untuk membangun interaksi ramah antar pembelajar.',
    bodyText: 'Gunakan kata tanya berikut secara anggun:\n- ܡܰܢ (Man?) = Siapakah gerangan Anda?\n- ܡܳܢܳܐ (Mona?) = Apakah yang sedang Anda pelajari?\n- ܐܰܝܟ݁ܳܐ (Ayka?) = Di manakah letak madrasah klasik ini?\n\nDialog terbuka menumbuhkan rasa empati dan saling menghargai.',
    estimatedMinutes: 8
  },
  {
    id: 'mat_30',
    title: '[Level A2] Modul 30: Menjalin Ukhuwah - Cara Menyapa & Merespon',
    category: 'Percakapan',
    type: 'audio',
    contentUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    description: 'Rekaman cara menyapa perdamaian Shlama Lokh beserta jawabannya yang tulus.',
    bodyText: 'Ucapkan percakapan dasar ini:\n- ܫܠܳܡܳܐ ܠܳܟ݂ (Shlama lokh) = Damai bagimu (untuk pria).\n- ܫܠܳܡܳܐ ܠܶܟ݂ (Shlama lekh) = Damai bagimu (untuk wanita).\n- ܫܠܳܡܳܐ ܥܰܠܝܟ݁ܽܘܢ (Shlama alaykhon) = Damai bagi kalian semua.\n\nJawaban tulus:\nܒ݁ܽܘܪܟ݁ܬ݂ܳܐ ܕ݁ܐܰܠܳܗܳܐ (Burktha d-Alaha) = Berkat Tuhan menyertaimu.',
    estimatedMinutes: 10
  },
  {
    id: 'mat_31',
    title: '[Level A2] Modul 31: Bilangan Kardinal Satu Hingga Sepuluh',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Menghitung benda-benda dalam bahasa Aram-syriac dengan rima yang indah.',
    bodyText: 'Meraba hitungan angka Semit kuno:\n1. ܚܰܕ݂ (Hadh) - Satu\n2. ܬ݁ܪܶܝܢ (Treyn) - Dua\n3. ܬ݁ܠܳܬ݂ܳܐ (Tlatha) - Tiga\n4. ܐܰܪܒ݁ܥܳܐ (Arb\'a) - Empat\n5. ܚܰܡܫܳܐ (Hamsha) - Lima\n\nBilangan ini beresonansi indah melatih kelenturan lidah kita.',
    estimatedMinutes: 7
  },
  {
    id: 'mat_32',
    title: '[Level A2] Modul 32: Berbagi Keberkahan Rezeki dalam Berniaga',
    category: 'Percakapan',
    type: 'text',
    description: 'Fokus percakapan jual beli sederhana yang mengutamakan keberkahan koin dirham.',
    bodyText: 'Mari saksikan ungkapan kejujuran ini:\n- ܟ݁ܡܳܐ ܗܳܢܳܐ؟ (Kma hona?) = Berapakah harga bejana gandum ini?\n- ܗܳܢܳܐ ܒ݁ܰܬ݂ܪܶܝܢ ܕ݁ܺܝܢܳܐܪܝܺܢ (Hona ba-treyn dinarin) = Ini seharga dua dinar saja.\n\nTransaksi yang dilandasi rukun damai menciptakan harmoni sosial sejak ribuan tahun lalu.',
    estimatedMinutes: 8
  },
  {
    id: 'mat_33',
    title: '[Level A2] Modul 33: Tinjauan Doa Abun dbashmayya - Bagian 1',
    category: 'Sejarah & Budaya',
    type: 'text',
    description: 'Kajian sastra baris awal doa universal keluhuran budi.',
    bodyText: 'Teks transliterasi liturgi:\n"ܐܰܒ݂ܽܘܢ ܕ݁ܒ݂ܰܫܡܰܝܳܐ ܢܶܬ݂ܩܰܕ݁ܰܫ ܫܡܳܟ݂"\n(Abun d-bashmayya nethqadash shmokh)\nArti: Bapa kami yang di surga, dikuduskanlah nama-Mu.\n\nMelalui kalimat ini kita meriset bagaimana tata bahasa disatukan dalam rima vokal zqapha yang agung.',
    estimatedMinutes: 11
  },
  {
    id: 'mat_34',
    title: '[Level A2] Modul 34: Tinjauan Doa Abun dbashmayya - Bagian 2',
    category: 'Sejarah & Budaya',
    type: 'text',
    description: 'Ulasan kelanjutan baris permohonan rezeki harian dan perlindungan rohani.',
    bodyText: 'Teks lanjutan:\n"ܗܰܒ݂ ܠܰܢ ܠܰܚܡܳܐ ܕ݁ܣܽܘܢܩܳܢܰܢ ܝܰܘܡܳܢܳܐ"\n(Hab lan lahma d-sunqanan yawmana)\nArti: Berikanlah kami porsi makanan yang cukup pada hari ini.\n\nKata "Lahma" (Roti/Makanan) serumpun dengan "Lahm" dalam bahasa Arab yang meneduhkan jiwa petualang.',
    estimatedMinutes: 10
  },
  {
    id: 'mat_35',
    title: '[Level A2] Modul 35: Evaluasi Portofolio Penulisan Menengah Jilid I',
    category: 'Tata Bahasa',
    type: 'document',
    description: 'Rangkuman lengkap tata bahasa penanda level A2 dan persiapan menuju kemandirian B1.',
    bodyText: 'Selamat! Modul 35 menandai rampungnya perjalanan komprehensif Anda di Level A2. \n\nKini Anda telah menguasai kaidah sambung serto, kata ganti orang lengkap, serta struktur doa liturgis. Di modul lanjutan B1 esok, kita akan menyelami lautan sastra klasik naskah kulit domba yang sesungguhnya.',
    estimatedMinutes: 14
  },

  // ================= LEVEL B1 (MODUL 36 - 50) =================
  {
    id: 'mat_36',
    title: '[Level B1] Modul 36: Memasuki Kedalaman Tata Bahasa B1 - Pola Pael',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Membelah kata kerja intensif (Pael) dengan penekanan huruf konsonan pe.',
    bodyText: 'Selamat datang di Level B1! Anda kini adalah pembelajar mandiri tingkat mahir.\n\nPada modul 36 ini, kita mengkaji pola kata kerja Pael (intensif). Bentuk ini mirip dengan pola "Piael" dalam bahasa Ibrani atau "Fa\'ala" (tasydid) dalam tata bahasa Arab. Kegunaannya adalah memberi kekuatan berlipat pada arti kata dasar.\n\nContoh:\n- ܫܰܒ݁ܰܚ (Shabbah) = Sangat memuji / memuliakan dengan segenap jiwa rasa syukurnya.',
    estimatedMinutes: 12
  },
  {
    id: 'mat_37',
    title: '[Level B1] Modul 37: Pola Kausatif Berdaya Dorong - Aphel Conjugation',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Mempelajari cara merubah verba menjadi bermakna "menyebabkan tindakan terjadi".',
    bodyText: 'Bagaimana membuat orang lain melakukan sesuatu? Kita menggunakan pola Aphel!\n\nJika ܢܦ݂ܰܩ (Nphaq) berarti "Keluar", maka imbuhan awal Alaph melahirkan verba kausatif:\n- ܐܰܦ݁ܶܩ (Appeq) = Mengeluarkan / membawa keluar ke tempat aman.\n\nNikmati ketepatan rumus pembentukan kata ini yang logis dan memuaskan nalar Anda.',
    estimatedMinutes: 11
  },
  {
    id: 'mat_38',
    title: '[Level B1] Modul 38: Refleksi Diri yang Pasif - Pola Ethpeel',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Merumuskan verba refleksif pasif dengan partikel awalan Eth-',
    bodyText: 'Di materi tata bahasa tingkat B1 ini, kita mengkaji pola pasif murni Ethpeel.\n\nDengan menyematkan prefiks Ett- (ܐܸܬ݂), kata kerja aktif berubah menjadi dikenai perbuatan:\n- ܐܸܬ݂ܟ݁ܬ݂ܰܒ݂ (Ethkthab) = Telah dituliskan secara rapi di dalam lembaran takdir historis.',
    estimatedMinutes: 10
  },
  {
    id: 'mat_39',
    title: '[Level B1] Modul 39: Perbandingan Dialek Timur Madnkhaya vs Barat Serto',
    category: 'Sejarah & Budaya',
    type: 'video',
    contentUrl: 'https://www.youtube.com/embed/RImI6h2m618',
    description: 'Membandingkan secara visual ragam hiasan tulisan barat dan timur.',
    bodyText: 'Tonton video di atas secara khidmat. Perhatikan bagaimana guru melukiskan perbedaan garis lengkung Serto barat dengan sudut runcing tegap Madnkhaya timur.\n\nKedua dialek ini merupakan saudara kembar identik yang memperkaya peradaban sastra Semitik dunia.',
    estimatedMinutes: 14
  },
  {
    id: 'mat_40',
    title: '[Level B1] Modul 40: Meraba Naskah Peshitta Kejadian 1:1',
    category: 'Sejarah & Budaya',
    type: 'text',
    description: 'Bedah filologi teks penciptaan mula-mula dari naskah klasik Peshitta.',
    bodyText: 'Naskah teks agung:\n"ܒ݁ܪܺܫܺܝܬ݂ ܒ݁ܪܳܐ ܐܰܠܳܗܳܐ ܝܳܬ݂ ܫܡܰܝܳܐ ܘܝܳܬ݂ ܐܰܪܥܳܐ"\n(B-reshith bra Alaha yath shmayya w-yath ar\'a)\nArti: Pada mulanya Allah menciptakan langit dan bumi.\n\nKosa kata "B-reshith" (Di dalam permulaan) memiliki susunan huruf Beth, Resh, Alaph, Shin, Yodh, Taw yang penuh keindahan filosofis.',
    estimatedMinutes: 13
  },
  {
    id: 'mat_41',
    title: '[Level B1] Modul 41: Meraba Naskah Peshitta Kejadian 1:2',
    category: 'Sejarah & Budaya',
    type: 'text',
    description: 'Menganalisis kalimat puitis tentang hembusan angin kedamaian di atas samudra.',
    bodyText: 'Teks kelanjutan:\n"ܘܪܽܘܚܶܗ ܕ݁ܐܰܠܳܗܳܐ ܡܪܰܚܦ݂ܳܐ ܥܰܠ ܐܰܦ݁ܰܝ ܡܰܝܳܐ"\n(W-ruheh d-Alaha mrahpha al appay mayya)\nArti: Dan Roh Allah melayang-layang syahdu di atas permukaan air.\n\nKata "Ruha" (Napas/Roh) melambangkan kelembutan tiupan takdir ilahi yang membawa kedamaian dan kepuasan batin.',
    estimatedMinutes: 11
  },
  {
    id: 'mat_42',
    title: '[Level B1] Modul 42: Pujian Puitis Karya Santo Efrem dari Surish',
    category: 'Percakapan',
    type: 'text',
    description: 'Membaca ritme madrasah puitis dengan ketukan rima seimbang nan menenangkan.',
    bodyText: 'Sastra klasik Suryani terkenal dengan keindahan nyanyian bait (Mimra) karya Santo Efrem. \n\nMimra menggunakan pola meteran rima 7 suku kata yang konsisten, terdengar merdu saat dilantunkan perlahan di malam yang sunyi.',
    estimatedMinutes: 12
  },
  {
    id: 'mat_43',
    title: '[Level B1] Modul 43: Idiom Khas Pembawa Suka Cita di Timur Dekat',
    category: 'Percakapan',
    type: 'text',
    description: 'Mempelajari kalimat metafora kebahagiaan hidup sehari-hari.',
    bodyText: 'Ungkapan indah yang kerap diucapkan:\n- ܬ݁ܰܘܕ݁ܺܝܬ݂ܳܐ ܣܰܓ݁ܺܝܳܐܐ (Tawdirtha saggi\'atha) = Terima kasih yang sangat melimpah ruah.\n- ܦ݁ܽܘܫ ܒ݁ܰܫܠܳܡܳܐ (Push ba-shlama) = Tinggallah dalam kedamaian sejahtera.',
    estimatedMinutes: 8
  },
  {
    id: 'mat_44',
    title: '[Level B1] Modul 44: Gaya Bahasa Retorika Semit Menengah',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Penataan susunan kalimat kompleks bersyarat menggunakan partikel klitik.',
    bodyText: 'Di tingkat B1 ini, Anda belajar merakit kalimat yang memiliki anak kalimat bersyarat guna memperkaya esai penulisan Anda.\n\nPenggunaan konjungsi ܐܶܢ (En - Jika) dipadukan dengan kata kerja bentuk imperfek menghasilkan untaian makna tersirat yang mendalam.',
    estimatedMinutes: 10
  },
  {
    id: 'mat_45',
    title: '[Level B1] Modul 45: Asimilasi Linguistik Aram-syriac dengan Bahasa Arab',
    category: 'Sejarah & Budaya',
    type: 'text',
    description: 'Membedah ratusan kosa kata serapan yang mengakar kuat di rumpun Semitik.',
    bodyText: 'Sangat membahagiakan mengetahui betapa eratnya persaudaraan bahasa kita. Kata "Kitab" (ܟ݁ܬ݂ܳܒ݂ܳܐ), "Waktu" (ܥܸܕ݁ܳܢܳܐ), dan "Tuhan" (ܐܰܠܳܗܳܐ) berpijak pada fondasi fonetis yang sama, memancarkan jembatan harmoni antar kebudayaan.',
    estimatedMinutes: 12
  },
  {
    id: 'mat_46',
    title: '[Level B1] Modul 46: Menguak Arti Istilah Kuno Kitab Liturgis',
    category: 'Sejarah & Budaya',
    type: 'text',
    description: 'Membedah istilah fungsional seperti Qurbana, Raza, dan Shimta.',
    bodyText: 'Mempelajari fungsi sosial bahasa:\n- ܩܽܘܪܒ݁ܳܐ (Qurbana) = Persembahan syukur mendekatkan diri.\n- ܪܳܐܙܳܐ (Raza) = Rahasia luhur nan agung.\n\nKata-kata ini memiliki kedalaman teologis yang asri.',
    estimatedMinutes: 9
  },
  {
    id: 'mat_47',
    title: '[Level B1] Modul 47: Partikel Kondisional En & Kalimat Majemuk',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Merangkai struktur kalimat logika bersyarat sebab-akibat.',
    bodyText: 'Kaidah kalimat bersyarat:\n"ܐܸܢ ܬܸܪܚܲܡ ܠܝܼ، ܐܸܟ݂ܬ݁ܘܿܒ݂ ܠܵܟ݂"\n(En terham li, ekhtob lokh)\nArti: Jika engkau menghargaiku, aku akan menuliskan surat persahabatan kepadamu.',
    estimatedMinutes: 10
  },
  {
    id: 'mat_48',
    title: '[Level B1] Modul 48: Urutan Kata Verb-Subject-Object (VSO) Eksklusif',
    category: 'Tata Bahasa',
    type: 'text',
    description: 'Menganalisis penempatan kata kerja di awal kalimat sastrawi klasik.',
    bodyText: 'Merakit kalimat B1 formal selalu mendahulukan verba:\nܚܙܳܐ ܐܰܒ݂ܳܐ ܝܳܬ݂ ܒ݁ܪܳܐ (Hza Abba yath Bra)\nLiteral: Meliriklah sang Ayah akan anak lelakinya.\n\nPola VSO ini memberikan efek dramatisasi estetika klasik yang tinggi.',
    estimatedMinutes: 11
  },
  {
    id: 'mat_49',
    title: '[Level B1] Modul 49: Restorasi Fragmen Gulungan Naskah Berdebu',
    category: 'Sejarah & Budaya',
    type: 'text',
    description: 'Latihan simulasi rekonstruksi kalimat naskah kuno yang berlubang karena usia.',
    bodyText: 'Bayangkan Anda adalah seorang arkeolog bahasa. Di modul ini, kita melatih insting tata bahasa untuk menebak huruf yang hilang dari sebuah fragmen dengan menganalisis rima bait yang mendahuluinya.\n\nSensasi memecahkan teka-teki kuno ini memberikan kepuasan intelektual tingkat tinggi.',
    estimatedMinutes: 15
  },
  {
    id: 'mat_50',
    title: '[Level B1] Modul 50: Mahakarya Kelulusan Kurikulum Aramaik Suryani',
    category: 'Sejarah & Budaya',
    type: 'text',
    description: 'Proyek transliterasi mandiri tingkat akhir paragraf sastra klasik.',
    bodyText: 'Sahabat Pembelajar yang budiman,\n\nHormat kami setinggi-tingginya! Anda telah tiba di puncak perjuangan kurikulum: Modul 50. Dari seorang pemula yang asing dengan lengkungan aksara, kini Anda mampu membaca dan menafsirkan rahasia naskah Semitik kuno.\n\nKeberhasilan melintasi 50 tangga ini membuktikan tekad baja dan kecintaan Anda pada kesusastraan abadi dunia. Teruslah berkarya, taburkan benih perdamaian sejahtera (ܫܠܳܡܳܐ), dan semoga petualangan luhur ini terus menginspirasi hidup Anda selamanya!\n\nܦ݁ܽܘܫ ܒ݁ܰܫܠܳܡܳܐ (Push Bashlama) - Tinggallah selalu dalam damai sejahtera.',
    estimatedMinutes: 15
  }
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q_1',
    type: 'transliteration',
    question: 'Mana nama transliterasi yang tepat untuk karakter aksara berikut: ܐ ',
    options: ['Alaph', 'Beth', 'Gamal', 'Dalath'],
    correctOption: 'Alaph',
    aramaicHint: 'ܐ'
  },
  {
    id: 'q_2',
    type: 'multiple-choice',
    question: 'Aksara Aramaik Suryani ditulis dengan arah penulisan...',
    options: [
      'Kiri ke Kanan (LTR)',
      'Kanan ke Kiri (RTL)',
      'Atas ke Bawah (Vertical)',
      'Boustrophedon (Bolak-balik)'
    ],
    correctOption: 'Kanan ke Kiri (RTL)'
  },
  {
    id: 'q_3',
    type: 'match-char',
    question: 'Karakter mana yang melambangkan huruf "Beth" (bermakna Rumah)?',
    options: ['ܐ', 'ܒ', 'ܓ', 'ܕ'],
    correctOption: 'ܒ',
    aramaicHint: 'ܒ'
  },
  {
    id: 'q_4',
    type: 'multiple-choice',
    question: 'Berapakah nilai Abjad (Abjad Numerical Value) dari huruf Yodh (ܝ)?',
    options: ['1', '5', '10', '20'],
    correctOption: '10',
    aramaicHint: 'ܝ'
  },
  {
    id: 'q_5',
    type: 'transliteration',
    question: 'Mana nama transliterasi yang tepat untuk karakter aksara berikut: ܕ ',
    options: ['Alaph', 'Beth', 'Gamal', 'Dalath'],
    correctOption: 'Dalath',
    aramaicHint: 'ܕ'
  },
  {
    id: 'q_6',
    type: 'multiple-choice',
    question: 'Berapa jumlah abjad konsonan utama dalam sistem bahasa Aramaik Suryani?',
    options: ['18 Huruf', '22 Huruf', '24 Huruf', '28 Huruf'],
    correctOption: '22 Huruf'
  },
  {
    id: 'q_7',
    type: 'multiple-choice',
    question: 'Tanda diakritik vokal "Pthaha" melambangkan pelafalan bunyi...',
    options: ['Bunyi A pendek', 'Bunyi O panjang', 'Bunyi I jernih', 'Bunyi U bulat'],
    correctOption: 'Bunyi A pendek'
  },
  {
    id: 'q_8',
    type: 'transliteration',
    question: 'Ketik nama transliterasi huruf berikut yang berbentuk melengkung dengan titik di atasnya: ܪ ',
    options: ['Resh', 'Dalath', 'Zain', 'Taw'],
    correctOption: 'Resh',
    aramaicHint: 'ܪ'
  },
  {
    id: 'q_9',
    type: 'multiple-choice',
    question: 'Klausa doa "Abun dbashmayya" memiliki makna harfiah...',
    options: ['Tuhan pelindung kami', 'Bapa kami yang berada di surga', 'Berikanlah kami makanan harian', 'Tinggallah dalam damai sentosa'],
    correctOption: 'Bapa kami yang berada di surga'
  },
  {
    id: 'q_10',
    type: 'multiple-choice',
    question: 'Kata "Beytha" (ܒܰܝܬ݁ܳܐ) secara historis memiliki arti fisik...',
    options: ['Rumah bernaung', 'Tongkat gembala', 'Air laut menyegarkan', 'Pintu keluar gerbang'],
    correctOption: 'Rumah bernaung'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign_1',
    title: 'Latihan Penulisan Mandiri & Tracing Karakter Mulia',
    description: 'Gunakan panel canvas gambar di bawah atau lembar kerja fisik untuk melatih penulisan rangkaian kata "ܐܒܓ...". Tuliskan makna filosofis dari alfabet tersebut dalam lembar jawaban Anda.',
    dueDate: '25 Juni 2026',
    maxScore: 100,
    questionPrompt: 'Ketikkan analisis/makna dari urutan abjad tersebut atau unggah tautan coretan penulisan Anda.'
  },
  {
    id: 'assign_2',
    title: 'Transliterasi Kalimat Pendek Aramaik',
    description: 'Transliterasikan frasa berikut ke dalam huruf Latin standar: "ܒܝܬܐ ܕܐܠܗܐ" (Petunjuk: Beth-Yodh-Taw-Alaph = Beytha [Rumah], Dalath-Alaph-Lamadh-He-Alaph = D-Alaha [Allah]).',
    dueDate: '30 Juni 2026',
    maxScore: 100,
    questionPrompt: 'Sebutkan pembacaan fonetis dan arti gabungan kata frasa tersebut.'
  }
];
