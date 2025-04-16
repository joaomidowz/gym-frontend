"use client";
import Link from "next/link";

type Props = {
    id: number;
    title: string;
};

export default function SessionSearchCard({ id, title }: Props) {
    return (
         <Link href={`/feed/${id}/session`}>
            <div className="p-3 border border-primary rounded-xl hover:bg-primary/10 transition cursor-pointer">
                <p className="font-semibold text-primary">{title}</p>
                <p className="text-xs text-gray-500">Ver sessão</p>
            </div>
        </Link>
    );
}
