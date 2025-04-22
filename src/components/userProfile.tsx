"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/utils/storage";
import {
    getFollowers,
    getFollowing,
    getFollowersCount,
    getFollowingCount,
} from "@/services/follow";
import { updateUser } from "@/services/user";
import { UserListModal } from "./userListModal";
import { EditProfileModal } from "./editProfileModal";
import { SuccessToast } from "./successToast";
import { useLogout } from "@/hooks/useLogout";
import { TrainingDaysCalendar } from "@/components/trainingDaysCalendar";

type Props = {
    user: {
        id: number;
        name: string;
        email: string;
        height_cm?: number;
        weight_kg?: number;
        is_public?: boolean;
    };
    isOwnProfile: boolean;
    sessionCount: number;
    streak?: {
        current_streak: number;
        longest_streak: number;
        last_workout_date: string;
    } | null;
};

export function UserProfile({ user, isOwnProfile, sessionCount, streak }: Props) {
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [showModal, setShowModal] = useState<"followers" | "following" | null>(null);
    const [userList, setUserList] = useState<{ id: number; name: string }[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [localUser, setLocalUser] = useState(user);
    const [isPublic, setIsPublic] = useState(user.is_public ?? true);

    const token = getToken();
    const logout = useLogout();

    const loadFollowInfo = async () => {
        if (!token) return;
        try {
            const [followers, following] = await Promise.all([
                getFollowersCount(user.id, token),
                getFollowingCount(user.id, token),
            ]);
            setFollowersCount(followers);
            setFollowingCount(following);
        } catch (err) {
            console.error("Erro ao carregar contagens de follow:", err);
        }
    };

    const loadUserList = async () => {
        if (!token || !showModal) return;
        try {
            const users =
                showModal === "followers"
                    ? await getFollowers(user.id, token)
                    : await getFollowing(user.id, token);
            setUserList(users);
        } catch (err) {
            console.error("Erro ao carregar lista de usuários:", err);
        }
    };

    const handleTogglePrivacy = async () => {
        if (!token) return;
        try {
            const updated = await updateUser(localUser.id, token, {
                is_public: !isPublic,
            });
            setIsPublic(updated.user.is_public);
            setShowToast(true);
        } catch (error) {
            console.error("Erro ao atualizar privacidade do perfil:", error);
        }
    };

    useEffect(() => {
        loadFollowInfo();
    }, [user.id]);

    useEffect(() => {
        loadUserList();
    }, [showModal]);

    return (
        <div className="p-4 pb-20 max-w-xl mx-auto">
            <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-primary mb-4 bg-primary/10 flex items-center justify-center text-xs text-primary">
                    Avatar
                </div>
                <h2 className="text-2xl font-bold text-primary">{localUser.name}</h2>
                <p className="text-sm text-gray-500">{localUser.email}</p>

                <div className="flex gap-4 mt-2 text-sm text-primary cursor-pointer">
                    <span onClick={() => setShowModal("followers")}>
                        {followersCount} seguidores
                    </span>
                    <span onClick={() => setShowModal("following")}>
                        {followingCount} seguindo
                    </span>
                </div>

                {isOwnProfile && (
                    <>
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary/90 transition"
                        >
                            Editar perfil
                        </button>

                        <button
                            onClick={handleTogglePrivacy}
                            className={`mt-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isPublic ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}
                        >
                            {isPublic ? "Perfil público" : "Perfil privado"}
                        </button>


                    </>
                )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm text-gray-700">
                <div className="bg-white rounded-2xl p-4 shadow">
                    <p className="text-gray-400">Treinos</p>
                    <p className="text-xl font-semibold text-primary">{sessionCount}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow">
                    <p className="text-gray-400">Peso</p>
                    <p className="text-xl font-semibold">{localUser.weight_kg ?? "-"}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow">
                    <p className="text-gray-400">Altura</p>
                    <p className="text-xl font-semibold">{localUser.height_cm ?? "-"}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow">
                    <p className="text-gray-400">Streak atual</p>
                    <p className="text-xl font-semibold text-green-600">
                        {streak?.current_streak ?? 0}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow col-span-2">
                    <p className="text-gray-400">Maior streak</p>
                    <p className="text-xl font-semibold text-green-700">
                        {streak?.longest_streak ?? 0}
                    </p>
                    {streak?.last_workout_date && (
                        <p className="text-xs mt-1 text-gray-400">
                            Último treino: {" "}
                            {new Date(streak.last_workout_date).toLocaleDateString("pt-BR")}
                        </p>
                    )}
                </div>
            </div>

            {showModal && (
                <UserListModal
                    title={showModal === "followers" ? "Seguidores" : "Seguindo"}
                    userList={userList}
                    onClose={() => setShowModal(null)}
                />
            )}

            {showEditModal && (
                <EditProfileModal
                    userId={localUser.id}
                    currentHeight={localUser.height_cm}
                    currentWeight={localUser.weight_kg}
                    currentEmail={localUser.email}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={(newData) => {
                        setLocalUser((prev) => ({ ...prev, ...newData }));
                        setShowToast(true);
                    }}
                />
            )}
            <div className="flex flex-col items-center py-5">
                <button
                    onClick={logout}
                    className="mt-2 px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition"
                >
                    Sair da conta
                </button>
                {isOwnProfile && (
                    <TrainingDaysCalendar userId={localUser.id} />
                )}

            </div>
            {showToast && <SuccessToast message="Perfil atualizado com sucesso!" />}
        </div>
    );
}
