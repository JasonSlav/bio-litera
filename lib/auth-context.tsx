"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"

export type Role = "guru" | "siswa"

export interface User {
  uid: string
  name: string
  email: string
  photoURL: string
  role: Role
  classCode?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  registerUser: (data: {
    name: string
    email: string
    role: Role
    classCode?: string
  }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = "bio_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const registerUser = useCallback(
    (data: { name: string; email: string; role: Role; classCode?: string }) => {
      const newUser: User = {
        uid: "user-" + Date.now(),
        name: data.name,
        email: data.email,
        photoURL: "/placeholder-user.jpg",
        role: data.role,
        classCode: data.classCode,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      setUser(newUser)
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
