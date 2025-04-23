"use client";

import { useState } from "react";
import { updateExercise, deleteExercise, muscleGroups } from "@/services/exercises";
import { getToken } from "@/utils/storage";
import { SuccessToast } from "@/components/successToast";
import ErrorNotify from "@/components/errorNotify";

export default function AdminExerciseCard({ exercise, onUpdate }: {
    exercise: any;
    onUpdate: () => void;
}) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: exercise.name,
        description: exercise.description || "",
        muscle_group: exercise.muscle_group,
        is_global: exercise.is_global,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        const token = getToken();
        if (!token) return;
        setLoading(true);
        setError("");
        try {
            await updateExercise(exercise.id, token, formData);
            setEditMode(false);
            setSuccess(true);
            onUpdate();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm("Tem certeza que deseja excluir este exercício?");
        if (!confirm) return;
        const token = getToken();
        if (!token) return;
        try {
            await deleteExercise(exercise.id, token);
            onUpdate();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-primary shadow text-sm space-y-2">
            {error && <ErrorNotify message={error} onClose={() => setError("")} />}
            {success && <SuccessToast message="Exercício atualizado com sucesso!" />}

            {editMode ? (
                <>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Nome"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Descrição"
                    />
                    <select
                        name="muscle_group"
                        value={formData.muscle_group}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                    >
                        {muscleGroups.map((group) => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                    <label className="flex items-center gap-2 mt-1">
                        <input
                            type="checkbox"
                            name="is_global"
                            checked={formData.is_global}
                            onChange={handleChange}
                        />
                        Global
                    </label>
                    <div className="flex gap-2 mt-2">
                        <button
                            className="flex-1 bg-gray-200 rounded-xl py-1"
                            onClick={() => setEditMode(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            className="flex-1 bg-primary text-white-txt rounded-xl py-1"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            Salvar
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p><strong>Nome:</strong> {exercise.name}</p>
                    <p><strong>Grupo muscular:</strong> {exercise.muscle_group}</p>
                    {exercise.description && <p><strong>Descrição:</strong> {exercise.description}</p>}
                    <p className="text-xs text-gray-500">
                        {exercise.is_global ? "Exercício global" : "Criado por usuário"}
                    </p>
                    <div className="flex gap-2 mt-2">
                        <button
                            className="flex-1 bg-primary text-white-txt rounded-xl py-1"
                            onClick={() => setEditMode(true)}
                        >
                            Editar
                        </button>
                        <button
                            className="flex-1 bg-red-500 text-white-txt rounded-xl py-1"
                            onClick={handleDelete}
                        >
                            Excluir
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
