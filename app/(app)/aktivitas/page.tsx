"use client"

import { useState, useEffect } from "react"
import { Blocks, Puzzle, MonitorPlay, Sprout, X, CheckCircle2, Waves } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { PageHeading } from "@/components/page-heading"

type ActivityKey = "puzzle" | "simulasi"

const PUZZLE_QUESTION =
  "Berdasarkan data grafik di atas, jelaskan analisis Anda mengenai dampak kerusakan mangrove terhadap perubahan iklim."

const PUZZLE_DISCUSSION =
  "Analisis yang benar: Berdasarkan grafik, terlihat penurunan luas mangrove secara signifikan. Hal ini berkontribusi pada peningkatan emisi karbon dan hilangnya habitat. Seharusnya siswa bisa menyebutkan data dari sumbu X dan Y grafik, lalu menghubungkan dengan isu perubahan iklim."

const SIMULASI_QUESTION =
  "Simulasikan dampak gelombang laut jika tidak ada hutan mangrove."

const SIMULASI_DISCUSSION =
  "Analisis yang benar: Tanpa hutan mangrove, gelombang laut langsung menghantam pantai sehingga menyebabkan abrasi, erosi, dan banjir rob yang lebih parah. Seharusnya siswa menyebutkan fungsi mangrove sebagai peredam gelombang dan pelindung garis pantai."

const configs: Record<ActivityKey, { title: string; question: string; discussion: string }> = {
  puzzle: {
    title: "Puzzle Ekosistem — Analisis Data Grafik",
    question: PUZZLE_QUESTION,
    discussion: PUZZLE_DISCUSSION,
  },
  simulasi: {
    title: "Simulasi",
    question: SIMULASI_QUESTION,
    discussion: SIMULASI_DISCUSSION,
  },
}

