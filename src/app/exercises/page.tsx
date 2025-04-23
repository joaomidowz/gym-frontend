"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/utils/storage";
import { getExercisesWithPR } from "@/services/exercises";
import ExerciseCard from "@/components/exerciseCard";
import CreateExerciseOverlay from "@/components/createExerciseOverlay";
import { FaSearch, FaPlus } from "react-icons/fa";

export default function ExercisesPage() {
    const [exercises, setExercises] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState<any[]>([]);
    const [showCreate, setShowCreate] = useState(false);

    const fetchExercises = async () => {
        try {
            const token = getToken();
            const data = await getExercisesWithPR(token || "");
            setExercises(data);
            setFiltered(data);
        } catch (err) {
            console.error("Erro ao buscar exercícios:", err);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        const q = query.toLowerCase();
        const results = exercises.filter((ex) => ex.name.toLowerCase().includes(q));
        setFiltered(results);
    }, [query, exercises]);

    return (
        <div className="p-4 pb-28">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary">Meus Exercícios</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 bg-primary text-white-txt px-4 py-2 rounded-xl text-sm"
                >
                    <FaPlus /> Novo Exercício
                </button>
            </div>

            <div className="mb-4 flex items-center gap-2">
                <FaSearch className="text-primary" />
                <input
                    type="text"
                    placeholder="Buscar exercício..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 p-2 border rounded-xl text-sm border-primary"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhum exercício encontrado.</p>
                ) : (
                    filtered.map((ex) => (
                        <ExerciseCard
                            key={ex.id}
                            name={ex.name}
                            description={ex.description}
                            pr_weight={ex.pr_weight}
                            pr_reps={ex.pr_reps}
                        />
                    ))
                )}
            </div>

            <CreateExerciseOverlay
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                onCreated={() => fetchExercises()}
            />
        </div>
    );
}
