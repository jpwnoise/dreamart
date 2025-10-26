'use client';

import { useRouter } from 'next/navigation';

export default function CatalogoButton() {
  const router = useRouter();

  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-lg text-xl font-semibold transition-all hover:scale-105 shadow-2xl"
      onClick={() => router.push('/catalogo')}
    >
      Ver Catálogo
    </button>
  );
}
