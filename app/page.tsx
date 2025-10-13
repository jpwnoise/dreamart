import ProductCard from './components/ProductCard';

async function getProducts() {
  try {
    const res = await fetch('http://localhost:3000/api/products', {
      cache: 'no-store' // Siempre datos frescos
    });
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Hero Section - Full background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900"></div>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
          <h1 className="text-7xl md:text-8xl font-bold text-white drop-shadow-2xl">
            DreamArt
          </h1>

          <p className="text-3xl md:text-4xl text-gray-200 font-light drop-shadow-lg">
            De tus sueños al arte
          </p>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-lg">
            Figuras coleccionables y joyería geek impresa en 3D con detalle profesional
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-lg text-xl font-semibold transition-all hover:scale-105 shadow-2xl">
              Ver Catálogo
            </button>
            <button className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-10 py-5 rounded-lg text-xl font-semibold transition-all shadow-2xl">
              Contactar
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="text-white/50 text-sm">Scroll</div>
          <div className="text-white/50 text-2xl">↓</div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Explora por Categoría
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Categoría Figuras */}
          <div className="group relative h-64 rounded-xl overflow-hidden cursor-pointer">
            <img
              src="/images/figuras-coleccionables-bg.png"
              alt="Figuras"
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl mb-4">🎮</span>
              <h3 className="text-3xl font-bold text-white">Figuras</h3>
              <p className="text-gray-300 mt-2">Coleccionables únicos</p>
            </div>
          </div>

          {/* Categoría Joyería */}
          <div className="group relative h-64 rounded-xl overflow-hidden cursor-pointer">
            <img
              src="/images/joyeria.png"
              alt="Joyería"
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl mb-4">💍</span>
              <h3 className="text-3xl font-bold text-white">Joyería</h3>
              <p className="text-gray-300 mt-2">Diseños geek personalizados</p>
            </div>
          </div>

          {/* Categoría Llaveros */}
          <div className="group relative h-64 rounded-xl overflow-hidden cursor-pointer">
            <img
              src="/images/llaveros.jpg"
              alt="Llaveros"
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl mb-4">🔑</span>
              <h3 className="text-3xl font-bold text-white">Llaveros</h3>
              <p className="text-gray-300 mt-2">Mini figuras detalladas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados - DINÁMICO desde BD */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Productos Destacados
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">No hay productos destacados aún</p>
            <p className="mt-2">Agrega productos desde el panel de administración</p>
          </div>
        )}
      </section>
    </main>
  );
}