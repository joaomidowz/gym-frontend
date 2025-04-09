import { API_URL } from "./api";

export async function followUser(userId: number, token: string) {
  const res = await fetch(`${API_URL}/follow/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Erro ao seguir usuário: resposta inválida");
  }

  if (!res.ok) {
    console.error("[FOLLOW] Erro ao seguir:", data);
    throw new Error(data?.message || "Erro ao seguir usuário");
  }

  return true;
}

export async function unfollowUser(userId: number, token: string) {
  const res = await fetch(`${API_URL}/follow/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Erro ao deixar de seguir: resposta inválida");
  }

  if (!res.ok) {
    console.error("[FOLLOW] Erro ao deixar de seguir:", data);
    throw new Error(data?.message || "Erro ao deixar de seguir");
  }

  return true;
}

export async function checkIfFollowing(userId: number, token: string) {
  if (!token) return false;

  const res = await fetch(`${API_URL}/follow/check/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("[FOLLOW] Erro ao verificar follow:", data);
    return false;
  }

  return data.is_following === true;
}
