'use client';

import Link from 'next/link';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Product } from '@/app/types/product';
import useCenteredObserver from './useCenteredObserver';
import { motion } from 'framer-motion';

export default function ProductoCard({ product, onDelete }: { product: Product; onDelete: (id: string) => void }) {
    const [ref, isCentered] = useCenteredObserver();

    return (
        <div ref={ref} className="bg-gray-100 rounded-lg shadow p-4 text-gray-900">
            <div className="flex justify-center gap-4">
                <img
                    src={product.image || '/images/no-image.jpg'}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                        e.currentTarget.src = '/images/no-image.jpg';
                    }}
                />
            
            </div>

            <div className="flex justify-center gap-4">
                <div>
                    <h2 className="font-bold text-lg">{product.name}</h2>
                    <p className="text-sm text-gray-600">{product.category} / {product.subcategory}</p>
                </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <span className={`px-2 py-1 rounded ${product.featured ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                    Destacado: {product.featured ? 'Sí' : 'No'}
                </span>
                <span className={`px-2 py-1 rounded ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                    Estado: {product.active ? 'Activo' : 'Inactivo'}
                </span>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                    Precio: ${product.price.toFixed(2)}
                </span>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isCentered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 flex justify-center items-center gap-2 min-h-[48px]" // altura mínima para evitar salto
            >
                <Link href={`/admin/productos/vista?id=${product._id}`} className="p-2 hover:bg-blue-100 rounded-full">
                    <Eye size={20} className="text-blue-600" />
                </Link>
                <Link href={`/admin/productos/editar?id=${product._id}`} className="p-2 hover:bg-yellow-100 rounded-full">
                    <Edit size={20} className="text-yellow-600" />
                </Link>
                <button onClick={() => onDelete(product._id)} className="p-2 hover:bg-red-100 rounded-full">
                    <Trash2 size={20} className="text-red-600" />
                </button>
            </motion.div>

        </div>
    );
}
