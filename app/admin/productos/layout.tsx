'use client';
import Link from 'next/link';
import React from 'react';

export default function ProductosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Sub-navbar del módulo productos */}
      <nav className="flex flex-wrap gap-4 mb-6 bg-gray-200 p-4 rounded">
        <Link href="/admin/productos" className="font-semibold hover:text-blue-600">
          Lista
        </Link>
        <Link href="/admin/productos/create" className="font-semibold hover:text-blue-600">
          Crear
        </Link>
        <Link href="/admin/productos/import" className="font-semibold hover:text-blue-600">
          Importar
        </Link>
        <Link href="/admin/productos/export" className="font-semibold hover:text-blue-600">
          Exportar
        </Link>
        <Link href="/admin/productos/inventario" className="font-semibold hover:text-blue-600">
          Inventario
        </Link>
        <Link href="/admin/productos/categorias" className="font-semibold hover:text-blue-600">
          Categorías
        </Link>
        <Link href="/admin/productos/historial" className="font-semibold hover:text-blue-600">
          Historial de Cambios
        </Link>
      </nav>

      {/* Contenido principal del módulo */}
      <div>{children}</div>
    </div>
  );
}
