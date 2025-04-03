import { API_URL } from "./api";

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao fazer login");

  return data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  height_cm?: number,
  weight_kg?: number
) {
  const res = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, height_cm, weight_kg }),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao registrar");

  return data;
}

export async function getLogedUser(token: string) {
  const res = await fetch(`${API_URL}/user/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(
      data.error || data.message || "Erro ao buscar o usuário logado"
    );

  return data;
}

export async function updateUser(
  token: string,
  updates: {
    name?: string;
    email?: string;
    password?: string;
    height_cm?: number;
    weight_kg?: number;
  }
) {
  const res = await fetch(`${API_URL}/user`, {
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

export async function deleteUser(token: string) {
  const res = await fetch(`${API_URL}/user`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || data.message || "Erro ao atualizar usuário");
  }
  return true;
}
