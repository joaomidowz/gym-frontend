"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWorkout } from "@/services/workoutSession";
import { getToken } from "@/utils/storage";

export default function CreateSessionPage() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [notes, setNotes] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [sessionCreated, setSessionCreated] = useState(false);
    const [sessionData, setSessionData] = useState<any>(null);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleCreateSession = async () => {
        setError("");

        if (!title || !date) {
            setError("Título e data são obrigatórios");
            return;
        }

        try {
            const token = getToken();
            if (!token) {
                setError("Usuário não autenticado");
                return;
            }

            const newSession = await createWorkout(token, {
                title,
                date,
                is_public: isPublic,
                notes,
            });

            setSessionCreated(true);
            setSessionData(newSession.sessions);
        } catch (err: any) {
            setError(err.message || "Erro ao criar sessão");
        }
    };

    return (
        <div className="flex flex-col items-center p-6 max-w-md mx-auto">
            <h1 className="text-primary text-3xl font-bold mb-6">Começando novo treino</h1>

            {!sessionCreated ? (
                <div className="w-full space-y-4">
                    {error && <p className="text-red-500">{error}</p>}

                    <div>
                        <label className="text-sm text-gray-600">Nome da sessão</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-primary rounded-xl p-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Data</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-primary rounded-xl p-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Notas (opcional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border border-primary rounded-xl p-2"
                            rows={3}
                        />
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={() => setIsPublic((prev) => !prev)}
                        />
                        Tornar sessão pública
                    </label>

                    <button
                        onClick={handleCreateSession}
                        className="w-full bg-primary text-white text-lg rounded-2xl p-3 hover:bg-primary/80 transition"
                    >
                        Criar sessão
                    </button>
                </div>
            ) : (
                <div className="text-center space-y-4">
                    <h2 className="text-2xl text-primary font-semibold">Sessão criada!</h2>
                    <p className="text-lg">{sessionData.title}</p>
                    <p className="text-sm text-gray-600">{sessionData.date}</p>
                    <p className="text-sm">{sessionData.notes}</p>

                    <button
                        onClick={() => router.push(`/sessions/${sessionData.id}/edit`)}
                        className="mt-4 bg-primary text-white rounded-xl px-6 py-2"
                    >
                        Ver detalhes da sessão
                    </button>
                </div>
            )}
        </div>
    );
}
