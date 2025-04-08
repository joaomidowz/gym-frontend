"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getExercises } from "@/services/exercises";
import { getToken } from "@/utils/storage";
import {
    createWorkoutExercise,
    createWorkoutSet,
    deleteWorkoutExercise,
    getWorkoutExercisesByWorkoutId,
    updateWorkoutSet,
} from "@/services/workoutExercise";
import { motion } from "framer-motion";

const setTypes = ["Warmup", "Feeder", "Work", "Top"];

type Set = {
    id?: number;
    reps: string;
    weight: string;
    set_type: string;
};

type Exercise = {
    id: number;
    backendId?: number;
    exerciseId: string;
    sets: Set[];
};

export default function EditSession() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exerciseOptions, setExerciseOptions] = useState<any[]>([]);
    const router = useRouter();
    const { id: sessionId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                if (!token || !sessionId) return;

                const [exerciseRes, workoutRes] = await Promise.all([
                    getExercises(token),
                    getWorkoutExercisesByWorkoutId(Number(sessionId), token),
                ]);

                setExerciseOptions(exerciseRes);

                const formatted = workoutRes.map((item: any) => ({
                    id: Date.now() + item.id,
                    backendId: item.id,
                    exerciseId: item.exercise.id.toString(),
                    sets: (item.workout_sets || []).map((s: any, i: number) => ({
                        id: s.id,
                        reps: s.reps?.toString() || "",
                        weight: s.weight?.toString() || "",
                        set_type: s.set_type || "Work",
                    })),
                }));

                setExercises(formatted);
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
            }
        };

        fetchData();
    }, [sessionId]);

    const addExercise = () => {
        setExercises((prev) => [
            ...prev,
            {
                id: Date.now(),
                exerciseId: "",
                sets: [{ reps: "", weight: "", set_type: "Work" }],
            },
        ]);
    };

    const addSet = (exerciseId: number) => {
        setExercises((prev) =>
            prev.map((ex) =>
                ex.id === exerciseId
                    ? {
                        ...ex,
                        sets: [...ex.sets, { reps: "", weight: "", set_type: "Work" }],
                    }
                    : ex
            )
        );
    };

    const deleteSet = (exerciseId: number, index: number) => {
        setExercises((prev) =>
            prev.map((ex) =>
                ex.id === exerciseId
                    ? { ...ex, sets: ex.sets.filter((_, i) => i !== index) }
                    : ex
            )
        );
    };

    const deleteExercise = async (exerciseId: number, backendId?: number) => {
        if (backendId) {
            try {
                const token = getToken();
                if (!token) {
                    console.error("Usuário não autenticado");
                    return;
                }

                await deleteWorkoutExercise(backendId, token);

                await deleteWorkoutExercise(backendId, token);
            } catch (err) {
                console.error("Erro ao excluir exercício existente:", err);
            }
        }
        setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
    };

    const updateSet = (
        exerciseId: number,
        setIndex: number,
        field: keyof Set,
        value: string
    ) => {
        setExercises((prev) =>
            prev.map((ex) => {
                if (ex.id !== exerciseId) return ex;

                const updatedSets = [...ex.sets];
                const updatedSet = { ...updatedSets[setIndex], [field]: value }; // 👈 aqui é o segredo
                updatedSets[setIndex] = updatedSet;

                return { ...ex, sets: updatedSets };
            })
        );
    };

    const handleFinalize = async () => {
        const token = getToken();
        if (!token || !sessionId) return;

        try {
            for (const ex of exercises) {
                if (!ex.exerciseId) continue;

                let workoutExerciseId = ex.backendId;

                if (!workoutExerciseId) {
                    const created = await createWorkoutExercise(token, {
                        workout_session_id: Number(sessionId),
                        exercise_id: Number(ex.exerciseId),
                    });
                    workoutExerciseId = created.id;
                }

                for (let i = 0; i < ex.sets.length; i++) {
                    const set = ex.sets[i];
                    await createWorkoutSet(token, {
                        workout_exercise_id: workoutExerciseId!,
                        workout_session_id: Number(sessionId),
                        weight: Number(set.weight),
                        reps: Number(set.reps),
                        set_type: set.set_type,
                        order: i + 1,
                    });
                }
            }

            router.push("/sessions");
        } catch (err) {
            console.error("Erro ao salvar exercícios:", err);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 max-w-md mx-auto text-primary pb-32">
            <h1 className="text-2xl font-bold mb-4">Adicionar Exercícios</h1>

            <button
                onClick={addExercise}
                className="bg-primary text-white px-4 py-2 rounded-xl mb-6"
            >
                + Adicionar Exercício
            </button>

            <div className="w-full space-y-6">
                {exercises.map((ex) => (
                    <motion.div
                        key={ex.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-2 border-primary rounded-xl p-4"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <select
                                value={ex.exerciseId}
                                onChange={(e) => {
                                    const newId = e.target.value;
                                    setExercises((prev) =>
                                        prev.map((e2) =>
                                            e2.id === ex.id ? { ...e2, exerciseId: newId } : e2
                                        )
                                    );
                                }}
                                className="w-full border border-primary p-2 rounded-xl"
                            >
                                <option value="">Selecionar exercício</option>
                                {exerciseOptions.map((op: any) => (
                                    <option key={op.id} value={op.id}>
                                        {op.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="ml-2 text-red-500 font-bold"
                                onClick={() => deleteExercise(ex.id, ex.backendId)}
                            >
                                X
                            </button>
                        </div>

                        {ex.sets.map((set, idx) => (
                            <div key={idx} className="flex flex-col mb-2">
                                <div className="flex gap-2">
                                    <div className="w-1/2">
                                        <label className="block text-xs mb-1">Repetições</label>
                                        <input
                                            type="number"
                                            value={set.reps}
                                            onChange={(e) =>
                                                updateSet(ex.id, idx, "reps", e.target.value)
                                            }
                                            className="w-full border border-primary p-2 rounded-xl"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-xs mb-1">Peso (kg)</label>
                                        <input
                                            type="number"
                                            value={set.weight}
                                            onChange={(e) =>
                                                updateSet(ex.id, idx, "weight", e.target.value)
                                            }
                                            className="w-full border border-primary p-2 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <select
                                        value={set.set_type}
                                        onChange={(e) =>
                                            updateSet(ex.id, idx, "set_type", e.target.value)
                                        }
                                        className="w-full border border-primary p-2 rounded-xl"
                                    >
                                        {setTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => deleteSet(ex.id, idx)}
                                        className="text-red-500 font-bold text-xs"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => addSet(ex.id)}
                            className="text-primary underline text-sm mt-2"
                        >
                            + Adicionar set
                        </button>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={handleFinalize}
                className="fixed bottom-16 bg-primary text-white px-6 py-3 rounded-xl shadow-lg"
            >
                Finalizar sessão
            </button>
        </div>
    );
}
