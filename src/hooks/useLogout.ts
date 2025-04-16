import { clearToken } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function useLogout() {
    const router = useRouter();
    useAuth();
    const { setUser } = useAuth();

    return () => {
        clearToken();
        setUser(null);
        router.push("/")
    }

}