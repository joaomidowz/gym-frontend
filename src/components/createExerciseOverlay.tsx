"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { getToken } from "@/utils/storage";

const muscleGroups = [
  "Peito",
  "Costas",
  "Bíceps",
  "Tríceps",
  "Pernas",
  "Ombros",
  "Core",
  "Outros",
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (exercise: any) => void;
};

export default function CreateExerciseOverlay({ isOpen, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Peito");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    const token = getToken();
    if (!token) return;

    if (!name.trim() || !muscleGroup) {
      setError("Nome e grupo muscular são obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          muscle_group: muscleGroup,
          is_global: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar exercício");
      }

      onCreated(data); // retorna pro modal de search
      onClose();       // fecha esse modal
    } catch (err: any) {
      setError(err.message || "Erro ao criar exercício");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] p-4 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
            <button onClick={onClose} className="absolute right-4 top-4 text-xl text-primary">
              <IoClose />
            </button>
            <h2 className="text-xl font-bold text-primary mb-4">Novo Exercício</h2>

            <input
              type="text"
              placeholder="Nome do exercício"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-3 border rounded-xl text-sm"
            />

            <textarea
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-3 p-3 border rounded-xl text-sm"
            />

            <select
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
              className="w-full mb-3 p-3 border rounded-xl text-sm"
            >
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-xl text-sm"
            >
              {loading ? "Criando..." : "Criar Exercício"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
