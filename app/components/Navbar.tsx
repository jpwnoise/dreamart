'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const links = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/productos' },
    { name: 'Sobre Nosotros', href: '/about' },
    { name: 'Contacto', href: '/contacto' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                {/* LOGO */}
                <Link href="/" className="text-2xl font-bold tracking-tight">
                    Dream<span className="text-yellow-300">Art</span>
                </Link>

                {/* LINKS */}
                <ul className="hidden md:flex gap-8 text-sm font-medium">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href} className="relative">
                                <Link
                                    href={link.href}
                                    className={`transition-colors ${isActive
                                            ? 'text-yellow-300'
                                            : 'hover:text-yellow-200 text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                                {isActive && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute left-0 right-0 -bottom-1 h-[2px] bg-yellow-300 rounded-full"
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>

                {/* ICONOS */}
                <div className="flex items-center gap-4">
                    <button className="hover:text-yellow-300 transition">
                        <ShoppingCart size={22} />
                    </button>
                    <button
                        className="md:hidden hover:text-yellow-300 transition"
                        onClick={() => setOpen(!open)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>

    );
}
