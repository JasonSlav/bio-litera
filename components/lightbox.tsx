"use client"

import { useEffect } from "react"
import { X, Leaf } from "lucide-react"

interface LightboxProps {
  src: string
  alt: string
  onClose: () => void
  jenis?: "Biotik" | "Abiotik"
}

export function Lightbox({ src, alt, onClose, jenis }: LightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        aria-label="Tutup"
      >
        <X className="h-6 w-6" />
      </button>

      <div
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        />
        {jenis && (
          <div
            className={`mt-3 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
              jenis === "Biotik"
                ? "bg-emerald-500 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            <Leaf className="h-4 w-4" />
            {jenis}
          </div>
        )}
      </div>
    </div>
  )
}
