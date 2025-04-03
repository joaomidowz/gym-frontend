"use client"

import { createContext, useState, useEffect, ReactNode, use } from "react"
import { getToken, saveToken, removeToken } from "@/utils/storage"
import { getLogedUser, loginUser, registerUser } from "@/services/auth"

type User = {
    id: number,
    name: string,
    email: string,
    height_cm?: number,
    weight_kg?: number
}

type AuthContextType  = {
    user: User | null,
    isAuthenticated: boolean,
    loading: boolean,
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext({} as AuthContextType )

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    async function login(email: string, password: string) {
        const { token } = await loginUser(email, password)
        saveToken(token)
        const userData = await getLogedUser(token)
        setUser(userData)
    }

    async function register(name: string, email: string, password: string) {
        const { token } = await registerUser(name, email, password)
        saveToken(token)
        const userData = await getLogedUser(token)
        setUser(userData)
    }

    function logout() {
        removeToken()
        setUser(null)
    }

    useEffect(() => {
        const token = getToken()

        if (token) {
            getLogedUser(token).then(setUser).catch(() => logout()).finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

