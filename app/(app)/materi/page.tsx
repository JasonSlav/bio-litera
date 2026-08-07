"use client"

import { useState, useRef, type CSSProperties } from "react"
import Image from "next/image"
import { Pencil, Images, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Lightbox } from "@/components/lightbox"

type ListType = "bullet" | "decimal" | "upperLetter" | "lowerLetter"

interface ListItem {
  label?: string
  text: string
  bold?: boolean
  detail?: string
}

interface ChapterList {
  type: ListType
  items: ListItem[]
  start?: number
}

type ChapterBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; list: ChapterList }

interface ChapterTable {
  headers: [string, string]
  rows: [string, string][]
}

interface Hotspot {
  id: number
  label: string
  jenis: "Biotik" | "Abiotik"
  x: number
  y: number
  w: number
  h: number
}

interface HotspotImageData {
  src: string
  hotspots: Hotspot[]
}

interface Chapter {
  title: string
  subtitle?: string
  desc: string
  images?: string[]
  hotspotImages?: HotspotImageData[]
  blocks: ChapterBlock[]
  table?: ChapterTable
}

const chapters: Chapter[] = [
  {
    title: "Ekosistem Mangrove",
    subtitle: "Ekosistem Mangrove: Benteng Pesisir yang Terancam",
    desc: "Pernahkah kamu membayangkan apa yang terjadi jika kota di tepi pantai tidak memiliki tembok pelindung, lalu gelombang ombak besar datang menghantam setiap hari?",
    images: ["/materi/bab1.jpg"],
    blocks: [
      { kind: "paragraph", text: "Lambat laun, tanah tempat kita berdiri akan habis tergerus air laut. Disinilah hutan mangrove bekerja sebagai “benteng bernyawa” yang menjaga daratan Indonesia." },
      { kind: "paragraph", text: "Salah satu keunggulan yang dimiliki oleh Indonesia adalah menjadi rumah bagi ekosistem mangrove terbesar di dunia. Kita memiliki sekitar 3.36 juta hektar hutan mangrove, atau menyumbang sekitar 20% hingga 25% dari seluruh total mangrove yang ada di bumi. Yang aman artinya, Indonesia merupakan pemegang peranan kunci dalam menjaga kesehatan pesisir dunia." },
      { kind: "paragraph", text: "Namun sayangnya, dari fakta di atas terdapat fakta lain yang menyedihkan. Dimana dalam 30 tahun terakhir, lebih dari 30% hutan mangrove di Indonesia telah rusak bahkan hilang. Kerusakan ini tidak terjadi begitu saja, melainkan terdapat campur tangan akibat ulah manusia, diantaranya adalah:" },
      {
        kind: "list",
        list: {
          type: "upperLetter",
          items: [
            { text: "Alih fungsi lahan (konversi lahan)", bold: true, detail: "Banyak area hutan mangrove dibabat habis menggunakan alat berat untuk diubah menjadi tambak udang atau ikan secara masif. Selain itu, banyak kawasan pesisir yang ditimbun untuk dijadikan perumahan mewah, kawasan pabrik, hingga pelabuhan kapal." },
            { text: "Pencemaran sampah plastik & limbah pabrik", bold: true, detail: "Sampah plastik dari daerah kota yang terbawa aliran sungai akhirnya bermuara di pantai dan tersangkut di antara akar-akar mangrove. Plastik ini menutupi akar napas tumbuhan sehingga mangrove tidak dapat memperoleh oksigen yang cukup, sehingga mangrove mengalami kurangnya pasokan oksigen dan mati. Begitupun dengan limbah pabrik yang dibuang sembarangan di sungai yang bermuara di lautan, limbah pabrik yang mengandung bahan kimia yang tidak ramah lingkungan dapat merusak ekosistem dan mengakibatkan tumbuhan mangrove mati" },
            { text: "Penebangan liar (illegal Logging)", bold: true, detail: "Pohon-pohon mangrove ditebang secara ilegal untuk diambil keuntungan dari bagian batang sebagai bahan pembuatan arang berkualitas tinggi atau bahan bangunan lokal." },
          ],
        },
      },
      { kind: "paragraph", text: "Dari beberapa penyebab di atas, dampak negatif yang dihasilkan dapat menghasilkan suatu hal serius, seperti:" },
      {
        kind: "list",
        list: {
          type: "upperLetter",
          items: [
            { text: "Abrasi pantai yang masif", bold: true, detail: "Tanpa cengkeraman akar mangrove, ombak laut akan dengan mudah mengikis garis pantai. Banyak daratan di pesisir yang kini sudah hilang dan tenggelam menjadi laut." },
            { text: "Hilangnya tempat tinggal satwa laut", bold: true, detail: "Hutan mangrove adalah tempat kehidupan bagi bayi ikan, kepiting, dan udang. Bisa dibayangkan, apabila tempat ini hancur, biota laut akan tidak punya tempat berlindung, sehingga populasi mereka akan menurun tajam." },
            { text: "Bencana banjir Rob", bold: true, detail: "Banjir rob (luapan air laut saat pasang) akan semakin sering muncul dan merendam pemukiman warga pesisir, karena tidak adanya lagi vegetasi yang menahan laju air laut." },
          ],
        },
      },
    ],
  },
  {
    title: "Komponen Biotik & Abiotik",
    subtitle: "Komponen penyusun ekosistem mangrove",
    desc: "Ekosistem adalah sebuah sistem dimana terjadi hubungan timbal balik (saling mempengaruhi dan membutuhkan) antara makhluk hidup dengan lingkungan tak hidup di sekitarnya.",
    images: ["/materi/bab2-foto1.jpg", "/materi/bab2-foto2.jpg"],
    hotspotImages: [
      {
        src: "/materi/bab2-foto1.jpg",
        hotspots: [
          { id: 1, label: "Tunas / Anakan Mangrove", jenis: "Biotik", x: 19, y: 42, w: 19, h: 22 },
          { id: 2, label: "Batang Utama Mangrove", jenis: "Biotik", x: 34, y: 0, w: 22, h: 70 },
          { id: 3, label: "Akar Napas (Pneumatophores)", jenis: "Biotik", x: 0, y: 0, w: 100, h: 60 },
          { id: 4, label: "Lumut / Alga Hijau", jenis: "Biotik", x: 50, y: 0, w: 15, h: 20 },
          { id: 5, label: "Ranting Mati / Serasah Kayu", jenis: "Biotik", x: 0, y: 64, w: 99, h: 15 },
          { id: 6, label: "Substrat Lumpur / Tanah", jenis: "Abiotik", x: 0, y: 50, w: 100, h: 50 },
          { id: 7, label: "Pecahan Sedimen / Pasir", jenis: "Abiotik", x: 35, y: 69, w: 25, h: 13 },
          { id: 8, label: "Sampah Plastik", jenis: "Abiotik", x: 67, y: 37, w: 10, h: 10 },
        ],
      },
      {
        src: "/materi/bab2-foto2.jpg",
        hotspots: [
          { id: 1, label: "Batang Mangrove Utama (Depan)", jenis: "Biotik", x: 0, y: 0, w: 60, h: 66 },
          { id: 2, label: "Batang Pohon Latar Belakang", jenis: "Biotik", x: 59, y: 0, w: 16, h: 45 },
          { id: 3, label: "Lumut Hijau", jenis: "Biotik", x: 32, y: 20, w: 26, h: 30 },
          { id: 4, label: "Akar Pohon Mangrove", jenis: "Biotik", x: 0, y: 58, w: 100, h: 40 },
          { id: 5, label: "Daun Gugur (Serasah) #1", jenis: "Biotik", x: 78, y: 42, w: 5, h: 8 },
          { id: 6, label: "Daun Gugur (Serasah) #2", jenis: "Biotik", x: 78, y: 83, w: 9, h: 10 },
          { id: 7, label: "Genangan Air Basah #1", jenis: "Abiotik", x: 27, y: 78, w: 18, h: 10 },
          { id: 8, label: "Genangan Air Basah #2", jenis: "Abiotik", x: 70, y: 38, w: 15, h: 8 },
          { id: 9, label: "Lumpur Halus", jenis: "Abiotik", x: 0, y: 20, w: 100, h: 80 },
          { id: 10, label: "Sedimen Pasir / Kerikil", jenis: "Abiotik", x: 64, y: 55, w: 10, h: 7 },
        ],
      },
    ],
    blocks: [
      {
        kind: "list",
        list: {
          type: "upperLetter",
          start: 1,
          items: [{ text: "Komponen Biotik (semua makhluk hidup)", bold: true }],
        },
      },
      { kind: "paragraph", text: "Komponen biotik di dalam hutan mangrove terbagi menjadi tiga tingkatan peran:" },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 1,
          items: [
            { text: "Produsen utama (pembuat makanan):", bold: true },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "bullet",
          items: [
            { text: "Pohon bakau (Rhizophora): Pohon yang paling sering kita lihat di garis terdepan pantai. Memiliki ciri khas akar tinggi yang menjulur bercabang-cabang." },
            { text: "Pohon api-api (Avicennia): Pohon yang sangat tahan terhadap air dengan kadar garam tinggi. Memiliki akar napas berbentuk pensil yang keluar dari tanah." },
            { text: "Pohon bogem (Sonneratia): Pohon yang tumbuh di area lumpur dalam dan memiliki buah berbentuk bulat tebal yang rasanya asam segar." },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 2,
          items: [
            { text: "Konsumen (hewan pemakan):", bold: true },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "bullet",
          items: [
            { text: "Konsumen penghuni udara & pohon: monyet ekor panjang (Macaca fascicularis), burung elang laut, burung kowan malam, ular hijau, dan berbagai jenis serangga penyerbuk." },
            { text: "Konsumen penghuni lumpur & perairan: kepiting bakau (Scylla serrata), ikan glodok, udang rebon, kerang tiram, dan berbagai jenis anak ikan laut." },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 3,
          items: [
            { text: "Pengurai atau dekomposer (pembersih alami):", bold: true },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "bullet",
          items: [
            { text: "Bakteri tanah, jamur, serta cacing laut. Mereka bertugas menguraikan daun-daun mangrove yang gugur ke lumpur. Daun gugur ini diubah menjadi serasah (makanan kaya nutrisi dan protein) yang menjadi makanan utama bagi kepiting dan udang kecil." },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "upperLetter",
          start: 2,
          items: [{ text: "Komponen Abiotik (lingkungan tak hidup)", bold: true }],
        },
      },
      { kind: "paragraph", text: "Makhluk hidup di atas tidak akan bisa bertahan hidup tanpa didukung oleh komponen abiotik berikut:" },
      {
        kind: "list",
        list: {
          type: "bullet",
          items: [
            { label: "Air payau: ", text: "Air di kawasan mangrove bukan air tawar murni dan bukan air laut murni, melainkan air payau yang merupakan campuran dari kedua jenis air tersebut. Kadar garam salinitas selalu berubah-ubah, tergantung dengan pasang surut air laut dan aliran sungai." },
            { label: "Tanah lumpur anoksik: ", text: "Tanah di hutan mangrove berupa lumpur halus bertekstur lengket. Lumpur ini kaya akan bahan organik, tetapi anoksik yang artinya sangat miskin oksigen di bagian dalam tanahnya." },
            { label: "Sinar matahari & suhu: ", text: "Sinar matahari menjadi sumber energi primer untuk proses fotosintesis tumbuhan mangrove. Suhu ideal air di kawasan ini berkisar antara 28°C hingga 32°C." },
            { label: "Pasang surut air laut:", text: " Gelombang pasang surut yang terjadi dua kali sehari menentukan ketersediaan air, oksigen, dan distribusi nutrisi di seluruh kawasan hutan." },
          ],
        },
      },
    ],
  },
  {
    title: "Adaptasi Tumbuhan Mangrove",
    subtitle: "Rahasia kemampuan adaptasi mangrove",
    desc: "Lingkungan pesisir adalah lingkungan yang sangat ekstrem, dimana komposisi lingkungannya terdiri dari tanahnya yang berlumpur lembek, kadar oksigen di dalam tanah sangat rendah, dan airnya terasa asin.",
    images: ["/materi/bab3-foto1.jpg", "/materi/bab3-foto2.jpg"],
    blocks: [
      { kind: "paragraph", text: "Maka dari faktor tersebut, tumbuhan biasa yang hidup di daratan pasti akan langsung mati jika ditanam di daerah dengan kondisi tanah tersebut. Namun, tumbuhan mangrove berhasil bertahan hidup, karena tumbuhan mangrove memiliki tiga bentuk adaptasi yang tidak dimiliki tumbuhan lain, di antaranya adalah:" },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 1,
          items: [{ text: "Adaptasi Bentuk Akar (Napas dan cengkeraman)", bold: true }],
        },
      },
      {
        kind: "list",
        list: {
          type: "lowerLetter",
          items: [
            { text: "Akar tunjang (Stilt Roots)", bold: true, detail: "Tumbuhan ini memiliki bentuk akar yang mencuat keluar dari batang bagian bawah dan menghujam ke dalam lumpur seperti bentuk ceker ayam atau pondasi cakar ayam bangunan. Dengan bentuk akar yang seperti ini memiliki fungsi untuk menopang pohon agar berdiri kokoh di atas tanah lumpur yang sangat lembek, sekaligus menahan guncangan yang keras. Contohnya terdapat pada tumbuhan mangrove jenis Rhizophora atau juga dikenal dengan sebutan pohon bakau." },
            { text: "Akar napas (Pneumatofor)", bold: true, detail: "Bentuk akar pada tumbuhan ini adalah tegak lurus mengarah ke atas dan keluar dari lumpur yang menyerupai seperti sebuah pensil atau pasak kayu. Bentuk akar tersebut berfungsi supaya saat di dalam lumpur tidak ada oksigen, akar tersebut akan muncul ke udara untuk menghirup oksigen langsung dari udara bebas saat air laut sedang surut, hal tersebut terjadi melalui pori-pori khusus pada mangrove yang bernama lentisel. Contoh dari ciri tersebut terdapat pada tumbuhan mangrove jenis Avicennia atau sering disebut Api-api dan juga terdapat pada jenis Sonneratia yang biasa disebut pohon bogem." },
            { text: "Akar lutut (Knee Roots)", bold: true, detail: "Pada ciri akar ini tumbuh di dalam tanah yang melengkung keluar ke atas permukaan tanah dan masuk kembali ke tanah, menyerupai bentuk lutut manusia. Akar dengan bentuk seperti ini berfungsi untuk membantu pertukaran gas oksigen sekaligus memperkuat tumpuan pohon. Akar seperti ini bisa dijumpai pada tanaman mangrove pada jenis Bruguiera atau disebut juga pohon tanjang." },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 2,
          items: [{ text: "Adaptasi Mengatur Kadar Garam (Salinitas)", bold: true }],
        },
      },
      {
        kind: "list",
        list: {
          type: "bullet",
          items: [
            { label: "Pengeluaran garam (Excretion): ", text: "Pohon seperti Avicennia menyerap air asin dari laut. Kelebihan garam yang ikut terserap kemudian dipompa keluar melalui pori-pori kelenjar garam khusus yang ada di bawah permukaan daun. Jika kamu melihat daun Avicennia, bagian bawahnya sering terdapat butiran kristal garam putih." },
            { label: "Penyaringan garam (Exclusion):", text: " Pohon seperti Rhizophora memiliki membran sel canggih di bagian akarnya. Membran ini bekerja sebagai saringan osmosis yang sanggup menolak garam hingga 99%, sehingga air yang masuk ke dalam pembuluh pohon sudah menjadi air bersih." },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 3,
          items: [{ text: "Adaptasi Perkembangan Unik", bold: true }],
        },
      },
      { kind: "paragraph", text: "Tumbuhan biasa dapat menyebarkan bijinya yang belum tumbuh. Namun, mangrove jenis tertentu seperti Rhizophora menggunakan teknik vivipar (melahirkan). Biji berkecambah dan tumbuh membentuk calon akar panjang yang disebut propagul saat masih menempel di pohon induknya. Ketika propagul sudah cukup berat dan matang, maka dia akan jatuh seperti anak panah yang menancap tegak lurus di dalam lumpur, sehingga bisa langsung tumbuh tanpa hanyut terbawa ombak." },
    ],
  },
  {
    title: "Keanekaragaman Hayati Mangrove",
    subtitle: "Keanekaragaman hayati",
    desc: "Hutan mangrove sering diibaratkan sebagai sebuah tempat tinggal alami bertingkat, dimana setiap tingkatan struktur pohon mangrove dimanfaatkan oleh berbagai jenis hewan yang berbeda untuk saling berbagi tempat tinggal.",
    images: ["/materi/bab4.jpg"],
    blocks: [
      {
        kind: "list",
        list: {
          type: "upperLetter",
          start: 1,
          items: [{ text: "Dahan dan daun sebagai lantai atas", bold: true }],
        },
      },
      { kind: "paragraph", text: "Bagian teratas hutan yang kaya akan sinar matahari ini menjadi rumah bagi hewan-hewan yang hidup di atas pohon dan hewan yang mempunyai kemampuan untuk terbang, yang terbagi menjadi:" },
      {
        kind: "list",
        list: {
          type: "bullet",
          items: [
            { text: "Mamalia pesisir: Monyet ekor panjang (Macaca fascicularis) yang sering turun untuk mencari kepiting, selain itu terdapat bekantan (Nasalis larvatus) berhidung panjang yang merupakan satwa endemik Kalimantan." },
            { text: "Burung migran & lokal: Burung cangak, burung kowak malam, dan elang laut dada putih. Beberapa contoh jenis burung yang disebutkan merupakan beberapa contoh burung migran yang menjadikan hutan mangrove sebagai tempat istirahat yang terbang saat melintasi dunia." },
            { text: "Reptil & serangga: Ular pohon hijau, kadal memanfaatkan hutan mangrove sebagai habitat dan tempat bersembunyi dari musuh. Selain itu, lebah madu memanfaatkan bunga mangrove sebagai sumber nektar." },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "upperLetter",
          start: 2,
          items: [{ text: "Batang dan sistem akar sebagai lantai tengah", bold: true }],
        },
      },
      { kind: "paragraph", text: "Zona yang selalu berganti kondisi dari basah ke kering akibat pasang surut air laut ini menjadi tempat menempelnya berbagai biota unik:" },
      {
        kind: "list",
        list: {
          type: "bullet",
          items: [
            { text: "Kerang-kerangan (Mollusca): kerang tiram (Crassostrea) dan teritip yang menempel sangat kuat di kulit batang dan akar tunjang agar tidak hanyut terbawa arus." },
            { text: "Kepiting paman (Fiddler Crab): kepiting jantan spesies Uca yang memiliki satu capit berukuran sangat besar berwarna jingga atau merah menyala. Mereka membuat lubang tempat tinggal di sekitar perakaran mangrove." },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "upperLetter",
          start: 3,
          items: [{ text: "Perairan dan dasar lumpur sebagai lantai bawah", bold: true }],
        },
      },
      { kind: "paragraph", text: "Kawasan paling dasar yang selalu terendam air payau atau berupa lumpur basah, dengan macam satwanya yaitu:" },
      {
        kind: "list",
        list: {
          type: "bullet",
          items: [
            { label: "Ikan glodok (Mudskipper): ", text: "ikan sangat unik yang sanggup bertahan hidup di luar air dalam waktu lama. Mereka memiliki kantong udara khusus dan menggunakan sirip dadanya yang kuat untuk berjalan, memanjat akar, dan melompat di atas lumpur." },
            { label: "Kepiting bakau (Scylla serrata): ", text: "kepiting bernilai ekonomi tinggi yang menggali lubang dalam di dasar lumpur sebagai tempat bersembunyi dari serangan predator." },
            { label: "Daerah asuhan biota laut (Nursery ground): ", text: "tempat berlindung aman bagi benih udang vaname, anak ikan kakap putih, dan anak ikan bandeng sebelum mereka cukup besar untuk berenang ke laut lepas." },
          ],
        },
      },
    ],
  },
  {
    title: "Manfaat Ekologi & Ekonomi",
    subtitle: "Manfaat luar biasa mangrove bagi alam dan manusia",
    desc: "Keberadaan hutan mangrove memberikan dampak positif yang luar biasa besar, baik dari sudut pandang menjaga kelestarian alam (ekologi) maupun dari sudut pandang pendapatan warga (ekonomi).",
    blocks: [
      {
        kind: "list",
        list: {
          type: "upperLetter",
          start: 1,
          items: [{ text: "Manfaat ekologi (Untuk keseimbangan alam)", bold: true }],
        },
      },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 1,
          items: [
            { label: "Penahan abrasi dan perlindungan tsunami: ", text: "rimbunnya jaring-jaring akar mangrove berfungsi sebagai struktur pemecah gelombang alami. Energi ombak laut yang besar akan diredam hingga 66% saat melewati hutan mangrove sepanjang 100m, sehingga garis pantai tidak tergerus abrasi dan daratan terlindung dari gelombang tsunami." },
            { label: "Penyaring air dan pencemaran (Biofilter): ", text: "air sungai yang mengalir menuju laut sering membawa endapan lumpur halus dan racun logam berat dan limbah industri. Akar mangrove menangkap endapan lumpur tersebut dan menyerap racunnya, sehingga air yang masuk ke perairan laut lepas tetap jernih dan tidak merusak ekosistem terumbu karang." },
            { label: "Sebagai habitat & nursery ground: ", text: "mangrove menjadi penolong alami, dimana akar-akarnya yang rapat menyediakan celah-celah sempit yang aman bagi ikan dan udang kecil dari buruan ikan-ikan atau biota laut pemangsa yang berukuran besar." },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "upperLetter",
          start: 2,
          items: [{ text: "Manfaat ekonomi (untuk Kesejahteraan manusia)", bold: true }],
        },
      },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 1,
          items: [
            { label: "Sumber hasil tangkapan nelayan: ", text: "lebih dari 70% spesies ikan laut dan udang komersial yang dijual di pasar tradisional menghabiskan masa kecilnya di hutan mangrove. Tanpa adanya mangrove, stok tangkapan ikan nelayan tradisional akan berkurang secara drastis." },
            { label: "Pengembangan ekowisata berkelanjutan: ", text: "hutan mangrove yang dikelola dengan baik dapat diubah menjadi destinasi wisata alam yang indah. Dengan melengkapi catatan edukasi serta panduan mengenai penanaman dan pelestarian tumbuhan mangrove, maka hutan mangrove ini akan menjadi sumber penghasilan ekonomi dengan menjadi tempat wisata edukasi pelestarian mangrove." },
          ],
        },
      },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 3,
          items: [{ text: "Produk olahan hasil hutan non-kayu:", bold: true }],
        },
      },
      {
        kind: "list",
        list: {
          type: "bullet",
          items: [
            { text: "Kuliner: buah dari pohon bogem (Sonneratia) dapat diolah menjadi sirup mangrove kaya vitamin C, dodol, selai, serta selonsong keripik." },
            { text: "Kerajinan batik: getah dari kulit pohon mangrove tertentu seperti pada jenis Rhizophora, Ceriops tagal, dan Xylocarpus dapat dimanfaatkan sebagai bahan pewarna alami kain batik yang ramah lingkungan dan bernilai jual tinggi." },
          ],
        },
      },
    ],
  },
  {
    title: "Ancaman Kerusakan Mangrove",
    subtitle: "Dampak kerusakan mangrove bagi ekologi & ekonomi",
    desc: "Jika kerusakan hutan mangrove terus dibiarkan tanpa adanya tindakan perbaikan, akan timbul rantai dampak negatif yang menghancurkan sektor lingkungan, sekaligus sektor perekonomian masyarakat pesisir.",
    images: ["/materi/bab6.jpg"],
    blocks: [
      { kind: "paragraph", text: "Kerusakan tersebut akan memberikan dampak yang cukup spesifik, seperti yang dijelaskan pada tabel perbandingan berikut:" },
    ],
    table: {
      headers: [
        "Dampak kerusakan sektor ekologi (alam)",
        "Dampak kerusakan sektor ekonomi (manusia)",
      ],
      rows: [
        [
          "Garis pantai tergerus masif (abrasi): hilangnya mangrove menyebabkan daratan tergerus ombak hingga puluhan meter setiap tahunnya, dan hal ini menyebabkan kerusakan struktur geologi daerah pesisir.",
          "Hilangnya mata pencaharian nelayan: hal ini disebabkan karena populasi ikan dan udang mengalami penurunan drastis, karena habitat alaminya hancur. Nelayan juga harus melaut lebih jauh dan mengeluarkan biaya bahan bakar perahu yang cukup mahal.",
        ],
        [
          "Kerusakan terumbu karang & padang lamun: dampak selanjutnya terjadi ketika lumpur dari sungai meluncur tanpa hambatan ke laut lepas dan menutupi permukaan terumbu karang, dimana hal tersebut dapat menyebabkan karang-karang yang ada mati lemas.",
          "Kerugian harta benda akibat banjir Rob: banjir air laut yang rutin merendam rumah, jalan raya, dan fasilitas umum menyebabkan kerusakan fisik bangunan yang memakan biaya perbaikan yang sangat tinggi. Banjir Rob sendiri terjadi karena luapan air laut saat pasang akibat perubahan fisik lingkungan pesisir.",
        ],
        [
          "Ancaman kepunahan satwa pesisir: dampak lainnya berujung pada hilangnya habitat bagi burung-burung migran, monyet ekor panjang, dan mamalia pesisir, yang mana semua satwa yang disebutkan merupakan satwa yang menghuni dan memanfaatkan hutan mangrove sebagai habitat. Jika habitat alami mereka rusak dan hilang, maka populasi spesies mereka akan menurun secara drastis.",
          "Pengeluaran anggaran negara yang besar: jika benteng alami seperti hutan mangrove hilang, pemerintah harus mengeluarkan dana yang cukup besar untuk membuat benteng buatan berupa tanggul laut beton yang bisa rusak kapan saja.",
        ],
      ],
    },
  },
  {
    title: "Konservasi Mangrove",
    subtitle: "Upaya penyelamatan dan konservasi mangrove",
    desc: "Konservasi adalah seluruh bentuk upaya perlindungan, pelestarian, dan pemanfaatan ekosistem secara bijaksana agar manfaatnya dapat terus dinikmati hingga generasi mendatang.",
    images: ["/materi/bab7-foto1.jpg", "/materi/bab7-foto2.jpg"],
    blocks: [
      { kind: "paragraph", text: "Selain itu, konservasi merupakan upaya dan pengelolaan sumber daya alam serta lingkungan secara baik agar keberadaannya tetap terjaga dan dapat dimanfaatkan secara berkelanjutan untuk masa kini hingga masa depan nanti. Untuk dapat mewujudkan hal tersebut, berikut adalah langkah-langkah nyata guna melestarikan mangrove pada konservasi:" },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 1,
          items: [{ text: "Rehabilitasi dan Reboisasi Pesisir", bold: true, detail: "Rehabilitasi adalah kegiatan menanam kembali bibit-bibit mangrove di kawasan hutan yang telah gundul atau di area bekas tambak yang sudah ditinggalkan. Prinsip penanaman dilakukan berdasarkan wilayah zonasi, dengan penanaman tidak boleh sembarangan, jenis Rhizophora harus ditanam di area yang terkena pasang surut langsung, lalu Avicennia di area yang berlumpur halus dan berpasir, serta jenis Bruguiera di area yang lebih dekat ke daratan air tawar." }],
        },
      },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 2,
          items: [{ text: "Penetapan Kawasan Hutan Lindung & Penegakan Hukum", bold: true, detail: "Dalam sebuah pelestarian berbasis konservasi, pemerintah menetapkan kawasan mangrove strategis sebagai suaka margasatwa atau tanaman nasional. Langkah ini disertai dengan aturan hukum yang tegas berupa sanksi pidana dan denda bagi siapa saja yang melakukan penebangan liar dan pembukaan lahan ilegal di kawasan hutan mangrove." }],
        },
      },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 3,
          items: [{ text: "Ekowisata Berbasis Masyarakat", bold: true, detail: "Untuk mengembangkan sebuah konservasi, mengubah pola pikir masyarakat pesisir dari menebang pohon menjadi menjaga hutan amat sangat diperlukan. Dengan mengelola kawasan mangrove sebagai tempat wisata edukasi, masyarakat mendapatkan keuntungan ekonomi dari adanya kunjungan wisatawan, serta mereka juga mendapatkan kepercayaan wisatawan untuk dapat melestarikan dan menjaga kelestarian hutan tersebut." }],
        },
      },
      {
        kind: "list",
        list: {
          type: "decimal",
          start: 4,
          items: [{ text: "Aksi Bersih Pantai", bold: true, detail: "Selain menekan pada hutan mangrove, melakukan gerakan bersih-bersih sampah di daerah hutan sampai pantai juga menjadi bentuk penjagaan dan pelestarian ekosistem hutan mangrove tersebut. Pembersihan ini dapat membebaskan pertumbuhan mangrove dalam proses pernapasannya dari sampah yang ada." }],
        },
      },
    ],
  },
  {
    title: "Mangrove dan Perubahan Iklim",
    subtitle: "Peran mangrove dalam melawan perubahan iklim",
    desc: "Saat ini, bumi kita sedang mengalami pemanasan global atau biasanya juga disebut Global Warming dan perubahan iklim yang memicu cuaca ekstrem, badai, dan peningkatan suhu udara.",
    images: ["/materi/bab8.jpg"],
    blocks: [
      { kind: "paragraph", text: "Penyebab utamanya adalah menumpuknya gas rumah kaca, terutama pada karbon dioksida (CO2), di atmosfer akibat asap kendaraan, pencemaran udara dari pabrik, dan pembakaran hutan. Dari permasalahan tersebut, mangrove merupakan salah satu penyelamat yang cukup besar dampaknya." },
      { kind: "heading", text: "Apa itu karbon biru (Blue Carbon)?" },
      { kind: "paragraph", text: "Tumbuhan di bumi menyerap gas CO2 dari udara dan mengubahnya menjadi oksigen dan batang kayu melalui proses fotosintesis. Karbon yang diserap dan disimpan oleh ekosistem perairan dan pesisir, seperti hutan mangrove, padang lamun, dan rawa asin yang biasa dikenal dengan istilah Blue Carbon (karbon biru)." },
      { kind: "heading", text: "Kenapa mangrove dikatakan memiliki dampak besar?" },
      { kind: "paragraph", text: "Untuk menjawab pertanyaan tersebut, kalian bisa menyimak penjelasan berikut:" },
      {
        kind: "list",
        list: {
          type: "upperLetter",
          items: [
            { text: "Daya serap karbon yang sangat tinggi:", detail: "Hutan mangrove mampu menyerap dan menyimpan karbon dengan kapasitas 3 sampai 5 kali lebih banyak dibandingkan hutan hujan tropis biasa yang ada di daratan." },
            { text: "Kemampuan menyimpan karbon dalam jangka sangat panjang:", detail: "Pada hutan daratan biasa, karbon hanya bisa tersimpan di dalam batang dan kayu. Namun pada hutan mangrove, sebagian besar karbon yang diserap dipindahkan dan diendapkan jauh ke dalam tanah lumpur yang basa dan terendam air. Karena lumpur tersebut minim oksigen (anoksik), proses pembusukan berjalan sangat lambat, sehingga karbon tersebut terkunci secara aman di bawah tanah hingga ratusan bahkan ribuan tahun ke depan." },
          ],
        },
      },
    ],
  },
]

