"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/footer";
import ErrorNotify from "@/components/errorNotify";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("");
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(email, password)
            router.push("/feed")
        } catch (error: any) {
            setErrorMsg(error.message || "Erro ao fazer login");
            console.error(error)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            {errorMsg && <ErrorNotify message={errorMsg} onClose={() => setErrorMsg("")} />}
            <h1 className="text-primary text-4xl py-4">Bom que voltou à <span className="text-accent font-bold">Midowz Gym💪</span></h1>

            <form onSubmit={handleSubmit} className="border border-primary rounded-2xl p-10 shadow-lg flex flex-col gap-5 text-primary">
                <div className="flex flex-col">
                    <label htmlFor="">E-mail</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-primary rounded-2xl p-3 text-primary focus:outline-none" />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="">Senha</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-primary rounded-2xl p-3 text-primary focus:outline-none" />
                </div>

                <button type="submit" className="bg-primary rounded-2xl text-white text-xl py-3 px-6 hover:bg-primary/80 transition">Login</button>

            </form>
            <Footer />
        </div>
    )
}