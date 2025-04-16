"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/footer";
import ErrorNotify from "@/components/errorNotify";
import { updateUser } from "@/services/user";
import { getToken } from "@/utils/storage";
import { SuccessToast } from "@/components/successToast";

export default function Details() {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = getToken();

            if (!token || !user?.id) throw new Error("Usuário não autenticado.");

            const updates: any = {};
            if (height !== "" && Number(height) > 0) updates.height_cm = Number(height);
            if (weight !== "" && Number(weight) > 0) updates.weight_kg = Number(weight);

            if (Object.keys(updates).length > 0) {
                await updateUser(user.id, token, updates);
                setShowSuccess(true);
                setTimeout(() => router.push("/feed"), 1500);
            } else {
                router.push("/feed");
            }
        } catch (error: any) {
            console.error("Erro ao atualizar usuário:", error);
            setErrorMsg("Erro ao atualizar perfil.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            {errorMsg && (
                <ErrorNotify message={errorMsg} onClose={() => setErrorMsg("")} />
            )}

            {showSuccess && <SuccessToast message="Dados atualizados com sucesso!" />}

            <h1 className="text-primary text-4xl py-4">
                Preencha com suas informações!
            </h1>

            <p className="text-sm text-gray-500 mb-4">
                (opcional, mas ajuda a personalizar sua experiência)
            </p>

            <form
                onSubmit={handleSubmit}
                className="border border-primary rounded-2xl p-10 shadow-lg flex flex-col gap-5 text-primary"
            >
                <div className="flex flex-col">
                    <label htmlFor="weight">Peso (kg)</label>
                    <input
                        id="weight"
                        type="number"
                        className="border border-primary rounded-2xl p-3 text-primary focus:outline-none"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="height">Altura (cm)</label>
                    <input
                        id="height"
                        type="number"
                        className="border border-primary rounded-2xl p-3 text-primary focus:outline-none"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-primary rounded-2xl text-white text-xl py-3 px-6 hover:bg-primary/80 transition"
                >
                    Registrar
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/feed")}
                    className="text-sm text-gray-500 underline"
                >
                    Prefiro não informar agora
                </button>
            </form>

            <Footer />
        </div>
    );
}
