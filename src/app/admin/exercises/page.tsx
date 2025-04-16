"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/utils/storage";
import { getExercises } from "@/services/exercises";
import { useAuth } from "@/hooks/useAuth";
import AdminExerciseCard from "@/components/adminExerciseCard";

export default function AdminExercisesPage() {
    const { user, loading } = useAuth();
    const [exercises, setExercises] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(false);

    const fetchExercises = async () => {
        const token = getToken();
        if (!token) return;
        const res = await getExercises(token);
        setExercises(res);
    };

    useEffect(() => {
        fetchExercises();
    }, [refresh]);

    if (loading) return <p className="text-center mt-10">Carregando...</p>;
    if (!user?.is_admin) return <p className="text-center mt-10 text-red-500">Acesso negado.</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto text-primary">
            <h1 className="text-2xl font-bold mb-6">Painel de Exercícios (Admin)</h1>

            <div className="space-y-4">
                {exercises.map((ex) => (
                    <AdminExerciseCard key={ex.id} exercise={ex} onUpdate={() => setRefresh((prev) => !prev)} />
                ))}
            </div>
        </div>
    );
}