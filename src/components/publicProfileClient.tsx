"use client";

import { useEffect, useState } from "react";
import { getUserById } from "@/services/user";
import { getSessionsByUserId } from "@/services/workoutSession";
import { getToken } from "@/utils/storage";
import { PublicUserProfile } from "./publicUserProfile";

type Props = {
    userId: string;
};

export default function PublicProfileClient({ userId }: Props) {
    const [user, setUser] = useState<any>(null);
    const [sessionCount, setSessionCount] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            if (!token) {
                setError("Token ausente.");
                return;
            }

            try {
                const [userRes, sessionsRes] = await Promise.all([
                    getUserById(Number(userId), token),
                    getSessionsByUserId(Number(userId), token),
                ]);

                setUser(userRes);
                setSessionCount(sessionsRes.length);
            } catch (err: any) {
                setError(err.message || "Erro ao carregar perfil");
            }
        };

        fetchData();
    }, [userId]);

    if (error)
        return <p className="text-center mt-10 text-red-500">{error}</p>;

    if (!user)
        return <p className="text-center mt-10 text-primary">Carregando perfil...</p>;

    return <PublicUserProfile user={user} sessionCount={sessionCount} />;
}
