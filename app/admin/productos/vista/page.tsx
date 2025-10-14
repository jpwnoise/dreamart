'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '@/app/types/product';

export default function VerProducto() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [product, setProduct] = useState<Product | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/productos?id=${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error al cargar producto:', err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl text-purple-500">Cargando producto...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-200 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-purple-500 text-center">
        {product.name}
      </h1>

      {/* Imagen principal */}
      <div className="flex justify-center mb-6">
        <div className="relative group">
          <img
            src={product.image || '/no-image.jpg'}
            alt={product.name}
            className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-lg shadow-xl border-2 border-gray-700 cursor-pointer transform transition-transform duration-300 group-hover:scale-105"
            onClick={() => setImageModalOpen(true)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <p className="text-white text-lg font-semibold">Click para ampliar</p>
          </div>
        </div>
      </div>

      {/* Información del producto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-200 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
          <p className="font-semibold text-purple-500 mb-1">Categoría</p>
          <p>{product.category}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
          <p className="font-semibold text-purple-500 mb-1">Subcategoría</p>
          <p>{product.subcategory}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
          <p className="font-semibold text-purple-500 mb-1">Precio</p>
          <p>${product.price}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
          <p className="font-semibold text-purple-500 mb-1">Estado</p>
          <p>{product.active ? 'Activo' : 'Inactivo'}</p>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
        <p className="font-semibold text-purple-500 mb-2">Descripción</p>
        <p className="text-gray-300">{product.description}</p>
      </div>

      {/* Modal de imagen */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
          onClick={() => setImageModalOpen(false)}
        >
          <img
            src={product.image || '/no-image.jpg'}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transform transition-transform duration-300 hover:scale-105"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-purple-500"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
