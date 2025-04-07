"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useSearch } from "@/hooks/useSearch";

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"session" | "user">("session");

  const { results, search, loading } = useSearch(type);

  const handleSearch = async () => {
    if (!query.trim()) return;
    await search(query);
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 py-3 bg-secundary border-b border-primary">
        <h1 className="text-xl font-bold text-primary">Midowz Gym</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="text-primary bg-white p-2 rounded-full shadow"
        >
          <FaSearch />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-background z-50 p-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary">Pesquisar</h2>
              <button onClick={() => setIsOpen(false)}>
                <IoClose className="text-2xl text-primary" />
              </button>
            </div>

            <input
              type="text"
              placeholder={`Buscar ${type === "session" ? "sessões" : "pessoas"}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full p-3 rounded-xl border border-primary mb-4 text-primary bg-secundary focus:outline-none"
            />

            <div className="flex gap-2 mb-4">
              <button
                className={`flex-1 p-2 rounded-xl ${
                  type === "session" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
                onClick={() => setType("session")}
              >
                Sessões
              </button>
              <button
                className={`flex-1 p-2 rounded-xl ${
                  type === "user" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
                onClick={() => setType("user")}
              >
                Pessoas
              </button>
            </div>

            {loading ? (
              <p className="text-primary">Carregando...</p>
            ) : (
              <div className="text-primary space-y-2">
                {results.length === 0 && query && <p>Nenhum resultado encontrado.</p>}
                {results.map((item: any) => (
                  <div key={item.id} className="p-3 border border-primary rounded-xl">
                    {type === "user" ? (
                      <p className="font-semibold">{item.name}</p>
                    ) : (
                      <p className="font-semibold">{item.title}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
