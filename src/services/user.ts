import { API_URL } from "./api";

export async function getUserById(id: number, token: string) {
  const res = await fetch(`${API_URL}/user/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao pegar o usuário");

  return data;
}

export async function getAllUsers(token: string) {
  const res = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao procurar usuário");

  return data;
}

export async function updateUser(
  id: number,
  token: string,
  updates: {
    email?: string;
    height_cm?: number;
    weight_kg?: number;
    current_password?: string;
    new_password?: string;
    is_public?: boolean;
  }
) {
  const res = await fetch(`${API_URL}/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao atualizar usuário");

  return data;
}

export async function deleteUser(
  id: number,
  token: string,
  deletePassword?: string
) {
  const res = await fetch(`${API_URL}/user/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao deletar conta");

  return data;
}

export async function getStreak(token: string) {
  const res = await fetch(`${API_URL}/user/streak`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao ver streak");

  return data;
}

export async function saveStreak(token: string) {
  const res = await fetch(`${API_URL}/user/streak/save`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao salvar streak");

  return data;
}

export async function searchUser(query: string, token: string) {
  const res = await fetch(`${API_URL}/user/search?query=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Erro ao buscar usuário");

  return data;
}

export async function getUserStreakById(userId: number) {
  const res = await fetch(`${API_URL}/user/${userId}/streak`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Erro ao pegar streak do usuário");

  return data;
}
