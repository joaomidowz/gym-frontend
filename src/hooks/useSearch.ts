import { useState } from "react";
import { searchExercise } from "@/services/exercises";
import { searchUser } from "@/services/user";
import { getToken } from "@/utils/storage";
import { searchSession } from "@/services/workoutSession";

type searchType = "exercise" | "user" | "session";

export function useSearch(type: searchType) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(query: string) {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Sem token");

      let data = [];
      if (type === "exercise") {
        data = await searchExercise(query, token);
      } else if (type === "user") {
        data = await searchUser(query, token);
      } else if (type === "session") {
        data = await searchSession(query, token);
      }

      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return { results, search, loading };
}
