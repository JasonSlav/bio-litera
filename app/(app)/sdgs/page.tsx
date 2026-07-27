import { BookOpen, CloudSun, Fish, Trees, Handshake, Sprout } from "lucide-react"
import { PageHeading } from "@/components/page-heading"

const goals = [
  {
    number: 4,
    code: "Quality Education",
    title: "Pendidikan Berkualitas",
    desc: "Mengembangkan pengetahuan dan kesadaran tentang pelestarian lingkungan.",
    icon: BookOpen,
    color: "#C5192D",
  },
  {
    number: 13,
    code: "Climate Action",
    title: "Penanganan Perubahan Iklim",
    desc: "Mangrove menyerap karbon dan membantu mitigasi perubahan iklim.",
    icon: CloudSun,
    color: "#3F7E44",
  },
  {
    number: 14,
    code: "Life Below Water",
    title: "Ekosistem Lautan Terjaga",
    desc: "Mangrove menjaga habitat biota laut dan pesisir.",
    icon: Fish,
    color: "#0A97D9",
  },
  {
    number: 15,
    code: "Life on Land",
    title: "Ekosistem Daratan Terjaga",
    desc: "Mangrove menjaga keanekaragaman hayati darat dan pesisir.",
    icon: Trees,
    color: "#56C02B",
  },
  {
    number: 17,
    code: "Partnerships",
    title: "Kemitraan untuk Mencapai Tujuan",
    desc: "Kolaborasi semua pihak untuk pelestarian mangrove.",
    icon: Handshake,
    color: "#19486A",
  },
]

export default function SdgsPage() {
  return (
    <div>
      <PageHeading
        title="Mangrove dan Tujuan Pembangunan Berkelanjutan"
        description="Mangrove berperan penting dalam mendukung pencapaian SDGs."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {goals.map(({ number, code, title, desc, icon: Icon, color }) => (
          <div
            key={number}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <div
              className="flex flex-col gap-2 p-4 text-white"
              style={{ backgroundColor: color }}
            >
              <span className="font-heading text-2xl font-bold leading-none">
                {number}
              </span>
              <Icon className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase leading-tight">
                {code}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-heading text-sm font-bold text-foreground">
                {title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA banner */}
      <div className="mt-8 flex items-start gap-4 rounded-xl bg-primary p-6 text-primary-foreground shadow-sm">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
          <Sprout className="h-6 w-6" />
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold">Ayo berkontribusi!</h2>
          <p className="mt-1 text-sm leading-relaxed text-primary-foreground/90">
            Mulai dari hal kecil untuk lingkungan yang lebih baik.
          </p>
        </div>
      </div>
    </div>
  )
}
