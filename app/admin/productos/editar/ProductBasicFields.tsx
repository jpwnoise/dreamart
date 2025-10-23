'use client';

import React from 'react';
import SelectCategoriesInput from '../create/selectCategories';
import SelectSubcategoriesInput from '../create/selectSubcategories';

interface Props {
  formData: {
    name: string;
    category: string;
    subcategory: string;
    active: boolean;
  };
  product: {
    name: string;
    category: string;
    subcategory: string;
    active: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

export default function ProductBasicFields({
  formData,
  product,
  onChange,
  onCategoryChange,
  onSubcategoryChange
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-gray-400 text-sm mb-1">Actual: {product.name}</p>
        <label className="block mb-1 font-semibold">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Dejar vacío para mantener el actual"
          className="w-full p-2 border rounded text-gray-400"
        />
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-1">
          Actual: {product.active ? 'activo' : 'inactivo'}
        </p>
        <label className="block mb-1 font-semibold">Estado</label>
        <select
          name="active"
          value={formData.active ? 'activo' : 'inactivo'}
          onChange={onChange}
          className="w-full p-2 border rounded text-gray-900 bg-white"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-1">Actual: {product.category}</p>
        <SelectCategoriesInput
          value={formData.category}
          onChange={onCategoryChange}
        />
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-1">Actual: {product.subcategory}</p>
        <SelectSubcategoriesInput
          value={formData.subcategory}
          onChange={onSubcategoryChange}
          category={formData.category}
        />
      </div>
    </div>
  );
}