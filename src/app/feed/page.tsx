"use client";

import { useEffect, useState } from "react";
import { getFeed } from "@/services/workoutSession";
import { getToken } from "@/utils/storage";
import SearchOverlay from "@/components/searchOverlay";
import { likeSession, unlikeSession } from "@/services/social";
import { useRouter } from "next/navigation";
import SessionCardFeed from "@/components/sessionCardFeed";
import { motion } from "framer-motion";

type Session = {
    id: number;
    title: string;
    user: {
        id: number;
        name: string;
        is_public: boolean;
    };
    duration_seconds?: number;
    like_count: number;
    comments_count: number;
    total_sets: number;
    total_weight: number;
    createdAt: Date;
    is_liked: boolean;
    prs?: []
};

export default function FeedPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<Session[]>([]);
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

    async function handleToggleLike(sessionId: number) {
        const token = getToken();
        if (!token) return;

        setSessions((prev) =>
            prev.map((s: any) =>
                s.id === sessionId
                    ? {
                        ...s,
                        is_liked: !s.is_liked,
                        like_count: s.is_liked ? s.like_count - 1 : s.like_count + 1,
                    }
                    : s
            )
        );

        try {
            const session = sessions.find((s: any) => s.id === sessionId);
            if (session?.is_liked) {
                await unlikeSession(sessionId, token);
            } else {
                await likeSession(sessionId, token);
            }
        } catch (err) {
            console.error("Erro ao curtir/descurtir:", err);

            // Rollback
            setSessions((prev) =>
                prev.map((s: any) =>
                    s.id === sessionId
                        ? {
                            ...s,
                            is_liked: !s.is_liked,
                            like_count: s.is_liked ? s.like_count - 1 : s.like_count + 1,
                        }
                        : s
                )
            );
        }
    }

    return (
        <>
            <SearchOverlay />
            <div className="p-4 pb-16">
                {loading && <p className="text-primary">Carregando...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {sessions.length === 0 && !loading && <p>Nenhuma sessão encontrada.</p>}
                {sessions.map((session, index) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                    >
                        <SessionCardFeed
                            sessionId={session.id}
                            title={session.title}
                            prs={session.prs}
                            user={session.user}
                            duration_seconds={session.duration_seconds}
                            like_count={session.like_count}
                            comments_count={session.comments_count}
                            total_sets={session.total_sets}
                            total_weight={session.total_weight}
                            onLike={() => handleToggleLike(session.id)}
                            isLiked={session.is_liked}
                            createdAt={session.createdAt.toString()}
                            onClick={() => router.push(`/feed/${session.id}/session`)}
                        />
                    </motion.div>
                ))}
            </div>
        </>
    );
}