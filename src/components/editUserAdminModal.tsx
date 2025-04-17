"use client";

import { useState } from "react";
import { getToken } from "@/utils/storage";
import { updateUser } from "@/services/user";
import { SuccessToast } from "./successToast";

type Props = {
  userId: number;
  currentHeight?: number;
  currentWeight?: number;
  currentEmail?: string;
  onClose: () => void;
  onSuccess: (newData: { height_cm?: number; weight_kg?: number; email?: string }) => void;
};

export function EditUserAdminModal({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      if (!body.height_cm && !body.weight_kg && !body.email) {
        setError("Preencha pelo menos um campo.");
        setLoading(false);
        return;
      }

      const res = await updateUser(userId, token, body);

      onSuccess({
        height_cm: res.user.height_cm,
        weight_kg: res.user.weight_kg,
        email: res.user.email,
      });
      onClose();
      setShowToast(true);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold text-primary mb-4">Editar Usuário</h3>

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
            className="flex-1 bg-primary text-white py-2 rounded-xl text-sm"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>

        {showToast && <SuccessToast message="Usuário atualizado com sucesso!" />}
      </div>
    </div>
  );
}
