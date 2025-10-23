'use client';

import React from 'react';

export default function ModalConfirm({
  visible,
  changedFields,
  onCancel,
  onConfirm
}: {
  visible: boolean;
  changedFields: any;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-gray-200 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Confirmar cambios</h2>

        <p className="mb-4 text-gray-300">
          Los siguientes campos serán actualizados:
        </p>

        <div className="bg-gray-900 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
          {Object.keys(changedFields).map((field) => (
            <div key={field} className="mb-3 pb-3 border-b border-gray-700 last:border-0">
              <p className="font-semibold text-yellow-400 capitalize">{field}:</p>
              <p className="text-sm text-gray-400">
                Anterior: <span className="line-through">{changedFields[field].anterior}</span>
              </p>
              <p className="text-sm text-green-400">
                Nuevo: <span className="font-semibold">{changedFields[field].nuevo}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
          >
            Confirmar actualización
          </button>
        </div>
      </div>
    </div>
  );
}
