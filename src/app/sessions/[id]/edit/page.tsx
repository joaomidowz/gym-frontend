// removed automatic refresh from updateSet

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
import { getWorkoutSessionById, updateWorkoutSession } from "@/services/workoutSession";
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

export default function EditSession() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<any[]>([]);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const router = useRouter();
  const { id: sessionId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token || !sessionId) return;

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
          exerciseId: item.exercise?.id?.toString() || item.exercise_id?.toString() || "",
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
  }, [sessionId]);

  const handleUpdateField = async (
    field: "title" | "notes" | "is_public",
    value: string | boolean
  ) => {
    const token = getToken();
    if (!token || !sessionId) return;

    try {
      await updateWorkoutSession(Number(sessionId), token, {
        [field]: value,
      });

      if (field === "title") setSessionTitle(String(value));
      if (field === "notes") setNotes(String(value));
      if (field === "is_public") setIsPublic(Boolean(value));
    } catch (err) {
      console.error("Erro ao atualizar campo da sessão:", err);
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
    const token = getToken();
    const ex = exercises.find((e) => e.id === exerciseId);
    if (!token || !ex || !sessionId || !ex.exerciseId) return;

    try {
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

  const handleFinalize = () => {
    router.push("/sessions");
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto text-primary pb-32">
      <div className="w-full space-y-4 mb-6">
        <input
          className="w-full text-xl font-bold bg-transparent border-b-2 border-primary outline-none"
          placeholder="Título da sessão"
          value={sessionTitle}
          onChange={(e) => handleUpdateField("title", e.target.value)}
        />

        <textarea
          className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-700"
          placeholder="Notas sobre o treino (opcional)"
          value={notes}
          onChange={(e) => handleUpdateField("notes", e.target.value)}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Sessão pública?</span>
          <button
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isPublic ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
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
