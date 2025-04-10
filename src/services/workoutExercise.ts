import { API_URL } from "./api";

const setTypes = ["Warmup", "Feeder", "Work", "Top"];

export async function createWorkoutExercise(
  token: string,
  data: {
    workout_session_id: number;
    exercise_id: number;
  }
) {
  const res = await fetch(`${API_URL}/workout-exercise`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.error || result.message || "Erro ao criar exercício na sessão"
      );
    }

    return result;
  } else {
    const errorText = await res.text();
    console.error("Resposta inesperada:", errorText);
    throw new Error("Resposta inesperada do servidor. Veja o console.");
  }
}

export async function createWorkoutSet(
  token: string,
  data: {
    workout_exercise_id: number;
    workout_session_id: number;
    weight: number;
    reps: number;
    set_type: string;
    order: number;
  }
) {
  const res = await fetch(
    `${API_URL}/workout-set/${data.workout_exercise_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || result.message || "Erro ao criar set");
  }

  return result;
}

export async function updateWorkoutSet(
  setId: number,
  token: string,
  updates: {
    weight?: number;
    reps?: number;
    set_type?: string;
    order?: number;
  }
) {
  const res = await fetch(`${API_URL}/workout-set/${setId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Erro ao atualizar o set");
  }

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

  // Se for 404, retorna array vazio diretamente
  if (res.status === 404) return [];

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.error || result.message || "Erro ao buscar exercícios da sessão"
    );
  }

  // Garante que só retorna array
  return Array.isArray(result) ? result : [];
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

export async function updateWorkoutExercise(
  workoutId: number,
  token: string,
  updates: {
    exercise_id?: number;
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
      data.error || data.message || "Erro ao atualizar exercício da sessão"
    );

  return data;
}

export const deleteWorkoutSet = async (id: number, token: string) => {
  const res = await fetch(`${API_URL}/workout-set/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Erro ao deletar set");
  return res.json();
};
