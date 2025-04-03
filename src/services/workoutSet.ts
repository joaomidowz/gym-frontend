import { API_URL } from "./api";

export async function createWorkoutSet(
  exerciseId: number,
  token: string,
  set: {
    weight: number;
    reps: number;
  }
) {
  const res = await fetch(`${API_URL}/workout-set/${exerciseId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(set),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao criar set");

  return data;
}

export async function getWorkoutSetsByExercise(
  exerciseId: number,
  token: string
) {
  const res = await fetch(`${API_URL}/workout-set/${exerciseId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || data.message || "Erro ao ver set");

  return data;
}

export async function updateWorkoutSet(
  setId: number,
  token: string,
  set: {
    weight: number;
    reps: number;
  }
) {
  const res = await fetch(`${API_URL}/workout-set/${setId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(set),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao editar set");

  return data;
}

export async function deleteWorkoutSet(setId: number, token: string) {
  const res = await fetch(`${API_URL}/workout-set/${setId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao deletar set");

  return data;
}
