"use client"

import { useState, useEffect, useRef } from "react"
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Blocks,
  Puzzle,
  MonitorPlay,
  Sprout,
  X,
  CheckCircle2,
  Waves,
  Shuffle,
  Check,
  TreePine,
  Fish,
  Mountain,
  Globe,
  Leaf,
  Sun,
  CloudRain,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { PageHeading } from "@/components/page-heading"

type ActivityKey = "puzzle" | "dragdrop" | "simulasi"

const conceptPairs = [
  { id: 1, term: "Mangrove", definition: "Tumbuhan pantai yang hidup di daerah pasang surut", icon: TreePine },
  { id: 2, term: "Biotik", definition: "Komponen ekosistem yang berupa makhluk hidup", icon: Fish },
  { id: 3, term: "Abiotik", definition: "Komponen ekosistem yang berupa benda tak hidup", icon: Mountain },
  { id: 4, term: "Abrasi", definition: "Pengikisan pantai oleh gelombang laut", icon: Waves },
  { id: 5, term: "Ekosistem", definition: "Kesatuan makhluk hidup dan lingkungannya", icon: Globe },
  { id: 6, term: "Konservasi", definition: "Upaya pelestarian sumber daya alam", icon: Leaf },
  { id: 7, term: "Fotosintesis", definition: "Proses tumbuhan membuat makanan dari cahaya", icon: Sun },
  { id: 8, term: "Banjir Rob", definition: "Genangan air laut yang masuk ke daratan", icon: CloudRain },
]

function shuffledIds(length: number): number[] {
  const base = Array.from({ length }, (_, i) => i + 1)
  let p = [...base]
  for (let i = p.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  return p
}

const SIMULASI_QUESTION =
  "Simulasikan dampak gelombang laut jika tidak ada hutan mangrove."

const SIMULASI_DISCUSSION =
  "Analisis yang benar: Tanpa hutan mangrove, gelombang laut langsung menghantam pantai sehingga menyebabkan abrasi, erosi, dan banjir rob yang lebih parah. Seharusnya siswa menyebutkan fungsi mangrove sebagai peredam gelombang dan pelindung garis pantai."

const PUZZLE_QUESTION =
  "Dari gambar di atas, buatlah analisis yang sesuai dengan grafik/diagram yang ada."

const PUZZLE_DISCUSSION =
  "Analisis yang benar: Grafik menunjukkan bahwa 50% mangrove dunia berada dalam kondisi aman, 30% terancam, dan 20% genting/kritis. Hal ini menunjukkan perlunya upaya konservasi yang lebih serius, terutama pada kawasan yang berada dalam status genting."

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

function pieceStyle(pieceId: number): React.CSSProperties {
  const srcRow = Math.floor(pieceId / GRID)
  const srcCol = pieceId % GRID
  return {
    backgroundImage: "url(/galeri/ekosistem-1.png)",
    backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
    backgroundPosition: `${(srcCol / (GRID - 1)) * 100}% ${(srcRow / (GRID - 1)) * 100}%`,
  }
}

function TrayPiece({ id }: { id: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `piece-${id}`,
  })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: "none" }}
      {...attributes}
      {...listeners}
      className={`relative aspect-square h-14 w-14 cursor-grab touch-none overflow-hidden rounded-md border-2 border-border transition-shadow ${
        isDragging ? "z-10 opacity-90 shadow-lg" : "hover:border-primary/50"
      }`}
    >
      <div className="absolute inset-0" style={pieceStyle(id)} />
      <span className="absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/50 text-[9px] font-semibold text-white">
        {id + 1}
      </span>
    </div>
  )
}

