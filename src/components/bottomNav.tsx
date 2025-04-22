"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaListUl, FaUser, FaTools, FaDumbbell } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
    { href: "/feed", icon: FaHome, label: "Home" },
    { href: "/sessions", icon: FaListUl, label: "Sessões" },
    { href: "/exercises", icon: FaDumbbell, label: "Exercise" },
    { href: "/profile", icon: FaUser, label: "Perfil" },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { user, isAuthenticated, loading } = useAuth();

    if (loading || !isAuthenticated) return null;

    return (
        <nav className="fixed bottom-0 w-full bg-secundary border-t border-secundary flex justify-around py-2 z-50">
            {[...navItems, ...(user?.is_admin ? [{ href: "/admin", icon: FaTools, label: "Admin" }] : [])].map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href;

                return (
                    <Link key={href} href={href} className="flex flex-col items-center text-xs">
                        <Icon className={`text-xl ${isActive ? "text-primary" : "text-gray-400"}`} />
                        <span className={isActive ? "text-primary font-medium" : "text-gray-400"}>
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
