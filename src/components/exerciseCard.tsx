import { FaDumbbell, FaWeightHanging, FaRedo } from "react-icons/fa";

interface Props {
    name: string;
    description?: string;
    pr_weight?: number;
    pr_reps?: number;
}

export default function ExerciseCard({ name, description, pr_weight, pr_reps }: Props) {
    return (
        <div className="bg-white border border-primary rounded-2xl p-4 shadow-sm hover:shadow-md transition text-primary">
            <div className="flex items-center gap-2 mb-1">
                <FaDumbbell className="text-primary" />
                <h2 className="text-lg font-bold truncate">{name}</h2>
            </div>

            {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}

            {(pr_weight || pr_reps) && (
                <div className="mt-3 text-sm flex flex-col gap-1">
                    {pr_weight !== undefined && (
                        <div className="flex items-center gap-2">
                            <FaWeightHanging className="text-yellow-600" />
                            <span className="font-medium">PR de Peso:</span>
                            <span>{pr_weight} kg</span>
                        </div>
                    )}

                    {pr_reps !== undefined && (
                        <div className="flex items-center gap-2">
                            <FaRedo className="text-gray-500" />
                            <span className="font-medium">PR de Reps:</span>
                            <span>{pr_reps} reps</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 