const GALLERY_INDEX = 8

type Category = "Flora" | "Fauna" | "Abiotik"
type Jenis = "Biotik" | "Abiotik"

const galleryFilters = ["Semua", "Flora", "Fauna", "Abiotik"] as const

const galleryImages: { src: string; title: string; category: Category; jenis: Jenis }[] = [
  { src: "/galeri/flora-1.png", title: "Pohon Bakau", category: "Flora", jenis: "Biotik" },
  { src: "/galeri/fauna-1.png", title: "Kepiting Bakau", category: "Fauna", jenis: "Biotik" },
  { src: "/galeri/flora-1.png", title: "Daun Mangrove", category: "Flora", jenis: "Biotik" },
  { src: "/galeri/fauna-2.png", title: "Burung Kuntul", category: "Fauna", jenis: "Biotik" },
  { src: "/galeri/ekosistem-1.png", title: "Air Laut", category: "Abiotik", jenis: "Abiotik" },
  { src: "/galeri/ekosistem-2.png", title: "Lumpur Pesisir", category: "Abiotik", jenis: "Abiotik" },
  { src: "/galeri/kegiatan-1.png", title: "Batu Karang", category: "Abiotik", jenis: "Abiotik" },
  { src: "/placeholder.svg", title: "Sinar Matahari", category: "Abiotik", jenis: "Abiotik" },
]

