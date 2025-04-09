import { API_URL } from "./api";

// SEGUIR
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

// DEIXAR DE SEGUIR
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

// VERIFICA SE JÁ SEGUE
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

// CONTAGEM DE SEGUIDORES
export async function getFollowersCount(userId: number, token: string) {
  const res = await fetch(`${API_URL}/follow/followers/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("[FOLLOW] Erro ao buscar seguidores:", data);
    return 0;
  }

  return Array.isArray(data) ? data.length : 0;
}

// CONTAGEM DE SEGUINDO
export async function getFollowingCount(userId: number, token: string) {
  const res = await fetch(`${API_URL}/follow/following/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("[FOLLOW] Erro ao buscar seguindo:", data);
    return 0;
  }

  return Array.isArray(data) ? data.length : 0;
}

export async function getFollowers(userId: number, token: string) {
  const res = await fetch(`${API_URL}/follow/followers/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar seguidores");
  }

  return res.json(); // ← já retorna direto [{ id, name }]
}

export async function getFollowing(userId: number, token: string) {
  const res = await fetch(`${API_URL}/follow/following/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar seguindo");
  }

  return res.json(); // ← já retorna direto [{ id, name }]
}
