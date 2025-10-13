'use client';

import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">DreamArt Admin</h1>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard" className="hover:text-yellow-300">Dashboard</Link>
          <Link href="/admin/clientes" className="hover:text-yellow-300">Clientes</Link>
          <Link href="/admin/productos" className="hover:text-yellow-300">Productos</Link>
          <Link href="/admin/pedidos" className="hover:text-yellow-300">Pedidos</Link>
          <Link href="/admin/ventas" className="hover:text-yellow-300">Ventas</Link>
          <Link href="/admin/configuracion" className="hover:text-yellow-300">Configuración</Link>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
 