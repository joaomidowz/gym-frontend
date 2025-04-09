"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { getExercises } from "@/services/exercises";
import { getToken } from "@/utils/storage";
import { muscleGroups } from "@/services/exercises";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: any) => void;
};

export default function ExerciseSearch({ isOpen, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const all = await getExercises(token || "");
      let filtered = all;

      if (query.trim()) {
        filtered = filtered.filter((ex: any) =>
          ex.name.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (selectedGroup) {
        filtered = filtered.filter(
          (ex: any) => ex.muscle_group === selectedGroup
        );
      }

      setResults(filtered);
    } catch (err) {
      console.error("Erro ao buscar exercícios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExercises();
    }
  }, [isOpen]);

  useEffect(() => {
    fetchExercises();
  }, [query, selectedGroup]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-background z-50 p-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary">Selecionar Exercício</h2>
            <button onClick={onClose}>
              <IoClose className="text-2xl text-primary" />
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-primary text-primary bg-secundary focus:outline-none"
            />
            <FaSearch className="text-primary" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {muscleGroups.map((group) => (
              <button
                key={group}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedGroup === group
                    ? "bg-primary text-white"
                    : "border-primary text-primary"
                }`}
                onClick={() =>
                  setSelectedGroup((prev) => (prev === group ? "" : group))
                }
              >
                {group}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-primary">Carregando...</p>
          ) : (
            <div className="space-y-2 text-primary overflow-y-auto max-h-[60vh]">
              {results.length === 0 && <p>Nenhum exercício encontrado.</p>}
              {results.map((ex: any) => (
                <button
                  key={ex.id}
                  className="block w-full text-left border border-primary rounded-xl p-3 hover:bg-primary hover:text-white transition"
                  onClick={() => {
                    onSelect(ex);
                    onClose();
                  }}
                >
                  <p className="font-semibold">{ex.name}</p>
                  <p className="text-sm opacity-80">{ex.muscle_group}</p>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
