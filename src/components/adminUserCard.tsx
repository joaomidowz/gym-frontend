"use client";

import { FaTrashAlt, FaUserShield } from "react-icons/fa";

type Props = {
    user: {
        id: number;
        name: string;
        email: string;
        height_cm?: number;
        weight_kg?: number;
        streak_count?: number;
        is_admin: boolean;
    };
    onEdit: () => void;
    onDelete: () => void;
    onToggleAdmin?: () => void;
};

export default function AdminUserCard({ user, onEdit, onDelete, onToggleAdmin }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-primary shadow-md overflow-hidden">
            <div className="bg-primary text-white px-4 py-2 flex justify-between items-center">
                <span className="font-bold text-sm">ID: {user.id}</span>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate max-w-[100px]">{user.name}</span>
                    {user.is_admin && (
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-xl">
                            ADMIN
                        </span>
                    )}
                </div>
            </div>


            <div className="p-4 space-y-1 text-sm sm:text-base">
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Altura:</span> {user.height_cm || "-"} cm</p>
                <p><span className="font-semibold">Peso:</span> {user.weight_kg || "-"} kg</p>
                <p><span className="font-semibold">Streak:</span> {user.streak_count || 0}</p>

                <div className="flex gap-2 justify-end pt-4">
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm font-semibold"
                    >
                        Editar
                    </button>

                    <button
                        onClick={() => onToggleAdmin && onToggleAdmin()}
                        className={`p-2 text-white rounded-xl transition ${user.is_admin
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-blue-500 hover:bg-blue-600"
                            }`}
                        title={user.is_admin ? "Remover admin" : "Tornar admin"}
                    >
                        <FaUserShield className="w-4 h-4" />
                    </button>


                    <button
                        onClick={onDelete}
                        className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                        title="Excluir usuário"
                    >
                        <FaTrashAlt className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
