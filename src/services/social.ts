import { API_URL } from "./api";

export async function getFeed(token: string, limit = 10, offset = 0) {
  const res = await fetch(`${API_URL}/feed?limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao carregar feed");

  return data;
}

export async function likeSession(sessionId: number, token: string) {
  const res = await fetch(`${API_URL}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao curtir sessão");

  return data;
}

export async function unlikeSession(sessionId: number, token: string) {
  const res = await fetch(`${API_URL}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao descurtir sessão");

  return data;
}

export async function commentSession(
  sessionId: number,
  content: string,
  token: string
) {
  const res = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ session_id: sessionId, content }),
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao comentar");

  return data;
}

export async function deleteComment(commentId: number, token: string) {
  const res = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || data.message || "Erro ao deletar comentário");
  }

  return true;
}

export async function getCommentsBySession(sessionId: number, token: string) {
  const res = await fetch(`${API_URL}/comments/${sessionId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok)
    throw new Error(data.error || data.message || "Erro ao buscar comentários");

  return data;
}

export async function followUser(userId: number, token: string) {
  const res = await fetch(`${API_URL}/follow/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Erro ao seguir usuário");
  }

  return data;
}

export async function unfollowUser(userId: number, token: string) {
  const res = await fetch(`${API_URL}/follow/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Erro ao deixar seguir usuário");
  }

  return data;
}
