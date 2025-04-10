"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "@/utils/storage";
import { getWorkoutExercisesByWorkoutId } from "@/services/workoutExercise";
import { getExercises } from "@/services/exercises";
import { motion } from "framer-motion";
import { getWorkoutSessionById } from "@/services/workoutSession";
import SessionComments from "@/components/sessionComments";
import Link from "next/link";
import SessionViewCard from "@/components/sessionViewCard";
import { format } from "date-fns";

export default function ViewSessionPage() {
  const { id: sessionId } = useParams();
  const router = useRouter();
  const [exercises, setExercises] = useState<any[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<any[]>([]);
  const [owner, setOwner] = useState<{ id: number; name: string } | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [sessionTitle, setSessionTitle] = useState<string>("Sessão");
  const [userId, setUserId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token || !sessionId) return;

      const [exerciseRes, workoutRes, sessionRes] = await Promise.all([
        getExercises(token),
        getWorkoutExercisesByWorkoutId(Number(sessionId), token),
        getWorkoutSessionById(Number(sessionId), token),
      ]);

      setNotes(sessionRes.notes || null);
      setOwner(sessionRes.owner);
      setCreatedAt(sessionRes.createdAt);
      setSessionTitle(sessionRes.title || "Sessão");
      setExerciseOptions(exerciseRes);
      setUserId(sessionRes.currentUserId);

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
      <div className="w-full flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">{sessionTitle}</h1>
          {owner && (
            <p className="text-sm text-gray-500">
              Sessão de {" "}
              <Link
                href={`/profile/${owner.id}/user`}
                className="text-primary font-semibold hover:underline"
              >
                {owner.name}
              </Link>
            </p>
          )}
          {notes && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg text-gray-400 mt-1 italic"
            >
              Notas📝:  {notes}
            </motion.p>
          )}
          {createdAt && (
            <p className="text-xs text-gray-400 mt-1">
              Criado em: {format(new Date(createdAt), "dd/MM/yyyy")}
            </p>
          )}
        </div>
        <button
          onClick={() => router.back()}
          className="text-sm px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
        >
          Voltar
        </button>
      </div>

      <motion.div
        layout
        className="w-full space-y-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {exercises.map((ex) => (
          <motion.div
            key={ex.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <SessionViewCard
              exerciseName={
                exerciseOptions.find((op: any) => op.id === ex.exerciseId)?.name ||
                "Exercício"
              }
              sets={ex.sets}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full mt-8"
      >
        <SessionComments
          sessionId={Number(sessionId)}
          showDeleteForUserId={userId}
        />


      </motion.div>
    </div>
  );
}