function MangroveChart() {
  const data = [
    { year: "2015", value: 100 },
    { year: "2017", value: 80 },
    { year: "2019", value: 55 },
    { year: "2021", value: 30 },
  ]

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="mb-3 text-center text-xs font-semibold text-muted-foreground">
        Luas Hutan Mangrove (indeks 2015 = 100)
      </p>
      <svg viewBox="0 0 360 200" className="mx-auto w-full max-w-md">
        {[0, 25, 50, 75, 100].map((v) => {
          const y = 170 - (v / 100) * 150
          return (
            <g key={v}>
              <line x1="30" y1={y} x2="330" y2={y} stroke="var(--color-border)" strokeWidth="1" />
              <text x="25" y={y + 4} textAnchor="end" fontSize="10" fill="var(--color-muted-foreground)">
                {v}
              </text>
            </g>
          )
        })}
        {data.map((d, i) => {
          const barH = (d.value / 100) * 150
          const x = 40 + i * 75
          const y = 170 - barH
          return (
            <g key={d.year}>
              <rect x={x} y={y} width="48" height={barH} rx="4" fill="var(--color-primary)" opacity="0.9" />
              <text x={x + 24} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-foreground)">
                {d.value}
              </text>
              <text x={x + 24} y="188" textAnchor="middle" fontSize="11" fill="var(--color-muted-foreground)">
                {d.year}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Sumber: data mock untuk simulasi analisis
      </p>
    </div>
  )
}

function SimulasiImage() {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-sky-300/60 to-sky-100/40">
      <Waves className="h-14 w-14 text-sky-600" />
      <p className="text-sm font-medium text-sky-800">
        Gambar: Gelombang laut tanpa hutan mangrove
      </p>
    </div>
  )
}

export default function AktivitasPage() {
  const { user } = useAuth()
  const uid = user?.uid ?? "guest"

  const [activeModal, setActiveModal] = useState<ActivityKey | null>(null)
  const [draft, setDraft] = useState("")
  const [showDiscussion, setShowDiscussion] = useState(false)
  const [dndNotice, setDndNotice] = useState(false)

  const [puzzle, setPuzzle] = useState<{ answer: string; done: boolean }>({ answer: "", done: false })
  const [simulasi, setSimulasi] = useState<{ answer: string; done: boolean }>({ answer: "", done: false })

  useEffect(() => {
    try {
      const p = localStorage.getItem(`aktivitas_puzzle_${uid}`)
      if (p) setPuzzle(JSON.parse(p))
      const s = localStorage.getItem(`aktivitas_simulasi_${uid}`)
      if (s) setSimulasi(JSON.parse(s))
    } catch {
      /* ignore */
    }
  }, [uid])

  const modalDone = activeModal === "puzzle" ? puzzle.done : simulasi.done

  function openModal(kind: ActivityKey) {
    const data = kind === "puzzle" ? puzzle : simulasi
    setDraft(data.answer)
    setShowDiscussion(data.done)
    setActiveModal(kind)
  }

  function closeModal() {
    setActiveModal(null)
  }

  function handleSubmit() {
    if (!activeModal || !draft.trim()) return
    const data = { answer: draft.trim(), done: true }
    localStorage.setItem(`aktivitas_${activeModal}_${uid}`, JSON.stringify(data))
    if (activeModal === "puzzle") setPuzzle(data)
    else setSimulasi(data)
    setShowDiscussion(true)
  }

  const cards = [
    {
      key: "dragdrop" as const,
      title: "Drag & Drop",
      desc: "Lengkapi pernyataan dengan cara drag & drop!",
      icon: Blocks,
      accent: "text-blue-600",
      bg: "bg-blue-50",
      btn: "bg-blue-600 hover:bg-blue-700",
    },
    {
      key: "puzzle" as const,
      title: "Puzzle Ekosistem",
      desc: "Analisis data grafik tentang perubahan luas mangrove!",
      icon: Puzzle,
      accent: "text-amber-600",
      bg: "bg-amber-50",
      btn: "bg-amber-500 hover:bg-amber-600",
    },
    {
      key: "simulasi" as const,
      title: "Simulasi",
      desc: "Simulasikan dampak jika tidak ada hutan mangrove!",
      icon: MonitorPlay,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
      btn: "bg-emerald-600 hover:bg-emerald-700",
    },
  ]

  return (
    <div>
      <PageHeading
        title="Aktivitas Interaktif"
        description="Pilih aktivitas yang ingin kamu kerjakan!"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          const isPuzzle = card.key === "puzzle"
          const isSimulasi = card.key === "simulasi"
          const done = isPuzzle ? puzzle.done : isSimulasi ? simulasi.done : false
          const btnLabel =
            card.key === "dragdrop"
              ? "Mulai"
              : done
                ? "Lihat Lagi"
                : isPuzzle
                  ? "Mulai"
                  : "Lihat"

          return (
            <div
              key={card.key}
              className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.bg} ${card.accent}`}
              >
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                {card.title}
              </h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                {card.desc}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (card.key === "dragdrop") setDndNotice((v) => !v)
                    else openModal(card.key as ActivityKey)
                  }}
                  className={`self-start rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${card.btn}`}
                >
                  {btnLabel}
                </button>
                {done && (
                  <span className="inline-flex items-center gap-1 self-start rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Selesai
                  </span>
                )}
                {card.key === "dragdrop" && dndNotice && (
                  <p className="text-xs font-medium text-muted-foreground">
                    Fitur dalam pengembangan.
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Tahukah Kamu? banner */}
      <div className="mt-8 flex items-start gap-4 rounded-xl bg-primary p-6 text-primary-foreground shadow-sm">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
          <Sprout className="h-6 w-6" />
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold">Tahukah Kamu?</h2>
          <p className="mt-1 text-sm leading-relaxed text-primary-foreground/90">
            Mangrove dapat menyerap karbon 4x lebih banyak dibandingkan hutan
            daratan.
          </p>
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                {configs[activeModal].title}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-6">
              {activeModal === "puzzle" ? <MangroveChart /> : <SimulasiImage />}

              <p className="text-sm font-medium leading-relaxed text-foreground">
                {configs[activeModal].question}
              </p>

              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={modalDone}
                rows={5}
                placeholder="Tulis analisismu di sini..."
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:opacity-70"
              />

              {showDiscussion && (
                <div className="rounded-lg border border-primary/30 bg-accent/40 p-4 text-sm leading-relaxed text-foreground">
                  <p className="mb-1 font-bold text-primary">Pembahasan</p>
                  <p>{configs[activeModal].discussion}</p>
                </div>
              )}

              {modalDone ? (
                <button
                  type="button"
                  onClick={() => setShowDiscussion((v) => !v)}
                  className="self-start rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {showDiscussion ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!draft.trim()}
                  onClick={handleSubmit}
                  className="self-start rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Kirim Analisis
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
