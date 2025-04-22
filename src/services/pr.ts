import { API_URL } from "./api";

export async function getPRsBySession(sessionId: number, token: string) {
  const res = await fetch(`${API_URL}/workout-session/${sessionId}/prs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || "Erro ao buscar PRs da sessão");

  return data as {
    id: number;
    pr_type: "weight" | "reps";
    value: number;
    exercise_id: number;
    exercise: {
      id: number;
      name: string;
      muscle_group: string;
    };
  }[];
}
