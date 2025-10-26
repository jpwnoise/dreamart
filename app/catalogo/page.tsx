'use client';

import { useState, useEffect } from 'react';
import CatalogProductCard from '../components/CatalogProductCard';

export default function CatalogoPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Catálogo</h1>

      {/* Aquí irá el filtro */}
      <div className="mb-6">
        {/* <ProductFilter /> */}
      </div>

      {/* Grilla de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product: any) => (
          <CatalogProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}
