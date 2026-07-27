"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Pencil, Images, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Lightbox } from "@/components/lightbox"

const chapters = [
  {
    title: "Ekosistem Mangrove",
    desc: "Ekosistem mangrove adalah ekosistem unik yang berada di wilayah pesisir dan muara sungai. Mangrove memiliki peran penting bagi lingkungan dan kehidupan manusia.",
  },
  {
    title: "Keanekaragaman Hayati",
    desc: "Mangrove menjadi rumah bagi beragam flora dan fauna, mulai dari ikan, kepiting, burung, hingga berbagai jenis tumbuhan khas pesisir.",
  },
  {
    title: "Ciri Khusus Tumbuhan Mangrove",
    desc: "Tumbuhan mangrove memiliki adaptasi khusus seperti akar napas dan kelenjar garam untuk bertahan di lingkungan berair asin.",
  },
  {
    title: "Peran Mangrove",
    desc: "Mangrove berperan melindungi pantai dari abrasi, menyerap karbon, serta menjadi tempat berkembang biak biota laut.",
  },
  {
    title: "Ancaman Terhadap Mangrove",
    desc: "Alih fungsi lahan menjadi tambak, pencemaran, dan penebangan liar menjadi ancaman serius bagi kelestarian mangrove.",
  },
  {
    title: "Upaya Konservasi",
    desc: "Penanaman kembali, perlindungan kawasan, serta edukasi masyarakat menjadi kunci pelestarian ekosistem mangrove.",
  },
  {
    title: "Mangrove & Perubahan Iklim",
    desc: "Mangrove menyerap karbon hingga empat kali lebih banyak dibanding hutan daratan, membantu mitigasi perubahan iklim.",
  },
]

const GALLERY_INDEX = 7

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
        <aside className="rounded-xl border border-border bg-card p-4 shadow-sm">
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
              <h1 className="mb-4 font-heading text-xl font-bold text-foreground">
                {active + 1}. {current.title}
              </h1>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src="/galeri/ekosistem-1.png"
                  alt={`Video pembelajaran ${current.title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                  <button
                    type="button"
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-card/90 text-primary shadow-lg transition-transform hover:scale-105"
                    aria-label="Putar video"
                  >
                    <Play className="h-7 w-7 fill-primary" />
                  </button>
                </div>
                <span className="absolute left-2 bottom-2 rounded-full bg-foreground/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  Media: Ekosistem (Abiotik)
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {current.desc}
              </p>
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
