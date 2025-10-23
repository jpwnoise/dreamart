'use client';

import React from 'react';

interface Props {
  description: string;
  originalDescription: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function ProductDescriptionInput({
  description,
  originalDescription,
  onChange
}: Props) {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-1">Descripción actual:</p>
      <p className="text-gray-400 text-sm italic mb-2 line-clamp-2">
        {originalDescription}
      </p>
      <label className="block mb-1 font-semibold">Nueva Descripción</label>
      <textarea
        name="description"
        value={description}
        onChange={onChange}
        placeholder="Dejar vacío para mantener la actual"
        className="w-full p-3 border rounded text-gray-900"
        rows={4}
      />
    </div>
  );
}
