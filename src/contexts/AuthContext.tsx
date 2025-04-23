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
import { usePathname, useRouter } from "next/navigation"

// src/contexts/AuthContext.tsx
type User = {
  id: number;
  name: string;
  email: string;
  height_cm?: number;
  weight_kg?: number;
  is_public?: boolean;
  is_admin?: boolean;
};


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
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onFocus = () => {
      const event = new CustomEvent("app:focus");
      window.dispatchEvent(event);
    };
  
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/register") {
      localStorage.setItem("lastPath", pathname)
    }
  }, [pathname])

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
        .then((userData) => {
          setUser(userData)

          const lastPath = localStorage.getItem("lastPath")
          if (lastPath && window.location.pathname === "/") {
            router.replace(lastPath)
          }
        })
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
