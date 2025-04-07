import { FaWeightHanging, FaListUl, FaUser } from "react-icons/fa";

type Props = {
  title: string;
  user: {
    id: number;
    name: string;
    is_public: boolean;
  };
  like_count: number;
  comments_count: number;
  total_sets: number;
  total_weight: number;
};

export default function SessionCard({
  title,
  user,
  like_count,
  comments_count,
  total_sets,
  total_weight,
}: Props) {
  return (
    <div className="bg-white border border-primary rounded-xl p-4 shadow mb-4 text-primary">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="text-sm flex items-center gap-1">
          <FaUser className="text-xs" />
          <span>{user.name}</span>
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

      <div className="text-xs text-gray-500">
        {like_count} curtidas · {comments_count} comentários
      </div>
    </div>
  );
}
