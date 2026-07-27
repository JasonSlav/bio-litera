import { MessageCircleQuestion, Blocks, Puzzle, MonitorPlay, Sprout } from "lucide-react"
import { PageHeading } from "@/components/page-heading"

const activities = [
  {
    title: "Kuis Interaktif",
    desc: "Uji pemahamanmu dengan kuis menarik!",
    icon: MessageCircleQuestion,
    accent: "text-violet-600",
    bg: "bg-violet-50",
    btn: "bg-violet-600 hover:bg-violet-700",
    btnLabel: "Mulai",
  },
  {
    title: "Drag & Drop",
    desc: "Lengkapi pernyataan dengan cara drag & drop!",
    icon: Blocks,
    accent: "text-blue-600",
    bg: "bg-blue-50",
    btn: "bg-blue-600 hover:bg-blue-700",
    btnLabel: "Mulai",
  },
  {
    title: "Puzzle Ekosistem",
    desc: "Susun komponen ekosistem mangrove!",
    icon: Puzzle,
    accent: "text-amber-600",
    bg: "bg-amber-50",
    btn: "bg-amber-500 hover:bg-amber-600",
    btnLabel: "Mulai",
  },
  {
    title: "Simulasi",
    desc: "Lakukan simulasi dampak kerusakan mangrove!",
    icon: MonitorPlay,
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    btnLabel: "Lihat",
  },
]

export default function AktivitasPage() {
  return (
    <div>
      <PageHeading
        title="Aktivitas Interaktif"
        description="Pilih aktivitas yang ingin kamu kerjakan!"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {activities.map(({ title, desc, icon: Icon, accent, bg, btn, btnLabel }) => (
          <div
            key={title}
            className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-xl ${bg} ${accent}`}
            >
              <Icon className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-heading text-base font-bold text-foreground">
              {title}
            </h3>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
              {desc}
            </p>
            <button
              type="button"
              className={`mt-4 self-start rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${btn}`}
            >
              {btnLabel}
            </button>
          </div>
        ))}
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
    </div>
  )
}
