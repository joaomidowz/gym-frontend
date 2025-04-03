import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context)
        throw new Error("useAuth precisa estar dentro do AuthProvider")

    return context
}