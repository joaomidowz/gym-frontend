"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "@/utils/storage";
import { getWorkoutExercisesByWorkoutId } from "@/services/workoutExercise";
import { getExercises } from "@/services/exercises";
import { motion } from "framer-motion";
import SessionComments from "@/components/sessionComments";

export default function ViewSessionPage() {
  const { id: sessionId } = useParams();
  const router = useRouter();
  const [exercises, setExercises] = useState<any[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token || !sessionId) return;

      const [exerciseRes, workoutRes] = await Promise.all([
        getExercises(token),
        getWorkoutExercisesByWorkoutId(Number(sessionId), token),
      ]);

      setExerciseOptions(exerciseRes);

      const formatted = workoutRes.map((item: any) => ({
        id: item.id,
        exerciseId: item.exercise.id,
        sets: item.workout_sets || [],
      }));

      setExercises(formatted);
    };

    fetchData();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto text-primary pb-32">
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Visualizar Sessão</h1>
        <button
          onClick={() => router.back()}
          className="text-sm px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
        >
          Voltar
        </button>
      </div>

      <div className="w-full space-y-6">
        {exercises.map((ex) => (
          <motion.div
            key={ex.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-primary rounded-xl p-4"
          >
            <div className="mb-2 font-semibold text-primary">
              {
                exerciseOptions.find((op: any) => op.id === ex.exerciseId)
                  ?.name || "Exercício"
              }
            </div>

            {ex.sets.map((set: any, idx: number) => (
              <div key={idx} className="flex flex-col mb-2 text-sm">
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <p className="text-xs text-gray-500 mb-1">Ordem</p>
                    <p>{set.order}</p>
                  </div>
                  <div className="w-1/3">
                    <p className="text-xs text-gray-500 mb-1">Repetições</p>
                    <p>{set.reps}</p>
                  </div>
                  <div className="w-1/3">
                    <p className="text-xs text-gray-500 mb-1">Peso</p>
                    <p>{set.weight} kg</p>
                  </div>
                </div>
                <p className="text-xs mt-1">
                  Tipo: <strong>{set.set_type}</strong>
                </p>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      <SessionComments sessionId={Number(sessionId)} />
    </div>
  );
}
