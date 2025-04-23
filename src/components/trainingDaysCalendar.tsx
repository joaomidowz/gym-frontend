"use client";

import { useEffect, useState } from "react";
import { getTrainingDays } from "@/services/user";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getToken } from "@/utils/storage";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    subMonths,
    addMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
    userId: number;
};

export function TrainingDaysCalendar({ userId }: Props) {
    const [daysTrained, setDaysTrained] = useState<string[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchDays = async () => {
            const token = getToken();
            if (!token) return;

            try {
                const days = await getTrainingDays(userId, token);
                setDaysTrained(days);
            } catch (err) {
                console.error("Erro ao buscar dias de treino:", err);
            }
        };

        fetchDays();
    }, [userId]);

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    return (
        <div className="mt-6 bg-white rounded-2xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="text-primary hover:scale-110 transition"
                    aria-label="Mês anterior"
                >
                    <FaChevronLeft size={20} />
                </button>

                <h3 className="text-primary font-bold text-sm sm:text-base uppercase tracking-wide">
                    {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                </h3>

                <button
                    onClick={handleNextMonth}
                    className="text-primary hover:scale-110 transition"
                    aria-label="Próximo mês"
                >
                    <FaChevronRight size={20} />
                </button>
            </div>


            <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-1">
                {[
                    { label: "D", key: "dom" },
                    { label: "S", key: "seg" },
                    { label: "T", key: "ter" },
                    { label: "Q", key: "qua" },
                    { label: "Q", key: "qui" },
                    { label: "S", key: "sex" },
                    { label: "S", key: "sab" },
                ].map(({ label, key }) => (
                    <div key={key} className="font-bold text-gray-400">
                        {label}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {daysInMonth.map((date) => {
                    const formatted = format(date, "yyyy-MM-dd");
                    const trained = daysTrained.includes(formatted);

                    return (
                        <div
                            key={formatted}
                            title={format(date, "dd 'de' MMM", { locale: ptBR })}
                            className={`w-8 h-8 rounded-md flex items-center justify-center ${trained ? "bg-green-500 text-white-txt" : "bg-white-100 text-gray-400"
                                }`}
                        >
                            {date.getDate()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
