# Implementation Plan: Bio-Litera (P0 & P1 - Mock Data + localStorage)

## Arsitektur Baru
app/
├── layout.tsx                    ← BUNGKUS dengan AuthProvider
├── login/
│   └── page.tsx                  ← TULIS ULANG (mock auth + role selection)
├── (app)/                        ← PROTECTED ROUTES (require auth)
│   ├── layout.tsx                ← TULIS ULANG (auth guard + top navbar)
│   ├── page.tsx                  ← SEDERHANAKAN (redirect ke /materi)
│   ├── materi/
│   │   └── page.tsx              ← TULIS ULANG (integrasi galeri + lightbox + hapus tombol aksi)
│   ├── aktivitas/
│   │   └── page.tsx              ← EDIT (label "Lihat" untuk simulasi)
│   ├── proyek/
│   │   └── page.tsx              ← EDIT (5 step + forum conditional render)
│   ├── sdgs/
│   │   └── page.tsx              ← VERIFIKASI (warna resmi SDG - statis)
│   ├── literasi-sains/
│   │   └── page.tsx              ← TULIS ULANG (merge evaluasi: Pre/Post test + Hasil Belajar)
│   └── (hapus file-folder lama)
│       ├── evaluasi/             ← HAPUS
│       └── galeri/               ← HAPUS
│
components/
├── site-navbar.tsx               ← EDIT (ganti menu navigasi)
└── lightbox.tsx                  ← BARU (modal zoom gambar)

lib/
├── auth-context.tsx              ← BARU (mock auth + localStorage)
├── firebase.ts                   ← BARU (init Firebase app saja, tanpa Firestore)
└── utils.ts                      ← TETAP

---

## Fase 1: Foundation (Auth + Role)
| # | File | Tindakan |
|---|------|----------|
| 1 | `lib/firebase.ts` (BARU) | Init Firebase app — export `{ app }` saja, tanpa Firestore/Storage |
| 2 | `lib/auth-context.tsx` (BARU) | AuthContext + AuthProvider. User `{ uid, name, email, photo, role, classCode }`. Login mock → role picker → simpan ke localStorage. Fungsi: `login()`, `setRole()`, `logout()`. |
| 3 | `app/layout.tsx` | Bungkus children dengan `<AuthProvider>` |
| 4 | `app/login/page.tsx` (TULIS ULANG) | Panel kiri brand, panel kanan: Step 1 tombol "Masuk dengan Google" (mock → muncul role picker), Step 2 pilih Guru/Siswa. Hapus "Lanjutkan sebagai Tamu" |
| 5 | `app/(app)/layout.tsx` | Guard: `if (!user) redirect('/login')`. Update untuk render navbar baru. |

## Fase 2: Navbar & Navigasi
| # | File | Tindakan |
|---|------|----------|
| 6 | `components/site-navbar.tsx` (EDIT) | Item baru: Materi IPA, Aktivitas Interaktif, Proyek, SDGs, Literasi Sains. Hapus Beranda, Literasi Sains (yg lama — sudah diganti). Avatar dropdown: nama + role + logout. Ganti hardcoded "Hai, Siswa!" dengan data dari AuthContext. |
| 7 | `app/(app)/page.tsx` (SEDERHANAKAN) | `redirect('/materi')` dengan kondisional jika ada user. Beranda tidak dipakai. |

## Fase 3: Halaman Konten (Must Have)
| # | File | Tindakan |
|---|------|----------|
| 8 | `app/(app)/materi/page.tsx` (TULIS ULANG) | (a) Hapus 5 tombol aksi (tidak dipakai). (b) Integrasi galeri: grid gambar + filter tabs di bawah konten bab. (c) Lightbox: klik gambar → modal overlay. (d) Jika role Guru → tombol "Edit" di pojok kanan atas (UI only, alert). |
| 9 | `components/lightbox.tsx` (BARU) | Modal fullscreen: gambar besar, tombol close (X), klik overlay tutup. |
| 10 | `app/(app)/aktivitas/page.tsx` (EDIT) | Simulasi button label: tetap "Mulai" untuk 3 kartu, "Lihat" untuk Simulasi (sesuai spec). |
| 11 | `app/(app)/proyek/page.tsx` (EDIT) | (a) Forum: jika role === 'guru' → sembunyikan textarea + Kirim, hanya tampilkan post. Jika siswa → form muncul. Post baru simpan ke localStorage. (b) Upload: validasi accept attribute sesuai produk terpilih (image/*, video/mp4, .pdf). |
| 12 | `app/(app)/sdgs/page.tsx` (VERIFIKASI) | Statis, tidak ada perubahan. Cocok dengan spec. |

## Fase 4: Literasi Sains (Merged dengan Evaluasi)
| # | File | Tindakan |
|---|------|----------|
| 13 | `app/(app)/literasi-sains/page.tsx` (TULIS ULANG) | Layout baru: grid `[sidebar_kiri | konten_kanan]`. Sidebar menu: Pre-test, Post-test, Hasil Belajar. |
| 13a | — Pre-test | Quiz interface (1 soal/halaman dari soal yang ada). Tombol "Selanjutnya" → "Selesai" di soal terakhir. Setelah selesai → simpan nilai ke localStorage. |
| 13b | — Post-test | Sama seperti pre-test. Setelah selesai → redirect ke Hasil Belajar → scroll ke refleksi. |
| 13c | — Hasil Belajar | (i) Stat cards: Nilai Pre-test, Nilai Post-test, N-Gain (hitung otomatis dari localStorage). (ii) Refleksi: textarea "Apa yang kamu pelajari?" — simpan ke localStorage. (iii) Grafik: `if (role === 'guru')` → LineChart pre vs post (data dummy/aggregate). Jika siswa → teks "Grafik hanya untuk Guru". |
| 14 | `app/(app)/evaluasi/page.tsx` (HAPUS) | Tidak dipakai lagi — semua konten pindah ke /literasi-sains. |
| 15 | `app/(app)/galeri/page.tsx` (HAPUS) | Tidak dipakai lagi — galeri di /materi. |

---

## Dependency Graph Eksekusi

**Phase 1 (Foundation)**
├── lib/firebase.ts
├── lib/auth-context.tsx
├── app/layout.tsx (wrap AuthProvider)
├── app/login/page.tsx
└── app/(app)/layout.tsx (auth guard)
     │
     ▼
**Phase 2 (Navbar)**
├── components/site-navbar.tsx
└── app/(app)/page.tsx (redirect)
     │
     ▼
**Phase 3 (Content Pages)** — paralel
├── app/(app)/materi/page.tsx + components/lightbox.tsx
├── app/(app)/aktivitas/page.tsx
├── app/(app)/proyek/page.tsx
└── app/(app)/sdgs/page.tsx (verify only)
     │
     ▼
**Phase 4 (Literasi Sains — merge)**
├── app/(app)/literasi-sains/page.tsx (rewrite)
├── app/(app)/evaluasi/page.tsx (HAPUS)
└── app/(app)/galeri/page.tsx (HAPUS)