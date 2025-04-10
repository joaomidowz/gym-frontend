"use client";

import { useEffect, useState } from "react";
import { getCommentsBySession, commentSession, deleteComment } from "@/services/social";
import { getToken, getUser } from "@/utils/storage";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  sessionId: number;
  showDeleteForUserId?: number | null;
};

type Comment = {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
};

export default function SessionComments({ sessionId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user?.id) {
      setCurrentUserId(user.id);
    }
    fetchComments();
  }, [sessionId]);

  const fetchComments = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const data = await getCommentsBySession(sessionId, token);
      setComments(data);
    } catch (err) {
      console.error("Erro ao buscar comentários:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    const token = getToken();
    if (!token || !newComment.trim()) return;

    try {
      const created = await commentSession(sessionId, newComment, token);
      setComments((prev) => [created, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Erro ao comentar:", err);
    }
  };

  const handleDelete = async (commentId: number) => {
    const token = getToken();
    if (!token) return;

    try {
      await deleteComment(commentId, token);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Erro ao excluir comentário:", err);
    }
  };

  return (
    <div className="mt-8 w-full max-w-md mx-auto text-primary">
      <h2 className="text-lg font-bold mb-2">Comentários</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva um comentário..."
          className="flex-1 p-2 border border-primary rounded-xl"
        />
        <button
          onClick={handleAddComment}
          className="bg-primary text-white px-4 py-2 rounded-xl"
        >
          Enviar
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-2">
          {comments.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
          )}
          <AnimatePresence>
            {comments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="border border-primary p-3 rounded-xl text-sm relative"
              >
                <p className="font-semibold">{c.user.name}</p>
                <p>{c.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>

                {currentUserId === c.user.id && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:scale-105 transition"
                    title="Excluir comentário"
                  >
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
