// components/CardEditSession.tsx
"use client";

"use client";

import { motion } from "framer-motion";

const setTypes = ["Warmup", "Feeder", "Work", "Top"];

type Set = {
    id?: number;
    reps: string;
    weight: string;
    set_type: string;
    order: number;
};

type Props = {
    exerciseName: string;
    sets: Set[];
    onChange: (index: number, field: keyof Set, value: string) => void;
    onRemoveSet: (index: number) => void;
    onAddSet: () => void;
    onRemoveExercise: () => void;
};


export default function CardEditSession({
    exerciseName,
    sets,
    onChange,
    onRemoveSet,
    onAddSet,
    onRemoveExercise,
}: Props) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-primary rounded-xl p-4"
        >
            <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-primary">{exerciseName}</p>
                <button
                    onClick={onRemoveExercise}
                    className="ml-2 text-red-500 font-bold text-sm"
                >
                    Remover exercício
                </button>
            </div>

            <div className="grid grid-cols-3 text-xs font-semibold text-primary mb-2">
                <span>Tipo</span>
                <span>Repetições</span>
                <span>Peso (kg)</span>
            </div>

            <div className="space-y-2">
                {sets.map((set, idx) => (
                    <motion.div
                        key={set.id || idx}
                        layout
                        className="grid grid-cols-3 items-center gap-2"
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

                        <div className="flex items-center">
                            <input
                                type="text"
                                value={set.weight}
                                onChange={(e) => onChange(idx, "weight", e.target.value)}
                                className="border border-primary rounded-xl p-2 text-center w-full"
                                inputMode="decimal"
                                pattern="[0-9]*"
                            />
                            <button
                                onClick={() => onRemoveSet(idx)}
                                className="ml-2 text-red-500 text-sm font-semibold"
                            >
                                x
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={onAddSet}
                className="text-primary underline text-sm mt-3"
            >
                + Adicionar set
            </button>
        </motion.div>
    );
}
