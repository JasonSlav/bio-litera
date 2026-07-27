"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Leaf, GraduationCap, BookOpen, Globe2, Check } from "lucide-react"
import { useAuth, type Role } from "@/lib/auth-context"

const highlights = [
  { icon: BookOpen, text: "Materi IPA interaktif tentang ekosistem mangrove" },
  { icon: GraduationCap, text: "Literasi sains & evaluasi belajar" },
  { icon: Globe2, text: "Proyek PjBL terhubung dengan tujuan SDGs" },
]

export default function LoginPage() {
  const router = useRouter()
  const { user, registerUser } = useAuth()
  const [step, setStep] = useState<"login" | "role" | "siswa-code" | "guru-done">(
    "login",
  )
  const [classCode, setClassCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")

  useEffect(() => {
    if (user?.role) {
      router.replace("/materi")
    }
  }, [user, router])

  if (user?.role) return null

  function handleGoogleLogin() {
    setStep("role")
  }

  function handleRolePick(role: Role) {
    if (role === "guru") {
      const code = "KLS" + Math.random().toString(36).slice(2, 5).toUpperCase()
      setGeneratedCode(code)
      setStep("guru-done")
    } else {
      setStep("siswa-code")
    }
  }

  function handleGuruFinish() {
    registerUser({
      name: "Budi Santoso",
      email: "budi@sekolah.id",
      role: "guru",
      classCode: generatedCode,
    })
  }

  function handleSiswaJoin() {
    if (classCode.trim().length < 6) return
    registerUser({
      name: "Ani Putri",
      email: "ani@student.id",
      role: "siswa",
      classCode: classCode.trim(),
    })
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Leaf className="h-6 w-6" />
          </span>
          <span className="font-heading text-xl font-bold">Bio-Litera</span>
        </div>
        <div>
          <h2 className="font-heading text-3xl font-bold leading-tight text-balance">
            Belajar konservasi mangrove untuk masa depan berkelanjutan.
          </h2>
          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-foreground/15">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm leading-relaxed text-primary-foreground/90">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/70">
          &copy; {new Date().getFullYear()} Bio-Litera. Platform Literasi Sains.
        </p>
      </div>

      <div className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-bold text-foreground">
              Bio-Litera
            </span>
          </div>

          {step === "login" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Masuk ke akun Anda
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Gunakan akun Google sekolah Anda untuk mengakses seluruh materi
                dan aktivitas pembelajaran.
              </p>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                <GoogleIcon />
                Masuk dengan Google
              </button>
            </>
          )}

          {step === "role" && (
            <>
              <button
                type="button"
                onClick={() => setStep("login")}
                className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Pilih peran Anda
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Apakah Anda seorang guru atau siswa?
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => handleRolePick("guru")}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-primary hover:bg-accent"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-heading text-base font-bold text-foreground">
                      Saya Guru
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Kelola kelas dan konten pembelajaran
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRolePick("siswa")}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-primary hover:bg-accent"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <BookOpen className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-heading text-base font-bold text-foreground">
                      Saya Siswa
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Belajar dan kerjakan tugas dari guru
                    </p>
                  </div>
                </button>
              </div>
            </>
          )}

          {step === "siswa-code" && (
            <>
              <button
                type="button"
                onClick={() => setStep("role")}
                className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Masukkan kode kelas
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Mintalah kode kelas dari guru Anda.
              </p>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder="Contoh: ABC123"
                maxLength={6}
                className="mt-8 block w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-lg font-bold tracking-widest text-foreground outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleSiswaJoin}
                disabled={classCode.trim().length < 6}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                Gabung Kelas
              </button>
            </>
          )}

          {step === "guru-done" && (
            <>
              <button
                type="button"
                onClick={() => setStep("role")}
                className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Kelas berhasil dibuat!
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Bagikan kode kelas ini kepada siswa Anda.
              </p>
              <div className="mt-8 rounded-xl border-2 border-dashed border-primary bg-accent/50 p-6 text-center">
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Kode Kelas
                </p>
                <p className="font-heading text-4xl font-bold tracking-[0.3em] text-primary">
                  {generatedCode}
                </p>
              </div>
              <button
                type="button"
                onClick={handleGuruFinish}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                Lanjut ke Materi
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}
