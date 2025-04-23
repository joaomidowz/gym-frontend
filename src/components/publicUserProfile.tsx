"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/utils/storage";
import {
    followUser,
    unfollowUser,
    checkIfFollowing,
    getFollowersCount,
    getFollowingCount,
    getFollowers,
    getFollowing,
} from "@/services/follow";
import { UserListModal } from "./userListModal";

type Props = {
    user: {
        id: number;
        name: string;
        email: string;
        height_cm?: number;
        weight_kg?: number;
    };
    sessionCount: number;
    streak?: {
        current_streak: number;
        longest_streak: number;
        last_workout_date: string;
    } | null;
};

export function PublicUserProfile({ user, sessionCount, streak }: Props) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingFollow, setCheckingFollow] = useState(true);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [showModal, setShowModal] = useState<"followers" | "following" | null>(null);
    const [userList, setUserList] = useState<{ id: number; name: string }[]>([]);

    const token = getToken();

    const refreshFollowData = async () => {
        if (!token) return;
        const following = await checkIfFollowing(user.id, token);
        const followers = await getFollowersCount(user.id, token);
        const followingData = await getFollowingCount(user.id, token);
        setIsFollowing(following);
        setFollowersCount(followers);
        setFollowingCount(followingData);
    };

    const refreshUserList = async () => {
        if (!token || !showModal) return;
        const res =
            showModal === "followers"
                ? await getFollowers(user.id, token)
                : await getFollowing(user.id, token);
        setUserList(res);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await refreshFollowData();
            } catch (err) {
                console.error("Erro ao carregar follow info:", err);
            } finally {
                setCheckingFollow(false);
            }
        };
        fetchData();
    }, [user.id, token]);

    useEffect(() => {
        if (showModal) {
            refreshUserList();
        }
    }, [showModal]);

    const handleFollowToggle = async () => {
        try {
            setLoading(true);
            if (!token) return;

            if (isFollowing) {
                await unfollowUser(user.id, token);
            } else {
                await followUser(user.id, token);
            }

            await refreshFollowData();
            await refreshUserList();
        } catch (err) {
            console.error("Erro ao seguir/deixar de seguir:", err);
        } finally {
            setLoading(false);
        }
    };

    const openList = async (type: "followers" | "following") => {
        if (!token) return;
        setShowModal(type);
    };

    return (
        <div className="p-4 pb-20 max-w-xl mx-auto">
            <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-primary mb-4 bg-primary/10 flex items-center justify-center text-xs text-primary">
                    Avatar
                </div>
                <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>

                <div className="flex gap-4 mt-2 text-sm text-primary cursor-pointer">
                    <span onClick={() => openList("followers")}>{followersCount} seguidores</span>
                    <span onClick={() => openList("following")}>{followingCount} seguindo</span>
                </div>

                {!checkingFollow && (
                    <button
                        onClick={handleFollowToggle}
                        disabled={loading || !token}
                        className={`mt-4 px-4 py-2 ${isFollowing ? "bg-red-500" : "bg-primary"
                            } text-white-txt text-sm rounded-xl hover:opacity-90 transition cursor-pointer`}
                    >
                        {isFollowing ? "Deixar de seguir" : "Seguir"}
                    </button>
                )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm text-gray-700">
                <div className="bg-white rounded-2xl p-4 shadow">
                    <p className="text-gray-400">Treinos</p>
                    <p className="text-xl font-semibold text-primary">{sessionCount}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow">
                    <p className="text-gray-400">Peso</p>
                    <p className="text-xl font-semibold">{user.weight_kg ?? "-"}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow">
                    <p className="text-gray-400">Altura</p>
                    <p className="text-xl font-semibold">{user.height_cm ?? "-"}</p>
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
                            Último treino:{" "}
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

        </div>
    );
}
