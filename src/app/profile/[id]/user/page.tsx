"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserById, getUserStreakById } from "@/services/user";
import { getSessionsByUserId } from "@/services/workoutSession";
import { getToken } from "@/utils/storage";
import { PublicUserProfile } from "@/components/publicUserProfile";

export default function PublicProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [streak, setStreak] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        setError("Token ausente.");
        return;
      }

      try {
        const userData = await getUserById(Number(id), token);
        const sessions = await getSessionsByUserId(Number(id), token);
        const streakData = await getUserStreakById(Number(id)); // ✅

        setUser(userData);
        setSessionCount(sessions.length);
        setStreak(streakData);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar perfil.");
      }
    };

    fetchData();
  }, [id]);

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-10 text-primary">Carregando perfil...</p>;

  return <PublicUserProfile user={user} sessionCount={sessionCount} streak={streak} />;
}
