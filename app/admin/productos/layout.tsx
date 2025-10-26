'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import {
  List,
  Plus,
  Upload,
  Download,
  Layers,
  Tag,
  History,
  MenuSquare,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SubNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const subNavItems: SubNavItem[] = [
  { name: 'Lista', href: '/admin/productos', icon: <List size={18} /> },
  { name: 'Crear', href: '/admin/productos/create', icon: <Plus size={18} /> },
  { name: 'Importar', href: '/admin/productos/import', icon: <Upload size={18} /> },
  { name: 'Exportar', href: '/admin/productos/export', icon: <Download size={18} /> },
  { name: 'Inventario', href: '/admin/productos/inventario', icon: <Layers size={18} /> },
  { name: 'Categorías', href: '/admin/productos/categorias', icon: <Tag size={18} /> },
  { name: 'Historial', href: '/admin/productos/historial', icon: <History size={18} /> },
];

export default function ProductosLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);


  return (
    <div className="flex flex-col">

      {/* Botón para móviles */}
      <div className="md:hidden px-4 py-2 flex justify-end">
        <button
          className="flex items-center gap-2 text-white bg-blue-600 px-3 py-2 rounded shadow"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <MenuSquare size={20} />
          <span className="text-sm font-medium">Opciones</span>
        </button>
      </div>


      {/* Sub-navbar horizontal con scroll */}
      {/* Sub-navbar horizontal en escritorio */}
      <nav className="hidden md:flex gap-3 overflow-x-auto py-2 px-4 bg-gray-900 rounded-lg shadow-sm scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
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

      {/* Submenú vertical en móviles */}
      {subMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-gray-900 rounded-lg shadow-sm flex flex-col gap-2">
          {subNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSubMenuOpen(false)}>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-200
              ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-blue-500 hover:text-white'}`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Contenido principal */}
      <div className="mt-4">{children}</div>
    </div>
  );
}