function Slot({ index, placedId }: { index: number; placedId: number | null }) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${index}` })
  return (
    <div
      ref={setNodeRef}
      className={`relative aspect-square overflow-hidden rounded-md border-2 border-dashed transition-colors ${
        placedId !== null
          ? "border-emerald-400"
          : isOver
            ? "border-primary bg-accent/50"
            : "border-border bg-muted/30"
      }`}
    >
      {placedId !== null && (
        <>
          <div className="absolute inset-0" style={pieceStyle(placedId)} />
          <span className="absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/90 text-[9px] font-semibold text-white">
            {placedId + 1}
          </span>
        </>
      )}
    </div>
  )
}

function AnalysisPanel({
  question,
  discussion,
  savedAnswer,
  onSubmit,
}: {
  question: string
  discussion: string
  savedAnswer?: string
  onSubmit?: (answer: string) => void
}) {
  const [draft, setDraft] = useState(savedAnswer ?? "")
  const [submitted, setSubmitted] = useState(Boolean(savedAnswer))
  const [showDiscussion, setShowDiscussion] = useState(Boolean(savedAnswer))

  function handleSubmit() {
    if (!draft.trim() || !onSubmit) return
    onSubmit(draft.trim())
    setSubmitted(true)
    setShowDiscussion(true)
  }

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="mb-3 text-sm font-medium leading-relaxed text-foreground">{question}</p>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        disabled={submitted}
        rows={5}
        placeholder="Tulis analisismu di sini..."
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:opacity-70"
      />

      {submitted && showDiscussion && (
        <div className="mt-3 rounded-lg border border-primary/30 bg-accent/40 p-4 text-sm leading-relaxed text-foreground">
          <p className="mb-1 font-bold text-primary">Pembahasan</p>
          <p>{discussion}</p>
        </div>
      )}

      {submitted ? (
        <button
          type="button"
          onClick={() => setShowDiscussion((v) => !v)}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {showDiscussion ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
        </button>
      ) : (
        <button
          type="button"
          disabled={!draft.trim()}
          onClick={handleSubmit}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Kirim Analisis
        </button>
      )}
    </div>
  )
}

function JigsawPuzzle({
  onSolved,
  onSubmitAnswer,
}: {
  onSolved: () => void
  onSubmitAnswer: (answer: string) => void
}) {
  const [placed, setPlaced] = useState<(number | null)[]>(Array(TOTAL).fill(null))
  const [tray, setTray] = useState<number[]>(shuffledPieces)
  const [solved, setSolved] = useState(false)
  const solvedNotified = useRef(false)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  )

  useEffect(() => {
    if (solved && !solvedNotified.current) {
      solvedNotified.current = true
      onSolved()
    }
  }, [solved, onSolved])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)
    if (!activeId.startsWith("piece-") || !overId.startsWith("slot-")) return
    const pieceId = Number(activeId.slice("piece-".length))
    const slotIndex = Number(overId.slice("slot-".length))
    if (pieceId !== slotIndex) return

    const nextPlaced = [...placed]
    nextPlaced[slotIndex] = pieceId
    setPlaced(nextPlaced)
    setTray((prev) => prev.filter((p) => p !== pieceId))
    if (nextPlaced.every((p) => p !== null)) setSolved(true)
  }

  function handleReshuffle() {
    setPlaced(Array(TOTAL).fill(null))
    setTray(shuffledPieces())
    setSolved(false)
    solvedNotified.current = false
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/galeri/ekosistem-1.png"
            alt="Referensi gambar utuh"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Referensi Gambar</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Seret potongan dari bawah ke slot yang benar agar sesuai gambar referensi.
          </p>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid aspect-square w-full max-w-sm grid-cols-3 gap-1.5 self-center">
          {placed.map((pid, i) => (
            <Slot key={i} index={i} placedId={pid} />
          ))}
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Potongan Tersedia</p>
          {tray.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Semua potongan sudah terpasang.
            </p>
          ) : (
            <SortableContext items={tray.map((t) => `piece-${t}`)} strategy={rectSortingStrategy}>
              <div className="flex flex-wrap gap-2">
                {tray.map((t) => (
                  <TrayPiece key={t} id={t} />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </DndContext>

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

      {solved && (
        <>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-400 bg-emerald-50 p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="h-6 w-6" />
            </span>
            <p className="font-heading text-xl font-bold text-emerald-700">Berhasil!</p>
            <p className="text-sm text-emerald-700/80">
              Semua potongan sudah berada di posisi yang benar.
            </p>
          </div>

          <AnalysisPanel
            question={PUZZLE_QUESTION}
            discussion={PUZZLE_DISCUSSION}
            onSubmit={onSubmitAnswer}
          />
        </>
      )}
    </div>
  )
}

function TermCard({ id, matched }: { id: number; matched: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `term-${id}` })
  const pair = conceptPairs.find((p) => p.id === id)!
  const Icon = pair.icon
  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
        matched
          ? "border-emerald-400 bg-emerald-50 text-emerald-800"
          : isOver
            ? "border-primary bg-accent/50"
            : "border-border bg-card text-foreground"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0 text-primary" />
      <span className="flex-1">{pair.term}</span>
      {matched && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
    </div>
  )
}

function DefCard({ id, locked }: { id: number; locked: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({ id: `def-${id}` })
  const pair = conceptPairs.find((p) => p.id === id)!
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: "none" }}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-shadow ${
        locked
          ? "cursor-default border-emerald-400 bg-emerald-50 text-emerald-800"
          : isDragging
            ? "z-10 cursor-grabbing border-primary bg-accent shadow-lg"
            : "cursor-grab border-border bg-card text-foreground hover:border-primary/50"
      }`}
    >
      <span className="flex-1">{pair.definition}</span>
      {locked && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
    </div>
  )
}