const listStyle: Record<ListType, CSSProperties> = {
  bullet: { listStyleType: "disc" },
  decimal: { listStyleType: "decimal" },
  upperLetter: { listStyleType: "upper-alpha" },
  lowerLetter: { listStyleType: "lower-alpha" },
}

function ListRenderer({ list }: { list: ChapterList }) {
  const isOrdered = list.type !== "bullet"
  const Tag = isOrdered ? "ol" : "ul"
  return (
    <Tag
      style={listStyle[list.type]}
      {...(isOrdered && list.start ? { start: list.start } : {})}
      className="mt-2 flex flex-col gap-1.5 pl-6"
    >
      {list.items.map((item, i) => (
        <li key={i} className="text-sm leading-relaxed text-muted-foreground">
          {item.label && <span className="font-semibold text-foreground">{item.label}</span>}
          <span className={item.bold ? "font-semibold text-foreground" : undefined}>{item.text}</span>
          {item.detail && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
          )}
        </li>
      ))}
    </Tag>
  )
}

function HotspotImage({ data }: { data: HotspotImageData }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  const hit = (clientX: number, clientY: number): number | null => {
    const el = wrapRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const px = ((clientX - rect.left) / rect.width) * 100
    const py = ((clientY - rect.top) / rect.height) * 100
    let best: number | null = null
    let bestArea = Infinity
    for (const h of data.hotspots) {
      if (px >= h.x && px <= h.x + h.w && py >= h.y && py <= h.y + h.h) {
        const area = h.w * h.h
        if (area < bestArea) {
          bestArea = area
          best = h.id
        }
      }
    }
    return best
  }

  const selectedHotspot = data.hotspots.find((h) => h.id === selected) ?? null

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={wrapRef}
        className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border"
        onClick={(e) => {
          const id = hit(e.clientX, e.clientY)
          setSelected((cur) => (cur === id ? null : id))
        }}
        onMouseMove={(e) => {
          setHover(hit(e.clientX, e.clientY))
        }}
        onMouseLeave={() => setHover(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.src} alt="Ekosistem mangrove biotik dan abiotik" className="h-full w-full object-cover" />

        {/* Interaksi */}
        {data.hotspots.map((h) => {
          const isSel = selected === h.id
          const isHover = hover === h.id
          const visible = showAll || isSel || isHover
          return (
            <div
              key={h.id}
              className={cn(
                "absolute rounded-md border-2 transition-all",
                h.jenis === "Biotik"
                  ? "border-emerald-400"
                  : "border-amber-400",
                visible ? "bg-white/10" : "border-transparent",
                isSel && "ring-2 ring-offset-1 ring-offset-black/20",
              )}
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                width: `${h.w}%`,
                height: `${h.h}%`,
                ...(h.jenis === "Biotik"
                  ? { boxShadow: isSel ? "0 0 0 2px rgba(16,185,129,0.6)" : undefined }
                  : { boxShadow: isSel ? "0 0 0 2px rgba(245,158,11,0.6)" : undefined }),
              }}
            />
          )
        })}

        {/* Debug toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setShowAll((v) => !v)
          }}
          className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          {showAll ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showAll ? "Sembunyikan Area" : "Lihat Area"}
        </button>

        {/* Label terpilih */}
        {selectedHotspot && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow",
                selectedHotspot.jenis === "Biotik"
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-500 text-white",
              )}
            >
              {selectedHotspot.label} ({selectedHotspot.jenis})
            </span>
          </div>
        )}
      </div>

      {/* Caption list */}
      <div className="flex flex-wrap gap-1.5">
        {data.hotspots.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setSelected((cur) => (cur === h.id ? null : h.id))}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
              selected === h.id
                ? h.jenis === "Biotik"
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-500 text-white"
                : h.jenis === "Biotik"
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100",
            )}
          >
            {h.label} ({h.jenis})
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MateriPage() {
  const { user } = useAuth()
  const [active, setActive] = useState(0)
  const [galeriFilter, setGaleriFilter] = useState<string>("Semua")
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; jenis?: "Biotik" | "Abiotik" } | null>(null)

  const isGaleri = active === GALLERY_INDEX
  const current = chapters[active]

  const filteredImages =
    galeriFilter === "Semua"
      ? galleryImages
      : galleryImages.filter((img) => img.category === galeriFilter)

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-20 lg:self-start">
          <h2 className="mb-3 font-heading text-sm font-bold text-foreground">
            Materi &amp; Galeri
          </h2>
          <nav className="flex flex-col gap-1">
            {chapters.map((c, i) => (
              <button
                key={c.title}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "flex items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                  i === active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="font-semibold">{i + 1}.</span>
                <span>{c.title}</span>
              </button>
            ))}
            <hr className="my-2 border-border" />
            <button
              type="button"
              onClick={() => setActive(GALLERY_INDEX)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                isGaleri
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Images className="h-4 w-4" />
              <span>Galeri Mangrove</span>
            </button>
          </nav>
        </aside>

        <section className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
          {user?.role === "guru" && (
            <button
              type="button"
              onClick={() => alert("Fitur edit akan datang")}
              className="absolute right-3 top-3 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}

          {isGaleri ? (
            <>
              <h1 className="mb-4 font-heading text-xl font-bold text-foreground">
                Galeri Mangrove
              </h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Kumpulan dokumentasi flora, fauna, ekosistem, dan kegiatan konservasi mangrove.
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {galleryFilters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setGaleriFilter(f)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                      galeriFilter === f
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {filteredImages.map((img, i) => (
                  <figure
                    key={`${img.src}-${i}`}
                    className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                    onClick={() => setLightbox({ src: img.src, alt: img.title, jenis: img.jenis })}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={img.src || "/placeholder.svg"}
                        alt={img.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 16vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="px-2 py-2">
                      <p className="truncate text-xs font-medium text-foreground">
                        {img.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {img.category}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="mb-1 font-heading text-xl font-bold text-foreground">
                {active + 1}. {current.title}
              </h1>
              {current.subtitle && (
                <p className="mb-3 text-sm font-medium text-primary">
                  {current.subtitle}
                </p>
              )}

              <p className="text-sm leading-relaxed text-muted-foreground">
                {current.desc}
              </p>

              {current.hotspotImages ? (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Klik pada gambar untuk melihat komponen biotik dan abiotik.
                  </p>
                  <div className="mt-3 grid gap-6 sm:grid-cols-2">
                    {current.hotspotImages.map((hdata) => (
                      <HotspotImage key={hdata.src} data={hdata} />
                    ))}
                  </div>
                </>
              ) : (
                current.images && current.images.length > 0 && (
                  <div
                    className={cn(
                      "mt-6 grid gap-4",
                      current.images.length > 1 ? "sm:grid-cols-2" : "grid-cols-1",
                    )}
                  >
                    {current.images.map((src) => (
                      <div
                        key={src}
                        className="relative aspect-video overflow-hidden rounded-xl border border-border"
                      >
                        <Image
                          src={src}
                          alt={`Gambar ${current.title}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )
              )}

              <div className="mt-6 border-t border-border pt-4">
                {current.blocks.map((block, bi) => {
                  if (block.kind === "heading") {
                    return (
                      <h3
                        key={bi}
                        className="mt-5 mb-1 font-heading text-base font-bold text-foreground"
                      >
                        {block.text}
                      </h3>
                    )
                  }
                  if (block.kind === "paragraph") {
                    return (
                      <p
                        key={bi}
                        className="mt-2 text-sm leading-relaxed text-muted-foreground"
                      >
                        {block.text}
                      </p>
                    )
                  }
                  return <ListRenderer key={bi} list={block.list} />
                })}

                {current.table && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr>
                          {current.table.headers.map((h, hi) => (
                            <th
                              key={hi}
                              className="border border-border bg-muted/40 px-4 py-3 text-left font-heading text-sm font-bold text-foreground"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {current.table.rows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className="border border-border px-4 py-3 align-top text-sm leading-relaxed text-muted-foreground"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          jenis={lightbox.jenis}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
}
