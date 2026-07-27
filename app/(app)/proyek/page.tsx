"use client"

import { useState, useEffect, useRef } from "react"
import {
  Lightbulb,
  Database,
  PencilRuler,
  Hammer,
  Presentation,
  ImageIcon,
  Video,
  FileText,
  UploadCloud,
  Send,
  EyeOff,
} from "lucide-react"
import { PageHeading } from "@/components/page-heading"
import { useAuth } from "@/lib/auth-context"

const steps = [
  { title: "Identifikasi Masalah", desc: "Temukan permasalahan lingkungan sekitar.", icon: Lightbulb },
  { title: "Pengumpulan Data", desc: "Kumpulkan informasi dan data yang relevan.", icon: Database },
  { title: "Perancangan Solusi", desc: "Rancang solusi untuk masalah yang ditemukan.", icon: PencilRuler },
  { title: "Pembuatan Produk", desc: "Buat produk sesuai rancangan solusi.", icon: Hammer },
  { title: "Presentasi", desc: "Presentasikan hasil proyekmu.", icon: Presentation },
]

const products = [
  { title: "Poster Digital", desc: "Buat poster tentang upaya pelestarian mangrove.", icon: ImageIcon, accept: "image/*" },
  { title: "Video Edukasi", desc: "Buat video pendek edukasi mangrove.", icon: Video, accept: "video/mp4" },
  { title: "Makalah Sederhana", desc: "Tulis makalah tentang pemanfaatan mangrove.", icon: FileText, accept: ".pdf" },
]

const initialPosts = [
  { author: "Andi", time: "2 jam lalu", text: "Kelompok kami memilih membuat poster digital tentang abrasi pantai." },
  { author: "Bunga", time: "1 jam lalu", text: "Kami mengumpulkan data luas mangrove dari dinas lingkungan setempat." },
]

export default function ProyekPage() {
  const { user } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [posts, setPosts] = useState<{ author: string; time: string; text: string }[]>([])
  const [draft, setDraft] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("bio_forum_posts")
    if (stored) {
      try {
        setPosts(JSON.parse(stored))
        return
      } catch {
        /* ignore */
      }
    }
    setPosts(initialPosts)
  }, [])

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("bio_forum_posts", JSON.stringify(posts))
    }
  }, [posts])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    const newPosts = [
      ...posts,
      { author: user?.name ?? "Siswa", time: "baru saja", text: draft.trim() },
    ]
    setPosts(newPosts)
    setDraft("")
  }

  const isGuru = user?.role === "guru"

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Proyek PjBL: Konservasi Mangrove"
        description="Ikuti tahapan proyek berbasis masalah untuk merancang solusi konservasi mangrove."
      />

      {/* Stepper */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <ol className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {steps.map(({ title, desc, icon: Icon }, i) => (
            <li key={title} className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {i + 1}. {title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Products + Upload */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-base font-bold text-foreground">
            Pilih jenis produk yang akan kamu buat:
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {products.map(({ title, desc, icon: Icon }, i) => (
              <button
                key={title}
                type="button"
                onClick={() => setSelected(i)}
                className={`flex flex-col rounded-xl border p-4 text-left transition-colors ${
                  selected === i
                    ? "border-primary bg-accent"
                    : "border-border bg-muted/40 hover:border-primary/40"
                }`}
              >
                <Icon className="h-6 w-6 text-primary" />
                <span className="mt-3 text-sm font-bold text-foreground">
                  {title}
                </span>
                <span className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {desc}
                </span>
                <span className="mt-3 text-xs font-semibold text-primary">
                  Lihat Contoh
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Upload */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-base font-bold text-foreground">
            Upload Hasil Proyek
          </h2>
          {selected !== null ? (
            <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border bg-muted/40 px-4 py-8 text-center">
              <UploadCloud className="h-9 w-9 text-primary" />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Unggah {products[selected].title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Format: {products[selected].accept}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept={products[selected].accept}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-4 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Unggah
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-border bg-muted/40 px-4 py-8 text-center">
              <UploadCloud className="h-9 w-9 text-muted-foreground" />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Pilih jenis produk terlebih dahulu
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Forum */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 font-heading text-base font-bold text-foreground">
          Forum Diskusi
        </h2>
        <ul className="flex flex-col gap-3">
          {posts.map((p, i) => (
            <li key={i} className="rounded-lg bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
                  {p.author.charAt(0)}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {p.author}
                </span>
                <span className="text-xs text-muted-foreground">{p.time}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {p.text}
              </p>
            </li>
          ))}
        </ul>

        {isGuru ? (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            <EyeOff className="h-4 w-4 shrink-0" />
            Anda melihat forum dalam mode read-only. Hanya siswa yang dapat mengirim pesan.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 flex items-end gap-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              placeholder="Tulis tanggapan diskusi..."
              className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Send className="h-4 w-4" />
              Kirim
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
