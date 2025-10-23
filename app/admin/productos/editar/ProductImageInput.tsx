'use client';

import React from 'react';

export default function ProductImageInput({
  productName,
  imagePreview,
  imageFile,
  onImageChangeAction,
  onCancelImageAction
}: {
  productName: string;
  imagePreview: string | null;
  imageFile: File | null;
  onImageChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelImageAction: () => void;
}) {
  return (
    <div className="flex flex-col items-center ">
      <img
        src={imagePreview || '/no-image.jpg'}
        alt={productName}
        className="w-64 h-64 object-cover rounded-lg shadow-md mb-4"
      />
      <label className="block mb-2 font-semibold ">
        {imageFile ? '✅ Nueva imagen seleccionada' : 'Actualizar Imagen'}
      </label>
      <input type="file" accept="image/*" onChange={onImageChangeAction}  
        className='border border-blue-500 p-2 rounded bg-blue-900 hover:border-pink-500 hover:cursor-pointer' />
      {imageFile && (
        <button
          type="button"
          onClick={onCancelImageAction}
          className="mt-2 text-sm text-red-400 hover:text-red-300"
        >
          Cancelar cambio de imagen
        </button>
      )}
    </div>
  );
}