function ConceptMatching({ onSolved }: { onSolved: () => void }) {
  const [termOrder, setTermOrder] = useState<number[]>(() => shuffledIds(conceptPairs.length))
  const [defOrder, setDefOrder] = useState<number[]>(() => shuffledIds(conceptPairs.length))
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)
    if (!activeId.startsWith("def-") || !overId.startsWith("term-")) return
    const defId = Number(activeId.slice("def-".length))
    const termId = Number(overId.slice("term-".length))
    if (defId !== termId) return
    const next = new Set(matched)
    next.add(defId)
    setMatched(next)
    if (next.size === conceptPairs.length) onSolved()
  }

  function handleReshuffle() {
    setTermOrder(shuffledIds(conceptPairs.length))
    setDefOrder(shuffledIds(conceptPairs.length))
    setMatched(new Set())
  }

  const solved = matched.size === conceptPairs.length
  const remainingDefs = defOrder.filter((id) => !matched.has(id))

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Cocokkan setiap definisi di kolom kanan dengan istilah yang tepat di kolom kiri. Seret kartu definisi ke
        kartu istilah yang sesuai.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Istilah</p>
            <div className="flex flex-col gap-2">
              {termOrder.map((termId) => (
                <TermCard key={termId} id={termId} matched={matched.has(termId)} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Definisi</p>
            <div className="flex flex-col gap-2">
              {remainingDefs.map((defId) => (
                <DefCard key={defId} id={defId} locked={false} />
              ))}
              {remainingDefs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Semua definisi sudah dipasangkan.
                </p>
              )}
            </div>
          </div>
        </div>
      </DndContext>

      {solved ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-400 bg-emerald-50 p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-6 w-6" />
          </span>
          <p className="font-heading text-xl font-bold text-emerald-700">Berhasil!</p>
          <p className="text-sm text-emerald-700/80">
            Semua pasangan istilah dan definisi sudah cocok.
          </p>
        </div>
      ) : (
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

function MatchingReview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-emerald-400 bg-emerald-50 p-4 text-emerald-700">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">
          Berhasil! Semua pasangan istilah dan definisi sudah cocok.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {conceptPairs.map((pair) => {
          const Icon = pair.icon
          return (
            <div
              key={pair.id}
              className="flex items-center gap-3 rounded-lg border border-emerald-400 bg-emerald-50 px-4 py-3 text-sm"
            >
              <Icon className="h-5 w-5 shrink-0 text-emerald-600" />
              <span className="font-semibold text-emerald-800">{pair.term}</span>
              <span className="text-emerald-400">↔</span>
              <span className="flex-1 text-emerald-700/90">{pair.definition}</span>
            </div>
          )
        })}
      </div>
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
  const [puzzleReview, setPuzzleReview] = useState(false)
  const [matchingReview, setMatchingReview] = useState(false)
  const [draft, setDraft] = useState("")
  const [showDiscussion, setShowDiscussion] = useState(false)

  const [puzzleDone, setPuzzleDone] = useState(false)
  const [puzzleAnswer, setPuzzleAnswer] = useState("")
  const [matchingDone, setMatchingDone] = useState(false)
  const [simulasi, setSimulasi] = useState<{ answer: string; done: boolean }>({ answer: "", done: false })

  useEffect(() => {
    try {
      const p = localStorage.getItem(`aktivitas_puzzle_${uid}`)
      if (p) {
        const data = JSON.parse(p)
        setPuzzleDone(data.done === true)
        setPuzzleAnswer(data.answer ?? "")
      }
      const m = localStorage.getItem(`aktivitas_dragdrop_${uid}`)
      if (m) setMatchingDone(JSON.parse(m).done === true)
      const s = localStorage.getItem(`aktivitas_simulasi_${uid}`)
      if (s) setSimulasi(JSON.parse(s))
    } catch {
      /* ignore */
    }
  }, [uid])

  function openModal(kind: ActivityKey) {
    if (kind === "puzzle") {
      setPuzzleReview(puzzleDone)
    } else if (kind === "dragdrop") {
      setMatchingReview(matchingDone)
    } else if (kind === "simulasi") {
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

  function handlePuzzleSubmit(answer: string) {
    localStorage.setItem(`aktivitas_puzzle_${uid}`, JSON.stringify({ done: true, answer }))
    setPuzzleAnswer(answer)
  }

  function handleMatchingSolved() {
    localStorage.setItem(`aktivitas_dragdrop_${uid}`, JSON.stringify({ done: true }))
    setMatchingDone(true)
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
      desc: "Cocokkan istilah dengan definisi yang benar!",
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
          const isDragdrop = card.key === "dragdrop"
          const isSimulasi = card.key === "simulasi"
          const done = isPuzzle
            ? puzzleDone
            : isDragdrop
              ? matchingDone
              : simulasi.done
          const btnLabel = done
            ? "Lihat Lagi"
            : isPuzzle || isDragdrop
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
                  onClick={() => openModal(card.key as ActivityKey)}
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
                {activeModal === "puzzle"
                  ? "Puzzle Ekosistem"
                  : activeModal === "dragdrop"
                    ? "Drag & Drop"
                    : simulasiConfig.title}
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
                puzzleReview ? (
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
                    <AnalysisPanel
                      question={PUZZLE_QUESTION}
                      discussion={PUZZLE_DISCUSSION}
                      savedAnswer={puzzleAnswer}
                      onSubmit={handlePuzzleSubmit}
                    />
                  </div>
                ) : (
                  <JigsawPuzzle
                    onSolved={handlePuzzleSolved}
                    onSubmitAnswer={handlePuzzleSubmit}
                  />
                )
              ) : activeModal === "dragdrop" ? (
                matchingReview ? (
                  <MatchingReview />
                ) : (
                  <ConceptMatching onSolved={handleMatchingSolved} />
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
