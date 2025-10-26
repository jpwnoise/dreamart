'use client';

import Link from 'next/link';
import { Product } from '@/app/types/product';

export default function CatalogProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-gray-800 text-gray-100 rounded-xl shadow-lg overflow-hidden transition hover:shadow-2xl">
      {/* Imagen del producto */}
      <div className="h-56 overflow-hidden">
        <img
          src={product.image || '/images/no-image.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/images/no-image.jpg';
          }}
        />
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-gray-400">{product.category} / {product.subcategory}</p>
        <div className="text-blue-400 font-bold text-lg">${product.price.toFixed(2)}</div>

        {/* Etiquetas */}
        <div className="flex gap-2 text-xs mt-2">
          {product.featured && (
            <span className="bg-green-700/20 text-green-400 px-2 py-1 rounded-full">Destacado</span>
          )}
          {!product.active && (
            <span className="bg-red-700/20 text-red-400 px-2 py-1 rounded-full">Inactivo</span>
          )}
        </div>

        {/* Acción */}
        <div className="pt-4">
          <Link
            href={`/producto/${product.slug || product._id}`}
            className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
}
