"use client";

import { useRouter } from "next/navigation";
import {
  FaWeightHanging,
  FaListUl,
  FaUser,
  FaHeart,
  FaRegCalendarAlt,
  FaEdit,
  FaTimes,
  FaStopwatch,
  FaMedal
} from "react-icons/fa";
import { format } from "date-fns";

type Props = {
  id: number;
  title: string;
  user?: {
    id: number;
    name: string;
    is_public: boolean;
  };
  duration_seconds?: number;
  like_count: number;
  comments_count: number;
  total_sets: number;
  total_weight: number;
  createdAt?: string;
  onLike?: () => void;
  onDelete?: () => void;
  isLiked?: boolean;
  prs?: {
    pr_type: "weight" | "reps";
  }[];
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")} : ${m.toString().padStart(2, "0")} : ${s.toString().padStart(2, "0")}`;
};

export default function SessionCardSessions({
  id,
  title,
  user,
  duration_seconds,
  like_count,
  comments_count,
  total_sets,
  total_weight,
  createdAt,
  onLike,
  onDelete,
  isLiked,
  prs
}: Props) {
  const router = useRouter();

  const handleOpen = () => {
    router.push(`/feed/${id}/session`);
  };
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/sessions/${id}/edit`);
  };

  return (
    <div
      onClick={handleOpen}
      className="relative bg-white border border-primary rounded-xl p-4 shadow mb-4 text-primary cursor-pointer hover:shadow-md transition group"
    >
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110 transition"
        >
          <FaTimes size={14} />
        </button>
      )}

      {/* Nome do usuário acima do título */}
      <div className="text-sm flex items-center gap-1 mb-1">
        <FaUser className="text-xs" />
        <span>{user?.name || "Desconhecido"}</span>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold truncate w-3/4">
          {title}

          {[...new Set(prs?.map(pr => pr.pr_type))].map((type) => (
            <span
              key={type}
              className={`ml-2 px-2 py-1 rounded-full bg-yellow-100 text-xs font-semibold inline-flex items-center gap-1 ${type === "weight" ? "text-yellow-700 animate-bounce" : "text-gray-600 animate-pulse bg-gray-100"
                }`}
            >
              <FaMedal />
              {type === "weight" ? "Peso" : "Reps"}
            </span>

          ))}


        </h2>
      </div>

      <div className="flex gap-4 text-sm mb-2">
        <div className="flex items-center gap-1">
          <FaListUl />
          <span>{total_sets} sets</span>
        </div>
        <div className="flex items-center gap-1">
          <FaWeightHanging />
          <span>{total_weight} kg</span>
        </div>
      </div>

      {createdAt && (
        <div className="flex items-center gap-1 text-xs text-red-500 mb-2">
          <FaRegCalendarAlt />
          <span>{format(new Date(createdAt), "dd/MM/yyyy")}</span>
        </div>
      )}

      {typeof duration_seconds === "number" && (
        <p className="flex items-center gap-1 text-xs text-gray-500 mb-2"><FaStopwatch /> {formatDuration(duration_seconds)}</p>
      )}

      <div className="text-xs text-gray-500 flex justify-between items-center">
        <span>
          {like_count} curtidas · {comments_count} comentários
        </span>

        <div className="flex items-center gap-2">
          {onLike && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className="text-primary hover:text-red-500 transition"
            >
              <FaHeart className={`inline ${isLiked ? "text-red-500" : ""}`} />
            </button>
          )}

          <button
            onClick={handleEdit}
            className="bg-primary text-white text-xs px-2 py-1 rounded hover:scale-105 transition flex items-center gap-1"
          >
            <FaEdit size={12} /> Editar
          </button>
        </div>
      </div>
    </div>

  );
}
