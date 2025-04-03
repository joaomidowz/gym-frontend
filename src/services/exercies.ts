import { API_URL } from "./api";

export async function createExercise(
  token: string,
  exercise: {
    name: string;
    description?: string;
    is_global?: string;
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
    throw new Error(data.error || data.message || "Erro ao criar exerício");

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
  
