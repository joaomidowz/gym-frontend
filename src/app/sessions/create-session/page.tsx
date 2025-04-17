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

      router.push(`/sessions/${newSession.sessions.id}/edit`);
    } catch (err: any) {
      setError(err.message || "Erro ao criar sessão");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto text-primary">
      <h1 className="text-3xl font-bold mb-8">Começando novo treino</h1>

      <div className="w-full space-y-6">
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Nome da sessão</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ex: Peito e Tríceps"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Notas (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="Adicione observações ou metas do treino..."
          />
        </div>

        <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2">
          <span className="text-sm text-gray-600">Sessão pública?</span>
          <button
            type="button"
            onClick={() => setIsPublic((prev) => !prev)}
            className={`px-4 py-1 rounded-xl text-sm font-semibold transition-all ${isPublic ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
              }`}
          >
            {isPublic ? "Pública" : "Privada"}
          </button>
        </div>

        <button
          onClick={handleCreateSession}
          className="w-full bg-primary text-white text-base font-medium rounded-2xl p-3 hover:bg-primary/80 transition"
        >
          Criar sessão
        </button>
      </div>
    </div>
  );
}
