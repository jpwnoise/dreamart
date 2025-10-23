'use client';

import React from 'react';

export default function ProductImageInput({
  productName,
  imagePreview,
  imageFile,
  onImageChange,
  onCancelImage
}: {
  productName: string;
  imagePreview: string | null;
  imageFile: File | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelImage: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={imagePreview || '/no-image.jpg'}
        alt={productName}
        className="w-64 h-64 object-cover rounded-lg shadow-md mb-4"
      />
      <label className="block mb-2 font-semibold">
        {imageFile ? '✅ Nueva imagen seleccionada' : 'Actualizar Imagen'}
      </label>
      <input type="file" accept="image/*" onChange={onImageChange} />
      {imageFile && (
        <button
          type="button"
          onClick={onCancelImage}
          className="mt-2 text-sm text-red-400 hover:text-red-300"
        >
          Cancelar cambio de imagen
        </button>
      )}
    </div>
  );
}
