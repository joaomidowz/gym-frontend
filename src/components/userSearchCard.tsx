"use client";
import Link from "next/link";

type Props = {
  id: number;
  name: string;
};

export default function UserSearchCard({ id, name }: Props) {
  return (
    <Link href={`/profile/${id}/user`}>
      <div className="p-3 border border-primary rounded-xl hover:bg-primary/10 transition cursor-pointer">
        <p className="font-semibold text-primary">{name}</p>
        <p className="text-xs text-gray-500">Ver perfil</p>
      </div>
    </Link>
  );
}
