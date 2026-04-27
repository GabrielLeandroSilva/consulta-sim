"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, History } from "lucide-react";

const links = [
    { href: "/", label: "Compra", icon: ShoppingCart },
    { href: "/historico", label: "Histórico", icon: History },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
            <div className="max-w-lg mx-auto flex">
                {links.map(({ href, label, icon: Icon }) => {
                    const ativo = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                                ativo
                                ? "text-indigo-600"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}