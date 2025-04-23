"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

const setTypes = ["Warmup", "Feeder", "Work", "Top"];

type Set = {
  id?: number;
  reps: string;
  weight: string;
  set_type: string;
  order: number;
  done?: boolean;
};

type Props = {
  exerciseName: string;
  sets: Set[];
  onChange: (index: number, field: keyof Set, value: string | boolean) => void;
  onRemoveSet: (index: number) => void;
  onAddSet: () => void;
  onRemoveExercise: () => void;
  isAddingSet?: boolean;
};

export default function CardEditSession({
  exerciseName,
  sets,
  onChange,
  onRemoveSet,
  onAddSet,
  onRemoveExercise,
  isAddingSet,
}: Props) {
  const allDone = sets.length > 0 && sets.every((set) => set.done);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`border-2 rounded-xl p-4 transition-all duration-300 ${allDone ? "border-green-500 bg-green-50" : "border-primary"
        }`}
    >
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-primary">{exerciseName}</p>
        <button
          onClick={onRemoveExercise}
          className="bg-red-500 text-white-txt p-1 rounded-full hover:scale-105 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-4 text-xs font-semibold text-primary mb-2">
        <span>Tipo</span>
        <span>Repetições</span>
        <span>Peso (kg)</span>
        <span className="text-center">Feito</span>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {sets.map((set, idx) => (
            <motion.div
              key={set.id || idx}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="grid grid-cols-4 items-center gap-2"
            >
              <select
                value={set.set_type}
                onChange={(e) => onChange(idx, "set_type", e.target.value)}
                className="border border-primary rounded-xl p-2 text-sm"
              >
                {setTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={set.reps}
                onChange={(e) => onChange(idx, "reps", e.target.value)}
                className="border border-primary rounded-xl p-2 text-center"
                inputMode="numeric"
                pattern="[0-9]*"
              />

              <input
                type="text"
                value={set.weight}
                onChange={(e) => onChange(idx, "weight", e.target.value)}
                className="border border-primary rounded-xl p-2 text-center"
                inputMode="decimal"
                pattern="[0-9]*"
              />

              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => onChange(idx, "done", !set.done)}
                  className={`rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 ${set.done ? "bg-green-500 text-white-txt" : "border-2 border-primary text-primary"}`}
                >
                  {set.done ? <Check size={16} /> : null}
                </button>

                <motion.button
                  onClick={() => onRemoveSet(idx)}
                  className="rounded-full w-7 h-7 flex items-center justify-center bg-red-500 text-white-txt hover:scale-105 transition-all"
                  whileTap={{ scale: 0.85 }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={onAddSet}
        disabled={isAddingSet}
        className={`text-primary underline text-sm mt-3 transition-all ${isAddingSet ? "opacity-50 cursor-not-allowed" : ""
          }`}
        whileTap={{ scale: 0.95 }}
      >
        {isAddingSet ? "Adicionando..." : "+ Adicionar set"}
      </motion.button>
    </motion.div>
  );
}
