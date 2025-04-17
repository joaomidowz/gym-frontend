"use client";

import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "@/services/user";
import { getToken } from "@/utils/storage";
import { FaTrashAlt } from "react-icons/fa";
import { EditUserAdminModal } from "@/components/editUserAdminModal";
import ConfirmationModal from "@/components/confirmationModal";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = getToken();
                if (!token) return;
                const res = await getAllUsers(token);
                const sortedUsers = res.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
                setUsers(sortedUsers);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const openModal = (userId: number) => {
        setUserToDelete(userId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setUserToDelete(null);
        setIsModalOpen(false);
    }

    const handleDeleteConfirmed = async () => {
        if (userToDelete === null) return;
        try {
            const token = getToken();
            if (!token) return;
            await deleteUser(userToDelete, token);
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
        } catch (err: any) {
            alert("Erro ao deletar: " + err.message);
        } finally {
            closeModal();
        }
    };

    const handleEditSuccess = (updatedData: any) => {
        if (!editingUser) return;
        setUsers((prev) =>
            prev.map((u) =>
                u.id === editingUser.id
                    ? { ...u, ...updatedData }
                    : u
            )
        );
        setEditingUser(null);
    };

    return (
        <div className="p-6 pb-24 max-w-4xl mx-auto text-primary">
            <h1 className="text-2xl font-bold mb-6">Gerenciar Usuários</h1>

            {loading && <p>Carregando usuários...</p>}
            {error && <p className="text-red-500">Erro: {error}</p>}

            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-primary rounded-xl overflow-hidden">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Nome</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Altura</th>
                                <th className="p-3 text-left">Peso</th>
                                <th className="p-3 text-left">Streak</th>
                                <th className="p-3 text-left">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="p-3">{user.id}</td>
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.height_cm || "-"}</td>
                                    <td className="p-3">{user.weight_kg || "-"}</td>
                                    <td className="p-3">{user.streak_count || 0}</td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => openModal(user.id)}
                                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            ✏️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingUser && (
                <EditUserAdminModal
                    userId={editingUser.id}
                    currentEmail={editingUser.email}
                    currentHeight={editingUser.height_cm}
                    currentWeight={editingUser.weight_kg}
                    onClose={() => setEditingUser(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleDeleteConfirmed}
                message="Você está prestes a excluir este usuário. Essa ação não poderá ser desfeita."
            />
        </div>
    );
}
