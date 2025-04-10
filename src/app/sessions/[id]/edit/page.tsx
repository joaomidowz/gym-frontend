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
import { motion } from "framer-motion";
import ExerciseSearch from "@/components/exerciseSearch";

const setTypes = ["Warmup", "Feeder", "Work", "Top"];

type Set = {
  id?: number;
  reps: string;
  weight: string;
  set_type: string;
  order: number;
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
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
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
          sets: (item.workout_sets || []).map((s: any) => ({
            id: s.id,
            reps: s.reps?.toString() || "0",
            weight: s.weight?.toString() || "0",
            set_type: s.set_type || "Work",
            order: s.order || 1,
          })),
        }));

        setExercises(formatted);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchData();
  }, [sessionId]);

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
      let workoutExerciseId = ex.backendId;

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
          ? { ...e, sets: e.sets.filter((_, i) => i !== index) }
          : e
      )
    );
  };

  const removeExercise = async (exerciseId: number) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));

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
  };

  const updateSet = async (
    exerciseId: number,
    setIndex: number,
    field: keyof Set,
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
  
        const updatedSets = [...ex.sets];
        const updatedSet = { ...updatedSets[setIndex], [field]: value };
        updatedSets[setIndex] = updatedSet;
  
        return { ...ex, sets: updatedSets };
      })
    );
  
    const token = getToken();
    const exercise = exercises.find((ex) => ex.id === exerciseId);
  
    const setToUpdate = exercise?.sets[setIndex];
    if (!setToUpdate?.id || !token) return;
  
    try {
      await updateWorkoutSet(setToUpdate.id, token, {
        [field]:
          field === "order"
            ? Math.max(1, Number(value) || 1)
            : field === "weight" || field === "reps"
              ? Number(value)
              : value,
      });
  
      // 👇 Buscar novamente os dados atualizados do exercício
      const workoutRes = await getWorkoutExercisesByWorkoutId(
        Number(sessionId),
        token
      );
  
      const formatted = workoutRes.map((item: any) => ({
        id: Date.now() + item.id,
        backendId: item.id,
        exerciseId: item.exercise.id.toString(),
        sets: (item.workout_sets || [])
          .sort((a: any, b: any) => a.order - b.order) // garante que vem ordenado
          .map((s: any) => ({
            id: s.id,
            reps: s.reps?.toString() || "0",
            weight: s.weight?.toString() || "0",
            set_type: s.set_type || "Work",
            order: s.order || 1,
          })),
      }));
  
      setExercises((prev) =>
        prev.map((ex) =>
          ex.backendId === exercise?.backendId
            ? formatted.find((f) => f.backendId === ex.backendId) || ex
            : ex
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar set:", err);
    }
  };
  

  const handleFinalize = () => {
    router.push("/sessions");
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto text-primary pb-32">
      <h1 className="text-2xl font-bold mb-4">Adicionar Exercícios</h1>

      <button
        onClick={() => setShowExerciseSearch(true)}
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
              <p className="font-semibold text-primary">
                {
                  exerciseOptions.find((op: any) => op.id.toString() === ex.exerciseId)
                    ?.name || "Exercício"
                }
              </p>
              <button
                className="ml-2 text-red-500 font-bold"
                onClick={() => removeExercise(ex.id)}
              >
                X
              </button>
            </div>

            {ex.sets.map((set, idx) => (
              <div key={idx} className="flex flex-col mb-2">
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <label className="block text-xs mb-1">Ordem</label>
                    <input
                      type="number"
                      value={set.order || 1}
                      onChange={(e) =>
                        updateSet(ex.id, idx, "order", e.target.value)
                      }
                      className="w-full border border-primary p-2 rounded-xl"
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-xs mb-1">Repetições</label>
                    <input
                      type="number"
                      value={set.reps || "0"}
                      onChange={(e) =>
                        updateSet(ex.id, idx, "reps", e.target.value)
                      }
                      className="w-full border border-primary p-2 rounded-xl"
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-xs mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      value={set.weight || "0"}
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

      {/* Exercício Search Modal */}
      <ExerciseSearch
        isOpen={showExerciseSearch}
        onClose={() => setShowExerciseSearch(false)}
        onSelect={handleAddExerciseFromModal}
      />
    </div>
  );
}
