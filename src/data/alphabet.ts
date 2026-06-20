import { Letter } from '../types';

export const ARAMAIC_ALPHABET: Letter[] = [
  {
    char: 'ܐ',
    name: 'Alaph',
    phoneme: '[ʔ] (Glottal stop atau vokal tenang)',
    transliteration: 'Alaph',
    englishEquivalent: 'A / \'',
    meaning: 'Sapi Jantan (Ox) — Lambang kekuatan dan kepemimpinan',
    numericalValue: 1,
    syriacCharCodes: 'U+0710',
    description: 'Huruf pertama dalam alfabet Aramaik. Berfungsi sebagai huruf mati hentian glotal atau pembawa vokal di awal kata.'
  },
  {
    char: 'ܒ',
    name: 'Beth',
    phoneme: '[b] (keras) atau [v] (lembut)',
    transliteration: 'Beth',
    englishEquivalent: 'B / V',
    meaning: 'Rumah (House) — Lambang keluarga, perlindungan, dan bait',
    numericalValue: 2,
    syriacCharCodes: 'U+0712',
    description: 'Memiliki dua pelafalan (keras seperti b, lembut seperti v) tergantung pada posisinya dalam struktur gramatikal.'
  },
  {
    char: 'ܓ',
    name: 'Gamal',
    phoneme: '[g] (keras) atau [ɣ] (lembut seperti "gh")',
    transliteration: 'Gamal',
    englishEquivalent: 'G / Gh',
    meaning: 'Unta (Camel) — Melambangkan perjalanan, kemakmuran, dan beban',
    numericalValue: 3,
    syriacCharCodes: 'U+0713',
    description: 'Dapat melambangkan unta atau leher unta. Secara historis berkaitan dengan perpindahan barang dagangan mendayagunakan gurun.'
  },
  {
    char: 'ܕ',
    name: 'Dalath',
    phoneme: '[d] (keras) atau [ð] (lembut seperti "th" pada "this")',
    transliteration: 'Dalath',
    englishEquivalent: 'D / Dh',
    meaning: 'Pintu (Door) — Lambang jalan masuk, keputusan, dan penciptaan',
    numericalValue: 4,
    syriacCharCodes: 'U+0715',
    description: 'Sering ditulis dengan titik di bawah huruf untuk membedakannya secara visual dari huruf Resh.'
  },
  {
    char: 'ܗ',
    name: 'He',
    phoneme: '[h] (lembut)',
    transliteration: 'He',
    englishEquivalent: 'H',
    meaning: 'Jendela atau Lubang Udara — Lambang nafas kehidupan atau wahyu',
    numericalValue: 5,
    syriacCharCodes: 'U+0717',
    description: 'Berfungsi sebagai konsonan letup celah suara tak bersuara, setara dengan huruf H dalam abjad Latin.'
  },
  {
    char: 'ܘ',
    name: 'Waw',
    phoneme: '[w] (kons) atau [u] / [o] (vokal)',
    transliteration: 'Waw',
    englishEquivalent: 'W / U / O',
    meaning: 'Paku / Kait (Hook/Peg) — Lambang pengikat dan jembatan penghubung',
    numericalValue: 6,
    syriacCharCodes: 'U+0718',
    description: 'Sangat sering digunakan sebagai kata penghubung "dan" berposisi di awal kata dalam tulisan aram/suryani.'
  },
  {
    char: 'ܙ',
    name: 'Zain',
    phoneme: '[z]',
    transliteration: 'Zain',
    englishEquivalent: 'Z',
    meaning: 'Senjata / Sabit (Weapon) — Lambang perjuangan, pelindung, makanan',
    numericalValue: 7,
    syriacCharCodes: 'U+0719',
    description: 'Konsonan desis rongga-gigi bersuara. Memiliki kemiripan lekukan dengan huruf Waw namun lebih bersudut tajam.'
  },
  {
    char: 'ܚ',
    name: 'Heth',
    phoneme: '[ħ] (geser hulu kerongkongan tak bersuara)',
    transliteration: 'Heth',
    englishEquivalent: 'Hh / Ch',
    meaning: 'Pagar (Fence) — Lambang perlindungan, pembatasan, dan kesucian',
    numericalValue: 8,
    syriacCharCodes: 'U+071A',
    description: 'Suara geser hulu kerongkongan tak bersuara, mirip suara napas berat atau suara "h" tebal.'
  },
  {
    char: 'ܛ',
    name: 'Teth',
    phoneme: '[tˤ] (konsonan t tebal / emfatis)',
    transliteration: 'Teth',
    englishEquivalent: 'T / Tz',
    meaning: 'Tanah Liat / Keranjang — Melambangkan penyimpanan, wadah purbakala',
    numericalValue: 9,
    syriacCharCodes: 'U+071B',
    description: 'Suara T rongga gigi emfatis (pharyngealized voiceless alveolar plosive).'
  },
  {
    char: 'ܝ',
    name: 'Yodh',
    phoneme: '[j] (kons) atau [i] / [e] (vokal)',
    transliteration: 'Yodh',
    englishEquivalent: 'Y / I / E',
    meaning: 'Tangan / Lengan (Hand) — Melambangkan perbuatan, daya cipta, kerja',
    numericalValue: 10,
    syriacCharCodes: 'U+071D',
    description: 'Huruf terkecil secara fisik dalam abjad Aramaik namun bernilai tinggi secara spiritual dan tata bahasa.'
  },
  {
    char: 'ܟ',
    name: 'Kaph',
    phoneme: '[k] (keras) atau [x] (lembut seperti "kh")',
    transliteration: 'Kaph',
    englishEquivalent: 'K / Kh',
    meaning: 'Telapak Tangan (Palm) — Lambang penampungan, keramahtamahan, wadah',
    numericalValue: 20,
    syriacCharCodes: 'U+071F',
    description: 'Memiliki wujud penulisan yang memanjang ke bawah saat berada di akhir kata dalam gaya kursif tertentu.'
  },
  {
    char: 'ܠ',
    name: 'Lamadh',
    phoneme: '[l] (lembut)',
    transliteration: 'Lamadh',
    englishEquivalent: 'L',
    meaning: 'Tongkat Gembala (Goad/Staff) — Lambang bimbingan, otoritas, belajar',
    numericalValue: 30,
    syriacCharCodes: 'U+0720',
    description: 'Melambangkan tongkat yang digunakan untuk mengarahkan hewan ternak, merepresentasikan pengajaran dan petunjuk.'
  },
  {
    char: 'ܡ',
    name: 'Mim',
    phoneme: '[m]',
    transliteration: 'Mim',
    englishEquivalent: 'M',
    meaning: 'Air (Water) — Melambangkan kehidupan, dinamika, misteri tak terbatas',
    numericalValue: 40,
    syriacCharCodes: 'U+0721',
    description: 'Mewakili air gurun yang sangat berharga. Memiliki variasi penulisan tersendiri di akhir kata.'
  },
  {
    char: 'ܢ',
    name: 'Nun',
    phoneme: '[n]',
    transliteration: 'Nun',
    englishEquivalent: 'N',
    meaning: 'Ikan / Ular Air (Fish) — Lambang keturunan, kontinuitas, aktifitas',
    numericalValue: 50,
    syriacCharCodes: 'U+0722',
    description: 'Melambangkan kelimpahan hidup di air sungai atau gurun pasir.'
  },
  {
    char: 'ܣ',
    name: 'Semkath',
    phoneme: '[s]',
    transliteration: 'Semkath',
    englishEquivalent: 'S',
    meaning: 'Penyangga / Tiang (Support) — Lambang sandaran, fondasi, kekuatan',
    numericalValue: 60,
    syriacCharCodes: 'U+0723',
    description: 'Huruf melingkar tertutup yang melambangkan tameng perlindungan atau sandaran penguat.'
  },
  {
    char: 'ܥ',
    name: '`E',
    phoneme: '[ʕ] (suara serak hulu kerongkongan bersuara)',
    transliteration: '`E',
    englishEquivalent: '` / O',
    meaning: 'Mata (Eye) — Lambang kesadaran, penglihatan batin, mata air gurun',
    numericalValue: 70,
    syriacCharCodes: 'U+0725',
    description: 'Bunyi desis hulu kerongkongan bersuara. Sangat khas dalam bahasa Semitik kuna.'
  },
  {
    char: 'ܦ',
    name: 'Pe',
    phoneme: '[p] (keras) atau [f] (lembut)',
    transliteration: 'Pe',
    englishEquivalent: 'P / F',
    meaning: 'Mulut (Mouth) — Lambang komunikasi, ucapan, napas kata-kata',
    numericalValue: 80,
    syriacCharCodes: 'U+0726',
    description: 'Konsonan dwibibir yang melambangkan pengungkapan suara, sabda, dan instruksi.'
  },
  {
    char: 'ܨ',
    name: 'Sadhe',
    phoneme: '[sˤ] (s emfatis / tebal)',
    transliteration: 'Sadhe',
    englishEquivalent: 'S / Ts',
    meaning: 'Kail Pancing / Berburu — Melambangkan keadilan, kebenaran mencari sasaran',
    numericalValue: 90,
    syriacCharCodes: 'U+0728',
    description: 'Konsonan desis rongga-gigi emfatis tak bersuara, dilafalkan dengan penekanan lidah di pangkal mulut.'
  },
  {
    char: 'ܩ',
    name: 'Qoph',
    phoneme: '[q] (suara k yang ditarik ke dalam pangkal tenggorokan)',
    transliteration: 'Qoph',
    englishEquivalent: 'Q',
    meaning: 'Lubang Jarum / Belakang Kepala — Melambangkan ketajaman, penyaringan',
    numericalValue: 100,
    syriacCharCodes: 'U+0729',
    description: 'Pelepasan letup tekak tak bersuara. Memisahkan hal penting dari yang tidak bernilai.'
  },
  {
    char: 'ܪ',
    name: 'Resh',
    phoneme: '[r] (bergetar)',
    transliteration: 'Resh',
    englishEquivalent: 'R',
    meaning: 'Kepala (Head) — Melambangkan pemikiran, permulaan, intelektualitas',
    numericalValue: 200,
    syriacCharCodes: 'U+072A',
    description: 'Ditulis mirip dengan Dalath, namun tanpa titik di bawahnya, dan pada beberapa ragam tulisan ditulis dengan lengkung atas lebih luwes.'
  },
  {
    char: 'ܫ',
    name: 'Shin',
    phoneme: '[ʃ] (seperti "sy" pada "syarat")',
    transliteration: 'Shin',
    englishEquivalent: 'Sh / S',
    meaning: 'Gigi (Tooth) — Lambang api pembakar, penghancur kebatilan, semangat',
    numericalValue: 300,
    syriacCharCodes: 'U+072B',
    description: 'Suara geser pascarongga-gigi tak bersuara. Melambangkan kekuatan membara.'
  },
  {
    char: 'ܬ',
    name: 'Taw',
    phoneme: '[t] (keras) atau [θ] (lembut seperti "th" pada "thin")',
    transliteration: 'Taw',
    englishEquivalent: 'T / Th',
    meaning: 'Tanda / Salib / Segel — Lambang kesimpulan, batas akhir, perjanjian',
    numericalValue: 400,
    syriacCharCodes: 'U+072C',
    description: 'Huruf terakhir dari abjad Aramaik. Melambangkan penyegelan atau tanda kepemilikan luhur.'
  }
];
