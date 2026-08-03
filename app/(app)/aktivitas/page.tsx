"use client"

import { useState, useEffect } from "react"
import { Blocks, Puzzle, MonitorPlay, Sprout, X, CheckCircle2, Waves, Shuffle, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { PageHeading } from "@/components/page-heading"

type ActivityKey = "puzzle" | "simulasi"

const SIMULASI_QUESTION =
  "Simulasikan dampak gelombang laut jika tidak ada hutan mangrove."

const SIMULASI_DISCUSSION =
  "Analisis yang benar: Tanpa hutan mangrove, gelombang laut langsung menghantam pantai sehingga menyebabkan abrasi, erosi, dan banjir rob yang lebih parah. Seharusnya siswa menyebutkan fungsi mangrove sebagai peredam gelombang dan pelindung garis pantai."

const simulasiConfig = {
  title: "Simulasi",
  question: SIMULASI_QUESTION,
  discussion: SIMULASI_DISCUSSION,
}

const GRID = 3
const TOTAL = GRID * GRID

function shuffledPieces(): number[] {
  const base = Array.from({ length: TOTAL }, (_, i) => i)
  let p = [...base]
  do {
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[p[i], p[j]] = [p[j], p[i]]
    }
  } while (p.every((id, idx) => id === idx))
  return p
}

function JigsawPuzzle({ onSolved }: { onSolved: () => void }) {
  const [pieces, setPieces] = useState<number[]>(shuffledPieces)
  const [selected, setSelected] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)

  function handleClick(pos: number) {
    if (solved) return
    if (selected === null) {
      setSelected(pos)
    } else if (selected === pos) {
      setSelected(null)
    } else {
      const next = [...pieces]
      ;[next[selected], next[pos]] = [next[pos], next[selected]]
      setPieces(next)
      setSelected(null)
      if (next.every((id, i) => id === i)) {
        setSolved(true)
        onSolved()
      }
    }
  }

  function handleReshuffle() {
    setPieces(shuffledPieces())
    setSelected(null)
    setSolved(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Susun potongan gambar menjadi satu kesatuan. Klik dua potongan untuk bertukar posisi.
      </p>

      {solved ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-400 bg-emerald-50 p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-6 w-6" />
          </span>
          <p className="font-heading text-xl font-bold text-emerald-700">Berhasil!</p>
          <p className="text-sm text-emerald-700/80">
            Semua potongan sudah berada di posisi yang benar.
          </p>
        </div>
      ) : (
        <div className="grid aspect-square w-full max-w-sm grid-cols-3 gap-1.5 self-center">
          {pieces.map((id, pos) => {
            const srcRow = Math.floor(id / GRID)
            const srcCol = id % GRID
            return (
              <button
                key={pos}
                type="button"
                onClick={() => handleClick(pos)}
                className={`relative overflow-hidden rounded-md border-2 transition-all ${
                  selected === pos
                    ? "border-primary ring-2 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url(/galeri/ekosistem-1.png)",
                    backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                    backgroundPosition: `${(srcCol / (GRID - 1)) * 100}% ${(srcRow / (GRID - 1)) * 100}%`,
                  }}
                />
                <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[10px] font-semibold text-white">
                  {id + 1}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {!solved && (
        <button
          type="button"
          onClick={handleReshuffle}
          className="inline-flex items-center gap-2 self-center rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Shuffle className="h-4 w-4" />
          Acak Ulang
        </button>
      )}
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

  const [puzzleDone, setPuzzleDone] = useState(false)
  const [simulasi, setSimulasi] = useState<{ answer: string; done: boolean }>({ answer: "", done: false })

  useEffect(() => {
    try {
      const p = localStorage.getItem(`aktivitas_puzzle_${uid}`)
      if (p) setPuzzleDone(JSON.parse(p).done === true)
      const s = localStorage.getItem(`aktivitas_simulasi_${uid}`)
      if (s) setSimulasi(JSON.parse(s))
    } catch {
      /* ignore */
    }
  }, [uid])

  function openModal(kind: ActivityKey) {
    if (kind === "simulasi") {
      setDraft(simulasi.answer)
      setShowDiscussion(simulasi.done)
    }
    setActiveModal(kind)
  }

  function closeModal() {
    setActiveModal(null)
  }

  function handlePuzzleSolved() {
    localStorage.setItem(`aktivitas_puzzle_${uid}`, JSON.stringify({ done: true }))
    setPuzzleDone(true)
  }

  function handleSubmit() {
    if (!draft.trim()) return
    const data = { answer: draft.trim(), done: true }
    localStorage.setItem(`aktivitas_simulasi_${uid}`, JSON.stringify(data))
    setSimulasi(data)
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
      desc: "Susun potongan gambar ekosistem mangrove!",
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
          const done = isPuzzle ? puzzleDone : isSimulasi ? simulasi.done : false
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
                {activeModal === "puzzle" ? "Puzzle Ekosistem" : simulasiConfig.title}
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
              {activeModal === "puzzle" ? (
                puzzleDone ? (
                  <div className="flex flex-col gap-4">
                    <div className="relative aspect-square w-full max-w-sm self-center overflow-hidden rounded-xl border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/galeri/ekosistem-1.png"
                        alt="Gambar utuh ekosistem mangrove"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-400 bg-emerald-50 p-4 text-emerald-700">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <p className="text-sm font-medium">
                        Berhasil! Kamu telah menyelesaikan puzzle ekosistem mangrove.
                      </p>
                    </div>
                  </div>
                ) : (
                  <JigsawPuzzle onSolved={handlePuzzleSolved} />
                )
              ) : (
                <>
                  <SimulasiImage />

                  <p className="text-sm font-medium leading-relaxed text-foreground">
                    {simulasiConfig.question}
                  </p>

                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    disabled={simulasi.done}
                    rows={5}
                    placeholder="Tulis analisismu di sini..."
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:opacity-70"
                  />

                  {showDiscussion && (
                    <div className="rounded-lg border border-primary/30 bg-accent/40 p-4 text-sm leading-relaxed text-foreground">
                      <p className="mb-1 font-bold text-primary">Pembahasan</p>
                      <p>{simulasiConfig.discussion}</p>
                    </div>
                  )}

                  {simulasi.done ? (
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
