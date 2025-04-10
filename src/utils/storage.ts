import { jwtDecode } from "jwt-decode"; 
const TOKEN_KEY = "@gymapp:token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): { id: number; name?: string } | null {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return {
      id: decoded.id,
      name: decoded.name, 
    };
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}

export function removeToken () {
    localStorage.removeItem(TOKEN_KEY)
}