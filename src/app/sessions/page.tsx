"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyWorkoutSession, deleteWorkoutSession } from "@/services/workoutSession";
import SessionCardSessions from "@/components/sessionCardSessions";
import { getToken } from "@/utils/storage";
import { motion } from "framer-motion";
import ConfirmationModal from "@/components/confirmationModal";

export default function SessionPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserSessions = async () => {
            try {
                const token = getToken();
                if (!token) {
                    setError("Usuário não autenticado.");
                    return;
                }

                const res = await getMyWorkoutSession(token);
                setSessions(res);
            } catch (err: any) {
                setError("Erro ao carregar suas sessões.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserSessions();
    }, []);

    const handleDeleteSession = async () => {
        if (sessionToDelete === null) return;

        const token = getToken();
        if (!token) return;

        try {
            await deleteWorkoutSession(sessionToDelete, token);
            setSessions((prev) => prev.filter((session: any) => session.id !== sessionToDelete));
            setIsModalOpen(false);
        } catch (err) {
            console.error("Erro ao excluir a sessão:", err);
        }
    };

    const openModal = (sessionId: number) => {
        setSessionToDelete(sessionId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSessionToDelete(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <nav className="flex items-center justify-between p-4 pb-2">
                <h1 className="text-2xl text-primary font-bold">Minhas Sessões</h1>
                <button
                    onClick={() => router.push("sessions/create-session")}
                    className="bg-primary text-white text-sm sm:text-base px-4 py-2 rounded-2xl hover:bg-primary/80 transition"
                >
                    Criar sessão
                </button>
            </nav>

            <div className="p-4 pb-16">
                {loading && <p className="text-primary">Carregando...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && sessions.length === 0 && (
                    <p className="text-gray-500">Nenhuma sessão encontrada.</p>
                )}
                {sessions.map((session: any, index) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <SessionCardSessions
                            id={session.id}
                            title={session.title}
                            user={session.user}
                            like_count={session.like_count}
                            comments_count={session.comments_count}
                            total_sets={session.total_sets}
                            total_weight={session.total_weight}
                            createdAt={session.createdAt}
                            onDelete={() => openModal(session.id)}
                        />

                    </motion.div>
                ))}
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleDeleteSession}
                message="Você está prestes a excluir essa sessão. Isso não poderá ser desfeito."
            />
        </>
    );
}
