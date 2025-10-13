interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  featured: boolean;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:ring-2 ring-blue-500 transition-all hover:scale-105 cursor-pointer">
      <div className="aspect-square bg-gray-700 flex items-center justify-center relative">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">
            {product.category === 'figuras' && '🎮'}
            {product.category === 'joyeria' && '💍'}
            {product.category === 'llaveros' && '🔑'}
          </span>
        )}
        
        {/* Badge de stock */}
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
            Agotado
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">
          {product.name}
        </h3>
        <p className="text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-400">
            ${product.price}
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all">
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}