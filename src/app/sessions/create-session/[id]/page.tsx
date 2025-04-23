// app/sessions/create-session/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getExercises } from "@/services/exercises";
import { getToken } from "@/utils/storage";
import {
    createWorkoutExercise,
    createWorkoutSet,
    deleteWorkoutExercise,
    deleteWorkoutSet,
    getWorkoutExercisesByWorkoutId,
    updateWorkoutSet,
} from "@/services/workoutExercise";
import {
    getWorkoutSessionById,
    updateWorkoutSession,
} from "@/services/workoutSession";
import TimerEditable from "@/components/timerEditable";
import ExerciseSearch from "@/components/exerciseSearch";
import CardEditSession from "@/components/cardEditSession";
import { AnimatePresence, motion } from "framer-motion";

// Types

type Set = {
    id?: number;
    reps: string;
    weight: string;
    set_type: string;
    order: number;
    done?: boolean;
};

type Exercise = {
    name: string;
    id: number;
    backendId?: number;
    exerciseId: string;
    sets: Set[];
};

let debounceTitle: NodeJS.Timeout;
let debounceNotes: NodeJS.Timeout;

export default function CreateSessionWithTimer() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exerciseOptions, setExerciseOptions] = useState<any[]>([]);
    const [showExerciseSearch, setShowExerciseSearch] = useState(false);
    const [sessionTitle, setSessionTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [seconds, setSeconds] = useState(0);
    const [isAddingSetId, setIsAddingSetId] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const router = useRouter();
    const { id: sessionId } = useParams();

    useEffect(() => {
        let savedStart = null;
        try {
            savedStart = localStorage.getItem("gymApp_session_start");
        } catch (e) {
            console.warn("Erro ao acessar localStorage", e);
        }

        let startTimestamp = Date.now();

        if (savedStart) {
            const diff = Math.floor((Date.now() - Number(savedStart)) / 1000);
            setSeconds(diff);
            setStartTime(Number(savedStart));
            startTimestamp = Number(savedStart);
        } else {
            localStorage.setItem("gymApp_session_start", startTimestamp.toString());
            setStartTime(startTimestamp);
        }

        const interval = setInterval(() => {
            const saved = localStorage.getItem("gymApp_session_start");
            if (saved) {
                const diff = Math.floor((Date.now() - Number(saved)) / 1000);
                setSeconds(diff);
            }
        }, 1000);

        const token = getToken();
        if (!token || !sessionId) return;
        const fetchData = async () => {
            try {
                const [exerciseRes, workoutRes, sessionRes] = await Promise.all([
                    getExercises(token),
                    getWorkoutExercisesByWorkoutId(Number(sessionId), token),
                    getWorkoutSessionById(Number(sessionId), token),
                ]);

                setExerciseOptions(exerciseRes);
                setSessionTitle(sessionRes.title || "");
                setNotes(sessionRes.notes || "");
                setIsPublic(sessionRes.is_public);

                const formatted = workoutRes.map((item: any) => ({
                    id: Date.now() + item.id,
                    backendId: item.id,
                    exerciseId:
                        item.exercise?.id?.toString() ||
                        item.exercise_id?.toString() ||
                        "",
                    name: item.exercise?.name || item.name || "Exercício",
                    sets: (item.workout_sets || []).map((s: any) => ({
                        id: s.id,
                        reps: s.reps?.toString() || "0",
                        weight: s.weight?.toString() || "0",
                        set_type: s.set_type || "Work",
                        order: s.order || 1,
                        done: s.done || false,
                    })),
                }));

                setExercises(formatted);
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
            }
        };

        fetchData();
        return () => clearInterval(interval);
    }, [sessionId]);

    useEffect(() => {
        const updateOnFocus = () => {
          const saved = localStorage.getItem("gymApp_session_start");
          if (saved) {
            const diff = Math.floor((Date.now() - Number(saved)) / 1000);
            setSeconds(diff);
          }
        };
      
        window.addEventListener("app:focus", updateOnFocus);
        return () => {
          window.removeEventListener("app:focus", updateOnFocus);
        };
      }, []);      

    const debounceUpdateField = (field: "title" | "notes", value: string) => {
        const token = getToken();
        if (!token || !sessionId) return;

        const setFunction = field === "title" ? setSessionTitle : setNotes;
        const timer = field === "title" ? debounceTitle : debounceNotes;

        setFunction(value);
        clearTimeout(timer);

        const newTimer = setTimeout(async () => {
            try {
                await updateWorkoutSession(Number(sessionId), token, {
                    [field]: value,
                });
            } catch (err) {
                console.error(`Erro ao atualizar ${field}:`, err);
            }
        }, 400);

        if (field === "title") debounceTitle = newTimer;
        if (field === "notes") debounceNotes = newTimer;
    };

    const handleUpdateField = async (
        field: "is_public",
        value: boolean
    ) => {
        const token = getToken();
        if (!token || !sessionId) return;

        try {
            await updateWorkoutSession(Number(sessionId), token, {
                [field]: value,
            });
            setIsPublic(value);
        } catch (err) {
            console.error("Erro ao atualizar visibilidade:", err);
        }
    };

    const handleAddExerciseFromModal = async (exercise: any) => {
        const token = getToken();
        if (!token || !sessionId) return;

        try {
            const created = await createWorkoutExercise(token, {
                workout_session_id: Number(sessionId),
                exercise_id: Number(exercise.id),
            });

            setExercises((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    backendId: created.id,
                    exerciseId: exercise.id.toString(),
                    name: created.name,
                    sets: [],
                },
            ]);
        } catch (err) {
            console.error("Erro ao adicionar exercício:", err);
        }
    };

    const addSet = async (exerciseId: number) => {
        if (isAddingSetId === exerciseId) return; // Evita múltiplos cliques

        const token = getToken();
        const ex = exercises.find((e) => e.id === exerciseId);
        if (!token || !ex || !sessionId || !ex.exerciseId) return;

        try {
            setIsAddingSetId(exerciseId); // Ativa flag

            const workoutExerciseId = ex.backendId;
            if (!workoutExerciseId) return;

            const newSet = await createWorkoutSet(token, {
                workout_exercise_id: workoutExerciseId,
                workout_session_id: Number(sessionId),
                weight: 0,
                reps: 0,
                set_type: "Work",
                order: ex.sets.length + 1,
            });

            setExercises((prev) =>
                prev.map((e) =>
                    e.id === exerciseId
                        ? {
                            ...e,
                            sets: [
                                ...e.sets,
                                {
                                    id: newSet.set.id,
                                    reps: newSet.set.reps.toString(),
                                    weight: newSet.set.weight.toString(),
                                    set_type: newSet.set.set_type,
                                    order: newSet.set.order,
                                    done: false,
                                },
                            ],
                        }
                        : e
                )
            );
        } catch (err) {
            console.error("Erro ao adicionar set:", err);
        } finally {
            setIsAddingSetId(null); // Libera flag
        }
    };


    const deleteSet = async (exerciseId: number, index: number) => {
        const ex = exercises.find((e) => e.id === exerciseId);
        if (!ex) return;

        const setToDelete = ex.sets[index];
        if (setToDelete?.id) {
            try {
                const token = getToken();
                if (token) {
                    await deleteWorkoutSet(setToDelete.id, token);
                }
            } catch (err) {
                console.error("Erro ao excluir set:", err);
            }
        }

        setExercises((prev) =>
            prev.map((e) =>
                e.id === exerciseId
                    ? {
                        ...e,
                        sets: e.sets.filter((_, i) => i !== index),
                    }
                    : e
            )
        );
    };

    const removeExercise = async (exerciseId: number) => {
        const backendId = exercises.find((ex) => ex.id === exerciseId)?.backendId;
        if (!backendId) return;

        const token = getToken();
        if (token) {
            try {
                await deleteWorkoutExercise(backendId, token);
            } catch (err) {
                console.error("Erro ao deletar exercício:", err);
            }
        }

        setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
    };

    const updateSet = async (
        exerciseId: number,
        setIndex: number,
        field: keyof Set,
        value: string | boolean
    ) => {
        const payload: any = {
            [field]:
                field === "order"
                    ? Math.max(1, Number(value) || 1)
                    : field === "weight" || field === "reps"
                        ? Number(value)
                        : field === "done"
                            ? Boolean(value === "true" || value === true)
                            : value,
        };

        setExercises((prev) =>
            prev.map((ex) => {
                if (ex.id !== exerciseId) return ex;

                const updatedSets = [...ex.sets];
                const updatedSet = { ...updatedSets[setIndex], [field]: payload[field] };
                updatedSets[setIndex] = updatedSet;

                return { ...ex, sets: updatedSets };
            })
        );

        const token = getToken();
        const exercise = exercises.find((ex) => ex.id === exerciseId);
        const setToUpdate = exercise?.sets[setIndex];
        if (!setToUpdate?.id || !token) return;

        try {
            await updateWorkoutSet(setToUpdate.id, token, payload);
        } catch (err) {
            console.error("Erro ao atualizar set:", err);
        }
    };

    const handleFinalize = async () => {
        const token = getToken();
        if (!token || !sessionId) return;

        try {
            await updateWorkoutSession(Number(sessionId), token, {
                duration_seconds: seconds,
            });
            localStorage.removeItem("gymApp_session_start");
            router.push(`/sessions/${sessionId}/edit`);
        } catch (err) {
            console.error("Erro ao finalizar sessão:", err);
        }
    };

    const formatTime = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h}h ${m}min ${sec}s`;
    };

    return (
        <div className="flex flex-col items-center p-6 max-w-md mx-auto text-primary pb-32">
            <TimerEditable
                initialSeconds={0}
                onChange={(s) => setSeconds(s)}
            />

            <div className="w-full space-y-4 mb-6">
                <input
                    className="w-full text-xl font-bold bg-transparent border-b-2 border-primary outline-none"
                    placeholder="Título da sessão"
                    value={sessionTitle}
                    onChange={(e) => debounceUpdateField("title", e.target.value)}
                />

                <textarea
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-700"
                    placeholder="Notas sobre o treino (opcional)"
                    value={notes}
                    onChange={(e) => debounceUpdateField("notes", e.target.value)}
                />

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sessão pública?</span>
                    <button
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isPublic ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}
                        onClick={() => handleUpdateField("is_public", !isPublic)}
                    >
                        {isPublic ? "Pública" : "Privada"}
                    </button>
                </div>
            </div>

            <button
                onClick={() => setShowExerciseSearch(true)}
                className="bg-primary text-white px-4 py-2 rounded-xl mb-6"
            >
                + Adicionar Exercício
            </button>

            <div className="w-full space-y-6">
                <AnimatePresence>
                    {exercises.map((ex) => (
                        <motion.div
                            key={ex.id}
                            layout
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CardEditSession
                                exerciseName={
                                    ex.name ||
                                    exerciseOptions.find((op: any) => op.id.toString() === ex.exerciseId)?.name ||
                                    "Exercício"
                                }
                                sets={ex.sets}
                                onChange={(index, field, value) =>
                                    updateSet(ex.id, index, field as keyof Set, value)
                                }
                                onRemoveSet={(index) => deleteSet(ex.id, index)}
                                onAddSet={() => addSet(ex.id)}
                                onRemoveExercise={() => removeExercise(ex.id)}
                                isAddingSet={isAddingSetId === ex.id}
                            />

                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <button
                onClick={handleFinalize}
                className="fixed bottom-16 bg-primary text-white px-6 py-3 rounded-xl shadow-lg"
            >
                Finalizar sessão
            </button>

            <ExerciseSearch
                isOpen={showExerciseSearch}
                onClose={() => setShowExerciseSearch(false)}
                onSelect={handleAddExerciseFromModal}
            />
        </div>
    );
}