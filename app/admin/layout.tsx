'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Home,
  User,
  Users,
  Package,
  Clipboard,
  DollarSign,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: <Home size={20} /> },
  { name: 'Clientes', href: '/admin/clientes', icon: <User size={20} /> },
  { name: 'Mayoristas', href: '/admin/mayoristas', icon: <Users size={20} /> },
  { name: 'Productos', href: '/admin/productos', icon: <Package size={20} /> },
  { name: 'Pedidos', href: '/admin/pedidos', icon: <Clipboard size={20} /> },
  { name: 'Ventas', href: '/admin/ventas', icon: <DollarSign size={20} /> },
  { name: 'Configuración', href: '/admin/configuracion', icon: <Settings size={20} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10 text-white">
          Dream<span className="text-blue-400">Art</span> Admin
        </h1>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href} className="relative">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                    ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-blue-500 hover:text-white'}`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
