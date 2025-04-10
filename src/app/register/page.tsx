"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/footer";
import ErrorNotify from "@/components/errorNotify";
import Link from "next/link";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !repeatPassword) {
            setErrorMsg("Preencha todos os campos para continuar.");
            return;
        }

        if (password !== repeatPassword) {
            setErrorMsg("As senhas não coincidem.");
            return;
        }

        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!strongPasswordRegex.test(password)) {
            setErrorMsg(
                "A senha deve conter pelo menos 6 caracteres, incluindo uma letra maiúscula, uma minúscula e um número."
            );
            return;
        }

        try {
            await register(name, email, password);
            router.push("/register/details"); 
        } catch (error: any) {
            setErrorMsg(
                error?.message === "User already exists"
                    ? "Este e-mail já está em uso."
                    : "Erro ao registrar. Tente novamente."
            );
            console.error("Erro no registro:", error);
        }
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            {errorMsg && (
                <ErrorNotify message={errorMsg} onClose={() => setErrorMsg("")} />
            )}

            <h1 className="text-primary text-4xl py-4">
                Bem-vindo à <span className="text-accent font-bold">Midowz Gym💪</span>
            </h1>

            <form
                onSubmit={handleSubmit}
                className="border border-primary rounded-2xl p-10 shadow-lg flex flex-col gap-5 text-primary"
            >
                <div className="flex flex-col">
                    <label htmlFor="name">Nome</label>
                    <input
                        id="name"
                        type="text"
                        className="border border-primary rounded-2xl p-3 text-primary focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        className="border border-primary rounded-2xl p-3 text-primary focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        className="border border-primary rounded-2xl p-3 text-primary focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="repeat-password">Repetir senha</label>
                    <input
                        id="repeat-password"
                        type="password"
                        className="border border-primary rounded-2xl p-3 text-primary focus:outline-none"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary rounded-2xl text-white text-xl py-3 px-6 hover:bg-primary/80 transition"
                >
                    Registrar
                </button>
                <Link href="/login">
                <p className="text-primary text-xl underline cursor-pointer">Login</p>
                </Link>
            </form>

            <Footer />
        </div>
    );
}
