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

