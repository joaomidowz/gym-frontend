"use client";

import { useState } from "react";
import { getToken } from "@/utils/storage";
import { SuccessToast } from "./successToast";
import { deleteUser } from "@/services/user";

type Props = {
  userId: number;
  currentHeight?: number;
  currentWeight?: number;
  currentEmail?: string;
  onClose: () => void;
  onSuccess: (newData: { height_cm?: number; weight_kg?: number; email?: string }) => void;
};

export function EditProfileModal({
  userId,
  currentHeight,
  currentWeight,
  currentEmail,
  onClose,
  onSuccess,
}: Props) {
  const [height, setHeight] = useState(currentHeight || "");
  const [weight, setWeight] = useState(currentWeight || "");
  const [email, setEmail] = useState(currentEmail || "");
  const [showToast, setShowToast] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const handleSave = async () => {
    const token = getToken();
    setLoading(true);
    setError("");

    try {
      if (!token) throw new Error("Token ausente.");

      const body: any = {};
      if (height) body.height_cm = Number(height);
      if (weight) body.weight_kg = Number(weight);
      if (email) body.email = email;
      if (currentPassword && newPassword) {
        body.current_password = currentPassword;
        body.new_password = newPassword;
      }

      if (
        !body.height_cm &&
        !body.weight_kg &&
        !body.email &&
        (!body.current_password || !body.new_password)
      ) {
        setError("Preencha pelo menos um campo.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar.");

      onSuccess({
        height_cm: data.user.height_cm,
        weight_kg: data.user.weight_kg,
        email: data.user.email,
      });
      onClose();
      setShowToast(true);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = getToken();
    if (!token) return;

    try {
      await deleteUser(userId, token, deletePassword);
      window.location.href = "/";
    } catch (error: any) {
      setError(error.message || "Erro ao excluir conta.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold text-primary mb-4">Editar Perfil</h3>

        <div className="mb-4">
          <label className="text-sm text-gray-700">Altura (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-xl text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700">Peso (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-xl text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-xl text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700">Senha atual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-xl text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700">Nova senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-xl text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded-xl text-sm"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-primary text-white-txt py-2 rounded-xl text-sm"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>

        {confirmDelete ? (
          <div className="mt-4">
            <label className="text-sm text-gray-700">Digite sua senha para confirmar:</label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-xl text-sm"
            />
            <button
              onClick={handleDelete}
              className="mt-2 w-full bg-red-500 text-white-txt py-2 rounded-xl text-sm"
            >
              Confirmar exclusão
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="mt-4 w-full bg-red-500 text-white-txt py-2 rounded-xl text-sm"
          >
            Excluir conta
          </button>
        )}

        {showToast && <SuccessToast message="Perfil atualizado com sucesso!" />}
      </div>
    </div>
  );
}
