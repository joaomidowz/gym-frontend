"use client";

import { useRouter } from "next/navigation";
import {
  FaWeightHanging,
  FaListUl,
  FaUser,
  FaHeart,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { format } from "date-fns";

type Props = {
  sessionId: number;
  title: string;
  user?: {
    id: number;
    name: string;
    is_public: boolean;
  };
  like_count: number;
  comments_count: number;
  total_sets: number;
  total_weight: number;
  createdAt?: string;
  onLike?: () => void;
  onClick?: () => void;
  isLiked?: boolean;
};

export default function SessionCardFeed({
  sessionId,
  title,
  user,
  like_count,
  comments_count,
  total_sets,
  total_weight,
  createdAt,
  onLike,
  onClick,
  isLiked,
}: Props) {
  const router = useRouter();

  return (
    <div
      onClick={onClick}
      className="relative bg-white border border-primary rounded-xl p-4 shadow mb-4 text-primary cursor-pointer hover:shadow-md transition group"
    >
      <div className="text-sm flex items-center gap-1 mb-1">
        <FaUser className="text-xs" />
        <span>{user?.name || "Desconhecido"}</span>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold truncate w-3/4">{title}</h2>
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
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <FaRegCalendarAlt />
          <span>{format(new Date(createdAt), "dd/MM/yyyy")}</span>
        </div>
      )}

      <div className="text-xs text-gray-500 flex justify-between items-center">
        <span>
          {like_count} curtidas · {comments_count} comentários
        </span>

        {onLike && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={`rounded-full w-7 h-7 flex items-center justify-center border transition ${isLiked ? "bg-red-500 text-white" : "bg-white border-primary text-primary"
              } hover:scale-105`}
          >
            <FaHeart className={isLiked ? "text-white" : "text-red-500"} />
          </button>
        )}
      </div>
    </div>
  );
}
