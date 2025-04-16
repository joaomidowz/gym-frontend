"use client"

import {
  createContext,
  useState,
  useEffect,
  ReactNode
} from "react"
import {
  getToken,
  saveToken,
  removeToken
} from "@/utils/storage"
import {
  getLogedUser,
  loginUser,
  registerUser
} from "@/services/auth"

type User = {
  id: number,
  name: string,
  email: string,
  height_cm?: number,
  weight_kg?: number
}

type AuthContextType = {
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function login(email: string, password: string) {
    const { token } = await loginUser(email, password)
    saveToken(token)
    setToken(token)
    const userData = await getLogedUser(token)
    setUser(userData)
  }

  async function register(name: string, email: string, password: string) {
    const { token } = await registerUser(name, email, password)
    saveToken(token)
    setToken(token)
    const userData = await getLogedUser(token)
    setUser(userData)
  }

  function logout() {
    removeToken()
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const storedToken = getToken()

    if (storedToken) {
      setToken(storedToken)
      getLogedUser(storedToken)
        .then(setUser)
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
