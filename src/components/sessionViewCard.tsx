// components/SessionViewCard.tsx
"use client";

import { motion } from "framer-motion";

const setTypes = ["Warmup", "Feeder", "Work", "Top"];

interface Set {
  reps: number;
  weight: number;
  set_type: string;
}

interface Props {
  exerciseName: string;
  sets: Set[];
}

export default function SessionViewCard({ exerciseName, sets }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 border-2 border-primary"
    >
      <h3 className="font-semibold text-primary mb-2">{exerciseName}</h3>

      <div className="grid grid-cols-3 text-xs font-semibold text-primary mb-1">
        <span>Tipo</span>
        <span>Repetições</span>
        <span>Peso</span>
      </div>

      {sets.map((set, idx) => (
        <motion.div
          key={idx}
          layout
          className="grid grid-cols-3 gap-2 items-center text-sm mb-1"
        >
          <span>{set.set_type}</span>
          <span>{set.reps}</span>
          <span>{set.weight} kg</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
