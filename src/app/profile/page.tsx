"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getUserById, getStreak } from "@/services/user";
import { getSessionsByUserId } from "@/services/workoutSession";
import { UserProfile } from "@/components/userProfile";

export default function ProfilePage() {
  const { user, token, loading } = useAuth();
  const [userData, setUserData] = useState(user);
  const [sessionCount, setSessionCount] = useState(0);
  const [streak, setStreak] = useState<{
    current_streak: number;
    longest_streak: number;
    last_workout_date: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !token) return;

      try {
        const freshUser = await getUserById(user.id, token);
        const sessions = await getSessionsByUserId(user.id, token);
        const streakRes = await getStreak(token);

        setUserData(freshUser);
        setSessionCount(sessions.length);
        setStreak(streakRes);
      } catch (error) {
        console.error("Erro ao carregar perfil do usuário logado:", error);
      }
    };

    fetchUser();
  }, [user, token]);

  if (loading) return <p className="text-center mt-10 text-primary">Carregando...</p>;
  if (!userData) return <p className="text-center mt-10 text-red-500">Usuário não encontrado.</p>;

  return (
    <UserProfile
      user={userData}
      sessionCount={sessionCount}
      isOwnProfile
      streak={streak}
    />
  );
}
