'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash2, Plus, Loader2, PackageSearch } from 'lucide-react';
import { Product } from '@/app/types/product';


export default function ListaProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/productos');
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower)
      )
    );
  }, [search, products]);

  // eliminacion
  const handleDelete = async (id: string) => {
        router.push(`/admin/productos/eliminar?id=${id}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista de Productos</h1>
        <Link
          href="/admin/productos/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <Plus size={18} /> Nuevo Producto
        </Link>
      </div>

      {/* BUSCADOR */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-md"
        />
      </div>

      {/* TABLA */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-200 text-left uppercase text-xs font-semibold">
              <tr>
                <th className="p-3">Imagen</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Inventario</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">
                    <img
                      src={p.image || '/images/no-image.jpg'}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/no-image.jpg';
                      }}
                    />
                  </td>
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">${p.price.toFixed(2)}</td>
                  <td className="p-3">{p.inventory}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.active === true
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {p.active}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <Link
                      href={`/admin/productos/view/${p._id}`}
                      className="p-2 hover:bg-blue-100 rounded-full"
                    >
                      <Eye size={18} className="text-blue-600" />
                    </Link>
                    <Link
                      href={`/admin/productos/editar?id=${p._id}`}
                      className="p-2 hover:bg-yellow-100 rounded-full"
                    >
                      <Edit size={18} className="text-yellow-600" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-2 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No se encontraron productos.
        </p>
      )}
    </div>
  );
}
