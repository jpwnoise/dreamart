'use client';

import Link from 'next/link';
import React from 'react';

interface Mayorista {
  _id: string;
  name: string;
  email: string;
  telefono?: string;
  createdAt: string;
}

const dummyMayoristas: Mayorista[] = [
  { _id: '1', name: 'Mayorista A', email: 'mayoristaA@email.com', telefono: '123456789', createdAt: '2025-01-01' },
  { _id: '2', name: 'Mayorista B', email: 'mayoristaB@email.com', telefono: '987654321', createdAt: '2025-01-05' },
];

export default function MayoristasPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Mayoristas</h1>
        <Link
          href="/admin/mayoristas/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Crear Mayorista
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Registrado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyMayoristas.map((m) => (
              <tr key={m._id}>
                <td className="px-6 py-4">{m.name}</td>
                <td className="px-6 py-4">{m.email}</td>
                <td className="px-6 py-4">{m.telefono || '-'}</td>
                <td className="px-6 py-4">{m.createdAt}</td>
                <td className="px-6 py-4 space-x-2">
                  <Link
                    href={`/admin/mayoristas/view/${m._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/admin/mayoristas/edit/${m._id}`}
                    className="text-green-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => alert(`Eliminar ${m.name}`)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
