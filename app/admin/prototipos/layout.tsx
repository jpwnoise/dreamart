'use client';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import {
  List,
  Plus,
  Upload,
  Download,
  Layers,
  Tag,
  History,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SubNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const subNavItems: SubNavItem[] = [
  { name: 'Lista', href: '/admin/vendedores', icon: <List size={18} /> },
  { name: 'Crear', href: '/admin/vendedores/crear', icon: <Plus size={18} /> },
];

export default function PrototiposLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      {/* Sub-navbar horizontal con scroll */}
      <nav className="flex gap-3 overflow-x-auto py-2 px-4 bg-gray-900 rounded-lg shadow-sm scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {subNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className="relative flex-shrink-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors text-gray-200
                  ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-blue-500 hover:text-white'}`}
              >
                {item.icon}
                <span className="font-medium whitespace-nowrap">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-subnav-indicator"
                    className="absolute left-0 bottom-0 h-1 w-full bg-blue-400 rounded-t"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Contenido principal */}
      <div className="mt-4">{children}</div>
    </div>
  );
}
