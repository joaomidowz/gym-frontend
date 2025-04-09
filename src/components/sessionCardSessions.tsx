import { useRouter } from "next/navigation";
import { FaWeightHanging, FaListUl, FaUser, FaHeart } from "react-icons/fa";

type Props = {
  id: number;
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
  onLike?: () => void;
  onDelete?: () => void;
  isLiked?: boolean;
};

export default function SessionCardSessions({
  id,
  title,
  user,
  like_count,
  comments_count,
  total_sets,
  total_weight,
  onLike,
  onDelete,
  isLiked,
}: Props) {

  const router = useRouter();

  const handleOpen = () => {
    router.push(`/sessions/${id}/edit`);
  };


  return (
    <div
      onClick={handleOpen}
      className="relative bg-white border border-primary rounded-xl p-4 shadow mb-4 text-primary cursor-pointer hover:shadow-md transition"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{title}</h2>

        <div className="text-sm flex items-center gap-1">
          <FaUser className="text-xs" />
          <span>{user?.name || "Desconhecido"}</span>
        </div>
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

      <div className="text-xs text-gray-500 flex justify-between items-center">
        <span>
          {like_count} curtidas · {comments_count} comentários
        </span>
        {onLike && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // evita que clique propague pro card
              onLike();
            }}
            className="ml-2 text-primary hover:text-red-500 transition"
          >
            <FaHeart className={`inline ${isLiked ? "text-red-500" : ""}`} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute bottom-2 right-2 text-red-500 text-xs font-semibold hover:underline"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
