'use client'
import { useEffect, useState } from 'react';
import { Product } from '../types/product';

export default function GiraYDescubreSection() {
  const [producto, setProducto] = useState<Product | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('/api/products/3dmodels');
        const data = await res.json();

        setProductos(data.productos)

        if (!data.productos || data.productos.length === 0) {
          throw new Error('No se recibieron productos');
        }

        // Elegir uno aleatoriamente
        const elegido = data.productos[0];

        // Obtener el modelo 3D por ID
        const modelRes = await fetch(`/api/products/3dmodels/ById?id=${elegido._id}`);
        if (!modelRes.ok) throw new Error('No se pudo cargar el modelo 3D');

        const blob = await modelRes.blob();
        const url = URL.createObjectURL(blob);
        setModelUrl(url);

        setProducto(elegido);
      } catch (err: any) {
        console.error('❌ Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handlePrevModel = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const nuevoProducto = productos[newIndex];
      setCurrentIndex(newIndex);
      setProducto(nuevoProducto);
      reloadModel(nuevoProducto);
      log(newIndex, nuevoProducto);
    }
  };

  const handleNextModel = () => {
    if (currentIndex < productos.length - 1) {
      const newIndex = currentIndex + 1;
      const nuevoProducto = productos[newIndex];
      setCurrentIndex(newIndex);
      setProducto(nuevoProducto);
      reloadModel(nuevoProducto);
      log(newIndex, nuevoProducto);
    }
  };

  const reloadModel = async (producto: { _id: string }) => {
    const modelRes = await fetch(`/api/products/3dmodels/ById?id=${producto._id}`);
    if (!modelRes.ok) throw new Error('No se pudo cargar el modelo 3D');
    const blob = await modelRes.blob();
    const url = URL.createObjectURL(blob);
    setModelUrl(url);
  }

  const log = (index: number, producto: Product) => {
    console.log('Productos:', productos);
    console.log('Índice:', index);
    console.log('Producto:', producto);
  };


  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Gira y descubre</h2>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  if (error || !producto || !modelUrl) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Gira y descubre</h2>
        <div className="text-center text-gray-400">
          <p>No hay productos disponibles en este momento</p>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <h2 className="text-4xl font-bold text-center mb-12 text-white">
        Gira y descubre
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Columna izquierda - Modelo 3D */}
        <div className="relative">
          {/* Columna izquierda - Modelo 3D */}
          {/* Botón izquierdo */}
          <button
            onClick={handlePrevModel}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-gray-800/70 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-10 transition-all duration-300"
            aria-label="Modelo anterior"
          >
            ◀
          </button>
          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
            <model-viewer
              src={modelUrl}
              alt={producto.name}
              auto-rotate
              shadow-intensity="1"
              exposure={0.3}
              camera-controls
              style={{ width: "100%", height: "500px", borderRadius: "1rem" }}
            >
              <hemisphere-light
                intensity="0.8"
                color="#ffe6cc"
                ground-color="#222222"
              ></hemisphere-light>
              <directional-light
                intensity="1.5"
                color="#ffdd99"
                position="2 3 1"
              ></directional-light>
            </model-viewer>

            {/* Indicador de interacción */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600/90 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              🖱️ Arrastra para rotar
            </div>
          </div>

          <button
            onClick={handleNextModel}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 bg-gray-800/70 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg z-10 transition-all duration-300"
            aria-label="Modelo siguiente"
          >
            ▶
          </button>

        </div>

        {/* Columna derecha - Información del producto */}
        <div className="space-y-6">
          <div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {producto.name}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {producto.description}
            </p>
          </div>

          {/* Detalles */}
          <div className="space-y-3">
            {producto.category && (
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-semibold">Categoría:</span>
                <span className="text-gray-200">{producto.category}</span>
              </div>
            )}

            {producto.subcategory && (
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-semibold">Subcategoría:</span>
                <span className="text-gray-200">{producto.subcategory}</span>
              </div>
            )}

            {producto.price && producto.price > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-semibold text-2xl">
                  ${producto.price.toLocaleString('es-MX')} MXN
                </span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex gap-3 flex-wrap">
            <span className="bg-purple-600/20 border border-purple-500/50 text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
              ✨ Vista 3D Interactiva
            </span>
            {producto.featured && (
              <span className="bg-yellow-600/20 border border-yellow-500/50 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium">
                ⭐ Destacado
              </span>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => window.location.href = `/productos/${producto._id}`}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver producto completo →
          </button>

          {/* Información adicional */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mt-6">
            <p className="text-gray-400 text-sm">
              💡 <span className="font-semibold">Tip:</span> Usa tu mouse o dedos para explorar el producto desde todos los ángulos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}