"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  ClipboardList,
  ClipboardCheck,
  Trophy,
  NotebookPen,
  FolderKanban,
  Gamepad2,
} from "lucide-react"
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { PageHeading } from "@/components/page-heading"

const questions = [
  {
    context:
      "Di suatu wilayah pesisir terjadi penebangan mangrove untuk alih fungsi lahan menjadi tambak.",
    question:
      "Apa dampak paling mungkin terjadi jika hutan mangrove dihilangkan?",
    options: [
      "Air laut menjadi lebih jernih",
      "Meningkatnya abrasi dan banjir rob",
      "Populasi ikan meningkat pesat",
      "Suhu udara menjadi lebih rendah",
    ],
  },
  {
    context:
      "Seorang peneliti membandingkan jumlah karbon yang tersimpan pada hutan mangrove dengan hutan daratan.",
    question:
      "Penyelidikan apa yang paling tepat untuk menguji kemampuan mangrove menyerap karbon?",
    options: [
      "Mengukur tinggi pohon setiap hari",
      "Menghitung jumlah pengunjung pantai",
      "Mengukur kandungan karbon pada tanah dan biomassa",
      "Mencatat warna daun mangrove",
    ],
  },
  {
    context:
      "Data menunjukkan luas mangrove menurun 20% dalam 10 tahun, sementara kasus banjir rob meningkat.",
    question:
      "Kesimpulan apa yang dapat ditafsirkan dari data tersebut?",
    options: [
      "Banjir rob tidak berkaitan dengan mangrove",
      "Penurunan mangrove berkaitan dengan meningkatnya banjir rob",
      "Mangrove menyebabkan banjir rob",
      "Banjir rob menambah luas mangrove",
    ],
  },
]

const correctAnswers = [1, 2, 1]

type Menu = "pretest" | "posttest" | "hasil-belajar"

const menuItems: { key: Menu; label: string; icon: typeof ClipboardList }[] = [
  { key: "pretest", label: "Pre-test", icon: ClipboardList },
  { key: "posttest", label: "Post-test", icon: ClipboardCheck },
  { key: "hasil-belajar", label: "Hasil Belajar", icon: Trophy },
]

const aktivitasLabels = ["Kuis Interaktif", "Drag & Drop", "Puzzle Ekosistem", "Simulasi"]

