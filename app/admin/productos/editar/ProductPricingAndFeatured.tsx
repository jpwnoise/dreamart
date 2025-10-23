'use client';

import React from 'react';

interface Props {
  formData: {
    price: string;
    featured: boolean;
  };
  product: {
    price: number;
    featured: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function ProductPricingAndFeatured({
  formData,
  product,
  onChange
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-gray-400 text-sm mb-1">Actual: ${product.price}</p>
        <label className="block mb-1 font-semibold">Precio</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={onChange}
          placeholder="Mantener actual"
          className="w-full p-2 border rounded text-gray-400"
          min={0}
          step="0.01"
        />
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-1">
          Actual: {product.featured ? 'Destacado' : 'Sin Destacar'}
        </p>
        <label className="block mb-1 font-semibold">Destacado</label>
        <select
          name="featured"
          value={formData.featured ? 'true' : 'false'}
          onChange={onChange}
          className="w-full p-2 border rounded text-gray-900 bg-white"
        >
          <option value="true">Destacado</option>
          <option value="false">Sin Destacar</option>
        </select>
      </div>
    </div>
  );
}
