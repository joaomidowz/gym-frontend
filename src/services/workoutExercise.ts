import { API_URL } from "./api";

export async function addExerciseToWorkout(
  token: string,
  workout: {
    session_id: number;
    exercise_id: number;
    weight: number;
    reps: number;
    sets: number;
  }
) {
  const res = await fetch(`${API_URL}/workout-exercise`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(workout),
  });
  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao criar exercício");

  return data;
}

export async function getWorkoutExercises(token: string) {
  const res = await fetch(`${API_URL}/workout-exercise`, {
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

export async function getWorkoutExercisesByWorkoutId(
  workoutId: number,
  token: string
) {
  const res = await fetch(`${API_URL}/workout-exercise/workout/${workoutId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(
      data.error || data.message || "Erro ao buscar exercícios da sessão"
    );

  return data;
}

export async function deleteWorkoutExercise(exerciseId: number, token: string) {
  const res = await fetch(`${API_URL}/workout-exercise/${exerciseId}`, {
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

export async function updateWorkout(
  workoutId: number,
  token: string,
  updates: {
    weight?: number;
    reps?: number;
    sets?: number;
  }
) {
  const res = await fetch(`${API_URL}/workout-exercise/${workoutId}`, {
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
