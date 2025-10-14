// app/admin/productos/eliminar/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Product } from '@/app/types/product';
import LoadingSpinner from '@/app/components/LoadingSpinner';

function EliminarProductoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push('/admin/productos');
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/productos?id=${id}`);
        if (!res.ok) {
          setMessage('Producto no encontrado');
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setMessage('Error al cargar el producto');
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleEliminar = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/admin/productos?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage('❌ ' + (data.error || 'Error al eliminar el producto'));
      } else {
        setMessage('✅ Producto eliminado correctamente (oculto del sitio web)');
        setTimeout(() => {
          router.push('/admin/productos');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al conectar con el servidor.');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">
          {message || 'Cargando producto...'}
        </div>
      </div>
    );
  }

  return (
    <>
    {loading && <LoadingSpinner/>}
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-red-500">
            ⚠️ Eliminar Producto
          </h1>

          <div className="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-md space-y-6">
            {/* Advertencia */}
            <div className="bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded">
              <p className="font-semibold text-yellow-200">
                ⚠️ Atención: Esta acción ocultará el producto del sitio web
              </p>
              <p className="text-sm text-yellow-100 mt-2">
                El producto NO será eliminado permanentemente. Solo se marcará como inactivo 
                y dejará de mostrarse en el catálogo público. Podrás reactivarlo después si lo necesitas.
              </p>
            </div>

            {/* Información del producto */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Imagen */}
              <div className="flex-shrink-0">
                <img
                  src={product.image || '/no-image.jpg'}
                  alt={product.name}
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/no-image.jpg';
                  }}
                />
              </div>

              {/* Detalles */}
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Nombre:</p>
                  <p className="text-xl font-bold">{product.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Descripción:</p>
                  <p className="text-gray-300">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Categoría:</p>
                    <p className="font-semibold">{product.category}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Subcategoría:</p>
                    <p className="font-semibold">{product.subcategory}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Precio:</p>
                    <p className="font-semibold text-green-400">${product.price}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Inventario:</p>
                    <p className="font-semibold">{product.inventory} unidades</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">SKU:</p>
                    <p className="font-semibold">{product.sku || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Estado:</p>
                    <p className={`font-semibold ${
                      product.active === true ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {product.active}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => router.push('/admin/productos')}
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(true)}
                disabled={loading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded disabled:opacity-50"
              >
                Eliminar (ocultar)
              </button>
            </div>

            {message && (
              <p className={`text-center font-semibold ${
                message.includes('✅') ? 'text-green-400' : 'text-red-400'
              }`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 text-gray-200 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-500">
              ⚠️ Confirmar eliminación
            </h2>
            
            <p className="mb-6 text-gray-300">
              ¿Estás seguro de que deseas ocultar el producto <strong>"{product.name}"</strong> del sitio web?
            </p>

            <div className="bg-gray-900 rounded p-3 mb-6">
              <p className="text-sm text-yellow-300">
                • El producto dejará de aparecer en el catálogo público
              </p>
              <p className="text-sm text-yellow-300">
                • Se mantendrá en el historial de productos
              </p>
              <p className="text-sm text-yellow-300">
                • Podrás reactivarlo en cualquier momento
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={loading}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold disabled:opacity-50"
              >
                {loading ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function EliminarProducto() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    }>
      <EliminarProductoContent />
    </Suspense>
  );
}