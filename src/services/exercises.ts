import { API_URL } from "./api";

export async function createExercise(
  token: string,
  exercise: {
    name: string;
    description?: string;
    is_global?: boolean;
  }
) {
  const res = await fetch(`${API_URL}/exercises`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(exercise),
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao criar exercício");

  return data;
}

export async function getExercises(token: string) {
  const res = await fetch(`${API_URL}/exercises`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao buscar exerício");

  return data;
}

export async function deleteExercise(exerciseId: number, token: string) {
  const res = await fetch(`${API_URL}/exercises/${exerciseId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || data.message || "Erro ao deletar exercício");
  }

  return true;
}

export async function getExercisesById(id: number, token: string) {
  const res = await fetch(`${API_URL}/exercises/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao buscar exerício");

  return data;
}

export async function updateExercise(
  id: number,
  token: string,
  updates: {
    name?: string;
    description?: string;
    is_global?: boolean;
  }
) {
  const res = await fetch(`${API_URL}/exercises/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(
      data.error || data.message || "Erro ao atualizar exercício"
    );

  return data;
}

export async function searchExercise(query: string, token: string) {
  const res = await fetch(`${API_URL}/exercises/search?query=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Erro ao buscar exercícios');

  return data;
}