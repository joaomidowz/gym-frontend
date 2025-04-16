"use client";

import Link from "next/link";
import { FaDumbbell } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const { user } = useAuth();

  if (!user?.is_admin) {
    return <p className="text-center mt-10 text-red-500">Acesso negado.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto text-primary">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      <div className="space-y-4">
        <Link
          href="/admin/exercises"
          className="flex items-center gap-3 bg-white border border-primary rounded-xl p-4 shadow hover:bg-primary hover:text-white transition"
        >
          <FaDumbbell className="text-xl" />
          <span className="text-lg">Gerenciar Exercícios</span>
        </Link>
      </div>
    </div>
  );
}
