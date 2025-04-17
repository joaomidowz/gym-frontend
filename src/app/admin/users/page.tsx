"use client";

import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "@/services/user";
import { getToken } from "@/utils/storage";
import { EditUserAdminModal } from "@/components/editUserAdminModal";
import ConfirmationModal from "@/components/confirmationModal";
import AdminUserCard from "@/components/adminUserCard";

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
    };

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
            prev.map((u) => (u.id === editingUser.id ? { ...u, ...updatedData } : u))
        );
        setEditingUser(null);
    };

    return (
        <div className="p-4 pb-28 max-w-4xl mx-auto text-primary">
            <h1 className="text-2xl font-bold mb-6">Gerenciar Usuários</h1>

            {loading && <p>Carregando usuários...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {users.map((user) => (
                        <AdminUserCard
                            key={user.id}
                            user={user}
                            onEdit={() => setEditingUser(user)}
                            onDelete={() => openModal(user.id)}
                            onToggleAdmin={() => alert("Em breve: alternar admin")}
                        />
                    ))}
                </div>
            )}

            {editingUser && (
                <EditUserAdminModal
                    userId={editingUser.id}
                    currentName={editingUser.name}
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
