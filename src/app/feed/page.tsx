"use client";

import { useEffect, useState } from "react";
import { getFeed } from "@/services/workoutSession";
import SessionCard from "@/components/sessionCard";
import { getToken } from "@/utils/storage";
import SearchOverlay from "@/components/searchOverlay";

export default function FeedPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const token = getToken();
                if (!token) {
                    setError("Usuário não autenticado.");
                    return;
                }

                const res = await getFeed(token);
                setSessions(res.sessions);
            } catch (err: any) {
                setError("Erro ao carregar feed.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    return (
        <>
            <SearchOverlay />
            <div className="p-4 pb-16">
                {loading && <p className="text-primary">Carregando...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {sessions.length === 0 && !loading && <p>Nenhuma sessão encontrada.</p>}
                {sessions.map((session: any) => (
                    <SessionCard
                        key={session.id}
                        title={session.title}
                        user={session.owner} // <-- mudamos para 'owner' aqui
                        like_count={session.like_count}
                        comments_count={session.comments_count}
                        total_sets={session.total_sets}
                        total_weight={session.total_weight}
                    />
                ))}
            </div>
        </>
    );
}
