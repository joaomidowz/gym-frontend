import { API_URL } from "./api";

export async function createWorkout(
  token: string,
  session: {
    title: string;
    notes?: string;
    date?: string;
    is_public?: boolean;
    duration_seconds?: number;
  }
) {
  const res = await fetch(`${API_URL}/workout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(session),
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao criar sessão");

  return data;
}

export async function getFeed(token: string) {
  const res = await fetch(`${API_URL}/feed`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Erro ao carregar feed");

  return data;
}

export async function getMyWorkoutSession(token: string) {
  const res = await fetch(`${API_URL}/workout-session`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao buscar sessões");

  return data;
}

export async function getUserWorkoutSession(userId: number, token: string) {
  const res = await fetch(`${API_URL}/user/${userId}/session`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao buscar sessões");

  return data;
}

export async function getWorkoutSessionById(sessionId: number, token: string) {
  const res = await fetch(`${API_URL}/workout-session/${sessionId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao buscar sessão");

  return data;
}

export async function deleteWorkoutSession(sessionId: number, token: string) {
  const res = await fetch(`${API_URL}/workout-session/${sessionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || data.message || "Erro ao deletar sessão");
  }

  return true;
}

export async function updateWorkoutSession(
  sessionId: number,
  token: string,
  updates: {
    title?: string;
    date?: string;
    is_public?: boolean;
    duration_seconds?: number;
  }
) {
  const res = await fetch(`${API_URL}/workout-session/${sessionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao atualizar sessão");

  return data;
}

export async function searchSession(query: string, token: string) {
  const res = await fetch(`${API_URL}/workout-session/search?query=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Erro ao buscar usuário");

  return data;
}

export async function getSessionsByUserId(userId: number, token: string) {
  const res = await fetch(`${API_URL}/workout-session/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao buscar sessões do usuário");

  return data;
}
