# Business Specification – Bio-Litera
**Versi:** 1.4 (Practical Implementation - Developer Simplified)
**Tanggal:** 2 Juli 2026

---

## 1. Ringkasan Proyek
Bio-Litera adalah website pembelajaran IPA berbasis web, bertema konservasi mangrove. Digunakan oleh guru dan siswa. Fokus pada materi interaktif, proyek PjBL, dan evaluasi (pre/post test).

---

## 2. Aktor & Akses
- **Guru:** Mengelola konten. Memiliki akun Google.
- **Siswa:** Mengakses materi, mengerjakan tes, dan mengumpulkan proyek. Memiliki akun Google.
- **Sistem (Developer):** Memasukkan konten statis (SDGs, teks materi) ke database.

---

## 3. Fitur Utama & Aturan Bisnis (Developer Focus)

### 3.1. Autentikasi & Manajemen Kelas
- Login dengan Google.
- Guru pilih role "Guru" saat pertama login → Sistem buat kode 6 digit.
- Siswa pilih role "Siswa" → Masukkan kode kelas.
- Setelah login, redirect ke halaman **Materi IPA**.

### 3.2. Menu Navigasi (Top Navbar)
Menggunakan top navbar dengan urutan menu:
1. Materi IPA
2. Aktivitas Interaktif
3. Proyek
4. SDGs
5. Literasi Sains (Tempat Pre-test, Post-test, & Grafik)
*(Catatan: Tentang Bio-Litera dihapus sesuai permintaan klien)*

### 3.3. Materi IPA
- 7 bab di sidebar kiri. Masing-masing berisi Judul, Video (embed YouTube/MP4 + placeholder), dan Deskripsi teks.
- **Galeri Mangrove** terintegrasi di bawah konten bab (grid gambar + filter Flora/Fauna/Ekosistem).
- **CRUD Materi:** Developer akan memasukkan konten awal via database (Firebase Console). Jika guru ingin edit, akan ada tombol "Mode Edit" di sudut navbar yang memunculkan form input. (Implementasi Mode Edit hanya jika klien meminta secara eksplisit, bukan sekarang).
- **Tombol Aksi:** Dihapus (tidak diperlukan di tahap awal).

### 3.4. Aktivitas Interaktif
- 4 kartu: Kuis, Drag & Drop, Puzzle, Simulasi (Label tombol: "Mulai" atau "Lihat").
- Tidak ada penilaian otomatis. Simpan status "Sudah/Belum" Mengerjakan (arsip saja).

### 3.5. Proyek (PjBL)
- 5 langkah proyek (stepper).
- Pilih 3 output (Poster/Video/Makalah) → Upload hasil dengan validasi format file (JPG/MP4/PDF).
- **Forum Diskusi (Text-only):** Siswa bisa posting teks. Guru read-only (tidak bisa posting). Tidak ada fitur edit/hapus/balas.
- **Penilaian Proyek:** Hanya status "Sudah/Belum Mengumpulkan", tidak ada nilai (sama dengan Aktivitas).

### 3.6. SDGs (5 Kartu)
- Developer akan memasukkan teks deskripsi dan ikon resmi SDG 4, 13, 14, 15, 17 langsung ke komponen/database berdasarkan data yang diberikan klien. (Tidak ada form edit untuk guru, cukup tampilan statis).

### 3.7. Literasi Sains & Evaluasi (Disatukan)
- Menu "Literasi Sains" menjadi pusat evaluasi. Berisi sidebar:
  1. Pre-test (Soal Pilihan Ganda, 1 soal/halaman, tombol Selanjutnya/Selesai).
  2. Post-test (Sama, 1 soal/halaman, setelah selesai redirect ke Refleksi).
  3. Hasil Belajar (Refleksi, Nilai Pre/Post, dan Grafik untuk Guru).
- **Refleksi:** Textarea "Apa yang kamu pelajari?" setelah post-test. Hanya bisa dilihat siswa sendiri.
- **N-Gain:** Sistem hitung otomatis `(post-pre)/(100-pre)` beserta kategori (Rendah/Sedang/Tinggi).
- **Grafik:** Hanya Guru yang melihat grafik Pre vs Post seluruh siswa. Siswa melihat nilai sendiri saja.
- **Portofolio:** Tampilkan status pengumpulan Proyek & Aktivitas (Sudah/Belum).

---

## 4. Prioritas Pengembangan (MoSCoW)
- **Must Have**: Auth Google, Kode Kelas, 7 Bab Materi, Galeri, 3 Output Proyek + Upload, Forum, Pre/Post Test, N-Gain, Grafik Guru, Refleksi.
- **Should Have**: Aktivitas Interaktif (4 kartu), SDGs (5 kartu), Portofolio.
- **Could Have**: Lightbox Galeri, Animasi Transisi.
- **Won't Have**: Pencarian, Bookmark, Unduh Materi, Login non-Google, Edit/Delete Forum Post.

---

## 5. User Journey (Sederhana)
- **Guru:** Login → Pilih Guru → Dapat Kode → Masuk Materi. (Menu "Kelola Konten" muncul di navbar jika klien meminta nanti). Lihat Grafik di halaman Literasi Sains.
- **Siswa:** Login → Pilih Siswa → Input Kode Kelas → Masuk Materi. Kerjakan Pre-test di Literasi Sains → Belajar → Kerjakan Post-test → Isi Refleksi → Lihat Nilai.