export default function LiterasiSainsPage() {
  const { user } = useAuth()
  const [menu, setMenu] = useState<Menu>("pretest")
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [preAnswers, setPreAnswers] = useState<Record<number, number>>({})
  const [postAnswers, setPostAnswers] = useState<Record<number, number>>({})
  const [pretestDone, setPretestDone] = useState(false)
  const [posttestDone, setPosttestDone] = useState(false)
  const [refleksi, setRefleksi] = useState("")

  const [proyekSelesai, setProyekSelesai] = useState(false)
  const [aktivitasSelesai, setAktivitasSelesai] = useState<boolean[]>([false, false, false, false])

  useEffect(() => {
    if (localStorage.getItem("bio_pretest_done")) setPretestDone(true)
    if (localStorage.getItem("bio_posttest_done")) setPosttestDone(true)
    setRefleksi(localStorage.getItem("bio_refleksi") ?? "")
    if (localStorage.getItem("bio_proyek_selesai")) setProyekSelesai(true)
    try {
      const a = JSON.parse(localStorage.getItem("bio_aktivitas_selesai") ?? "null")
      if (a) setAktivitasSelesai(a)
    } catch {}
  }, [])

  function calcScore(answers: Record<number, number>) {
    const keys = Object.keys(answers)
    if (keys.length === 0) return { score: 0, benar: 0, total: questions.length }
    const benar = keys.filter((k) => answers[Number(k)] === correctAnswers[Number(k)]).length
    return { score: Math.round((benar / questions.length) * 100), benar, total: questions.length }
  }

  const pre = calcScore(preAnswers)
  const post = calcScore(postAnswers)

  let nGain = 0
  let nGainKategori = "-"
  if (pretestDone && posttestDone) {
    nGain = (post.score - pre.score) / (100 - pre.score || 1)
    nGainKategori = nGain < 0.3 ? "Rendah" : nGain < 0.7 ? "Sedang" : "Tinggi"
  }

  const isLast = qIndex === questions.length - 1
  const q = questions[qIndex]

  function handleNext() {
    if (selected === null) return
    if (menu === "pretest") preAnswers[qIndex] = selected
    else postAnswers[qIndex] = selected

    if (!isLast) {
      setQIndex((i) => i + 1)
      setSelected(null)
      return
    }

    if (menu === "pretest") {
      localStorage.setItem("bio_pretest_done", "true")
      setPretestDone(true)
      setQIndex(0)
      setSelected(null)
      setMenu("posttest")
    } else {
      localStorage.setItem("bio_posttest_done", "true")
      setPosttestDone(true)
      setQIndex(0)
      setSelected(null)
      setMenu("hasil-belajar")
    }
  }

  function simpanRefleksi() {
    localStorage.setItem("bio_refleksi", refleksi)
  }

  const isGuru = user?.role === "guru"

  return (
    <div>
      <PageHeading
        title="Literasi Sains"
        description="Pre-test, Post-test, dan hasil evaluasi belajar."
      />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 font-heading text-sm font-bold text-foreground">
            Menu Evaluasi
          </h2>
          <nav className="flex flex-col gap-1">
            {menuItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMenu(key)
                  setQIndex(0)
                  setSelected(null)
                }}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  menu === key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex flex-col gap-6">
          {/* PRE-TEST */}
          {menu === "pretest" && (
            <>
              {pretestDone ? (
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm text-center">
                  <Trophy className="mx-auto h-10 w-10 text-primary" />
                  <h2 className="mt-3 font-heading text-lg font-bold text-foreground">
                    Pre-test sudah dikerjakan
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Nilai kamu: {pre.score}. Silakan lanjut ke Post-test.
                  </p>
                </section>
              ) : (
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold text-foreground">
                      Pre-test
                    </h2>
                    <span className="text-xs font-medium text-muted-foreground">
                      {qIndex + 1} / {questions.length}
                    </span>
                  </div>
                  <p className="mb-1 text-xs italic text-muted-foreground">
                    {q.context}
                  </p>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-foreground">
                    {q.question}
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    {q.options.map((opt, i) => {
                      const letter = String.fromCharCode(65 + i)
                      return (
                        <label
                          key={opt}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors",
                            selected === i
                              ? "border-primary bg-accent text-foreground"
                              : "border-border bg-card text-foreground hover:bg-muted",
                          )}
                        >
                          <input
                            type="radio"
                            name="pre"
                            checked={selected === i}
                            onChange={() => setSelected(i)}
                            className="h-4 w-4 accent-[var(--color-primary)]"
                          />
                          <span className="font-semibold">{letter}.</span>
                          <span>{opt}</span>
                        </label>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={selected === null}
                    onClick={handleNext}
                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isLast ? "Selesai" : "Selanjutnya"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </section>
              )}
            </>
          )}

          {/* POST-TEST */}
          {menu === "posttest" && (
            <>
              {!pretestDone ? (
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm text-center">
                  <p className="text-sm text-muted-foreground">
                    Selesaikan Pre-test terlebih dahulu sebelum mengerjakan Post-test.
                  </p>
                </section>
              ) : posttestDone ? (
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm text-center">
                  <Trophy className="mx-auto h-10 w-10 text-primary" />
                  <h2 className="mt-3 font-heading text-lg font-bold text-foreground">
                    Post-test sudah dikerjakan
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Nilai kamu: {post.score}. Lihat hasil di menu Hasil Belajar.
                  </p>
                </section>
              ) : (
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold text-foreground">
                      Post-test
                    </h2>
                    <span className="text-xs font-medium text-muted-foreground">
                      {qIndex + 1} / {questions.length}
                    </span>
                  </div>
                  <p className="mb-1 text-xs italic text-muted-foreground">
                    {q.context}
                  </p>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-foreground">
                    {q.question}
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    {q.options.map((opt, i) => {
                      const letter = String.fromCharCode(65 + i)
                      return (
                        <label
                          key={opt}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors",
                            selected === i
                              ? "border-primary bg-accent text-foreground"
                              : "border-border bg-card text-foreground hover:bg-muted",
                          )}
                        >
                          <input
                            type="radio"
                            name="post"
                            checked={selected === i}
                            onChange={() => setSelected(i)}
                            className="h-4 w-4 accent-[var(--color-primary)]"
                          />
                          <span className="font-semibold">{letter}.</span>
                          <span>{opt}</span>
                        </label>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={selected === null}
                    onClick={handleNext}
                    className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isLast ? "Selesai" : "Selanjutnya"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </section>
              )}
            </>
          )}

          {/* HASIL BELAJAR */}
          {menu === "hasil-belajar" && (
            <>
              {!pretestDone ? (
                <section className="rounded-xl border border-border bg-card p-6 shadow-sm text-center">
                  <p className="text-sm text-muted-foreground">
                    Kerjakan Pre-test dan Post-test terlebih dahulu untuk melihat hasil belajar.
                  </p>
                </section>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                      <p className="text-sm text-muted-foreground">
                        Nilai Pre-test
                      </p>
                      <p className="mt-2 font-heading text-4xl font-bold text-foreground">
                        {pre.score}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {pre.benar}/{pre.total} benar
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                      <p className="text-sm text-muted-foreground">
                        Nilai Post-test
                      </p>
                      <p className="mt-2 font-heading text-4xl font-bold text-foreground">
                        {posttestDone ? post.score : "—"}
                      </p>
                      {posttestDone && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {post.benar}/{post.total} benar
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
                      <p className="text-sm text-muted-foreground">N-Gain</p>
                      <p className="mt-2 font-heading text-4xl font-bold text-primary">
                        {posttestDone ? nGain.toFixed(2) : "—"}
                      </p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">
                        Kategori: {nGainKategori}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    {isGuru && (
                      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 font-heading text-base font-bold text-foreground">
                          Grafik Peningkatan
                        </h2>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { name: "Pre-test", Nilai: pre.score },
                                { name: "Post-test", Nilai: posttestDone ? post.score : 0 },
                              ]}
                              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                              <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                stroke="var(--color-muted-foreground)"
                              />
                              <YAxis
                                domain={[0, 100]}
                                tick={{ fontSize: 12 }}
                                stroke="var(--color-muted-foreground)"
                              />
                              <Tooltip
                                contentStyle={{
                                  borderRadius: 8,
                                  border: "1px solid var(--color-border)",
                                  fontSize: 12,
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="Nilai"
                                stroke="var(--color-chart-1)"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </section>
                    )}

                    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                      <h2 className="mb-3 font-heading text-base font-bold text-foreground">
                        Refleksi
                      </h2>
                      <p className="mb-3 text-xs text-muted-foreground">
                        Apa yang kamu pelajari hari ini?
                      </p>
                      <textarea
                        value={refleksi}
                        onChange={(e) => setRefleksi(e.target.value)}
                        rows={5}
                        placeholder="Tulis refleksi belajarmu di sini..."
                        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={simpanRefleksi}
                        className="mt-3 self-end rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        Simpan
                      </button>
                    </section>
                  </div>

                  <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 font-heading text-base font-bold text-foreground">
                      Portofolio
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-muted/40 p-4">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">
                            Proyek PjBL
                          </span>
                        </div>
                        <span
                          className={cn(
                            "mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold",
                            proyekSelesai
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {proyekSelesai ? "Sudah Mengumpulkan" : "Belum Mengumpulkan"}
                        </span>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/40 p-4">
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">
                            Aktivitas Interaktif
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {aktivitasLabels.map((label, i) => (
                            <span
                              key={label}
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                                aktivitasSelesai[i]
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
