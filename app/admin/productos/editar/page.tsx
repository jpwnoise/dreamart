'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, ChangeEvent, FormEvent, Suspense } from 'react';
import { Product } from '@/app/types/product';
import SelectCategoriesInput from '../create/selectCategories';
import SelectSubcategoriesInput from '../create/selectSubcategories';

function EditarProductoContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [product, setProduct] = useState<Product | null>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    inventory: '',
    sku: '',
    status: 'activo',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [changedFields, setChangedFields] = useState<any>({});

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/productos?id=${id}`);
        const data = await res.json();
        setProduct(data);
        
        const initial = {
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          subcategory: data.subcategory || '',
          price: data.price?.toString() || '',
          inventory: data.inventory?.toString() || '',
          sku: data.sku || '',
          status: data.status || 'activo',
        };
        
        setFormData(initial);
        setOriginalData(initial);
        setImagePreview(data.image || '/images/no-image.jpg');
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setMessage('Error al cargar el producto');
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value, subcategory: '' }));
  };

  const handleSubcategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subcategory: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const detectChanges = () => {
    const changes: any = {};
    
    // Detectar cambios en campos de texto
    Object.keys(formData).forEach((key) => {
      const currentValue = (formData as any)[key];
      const originalValue = originalData[key];
      
      // Solo agregar si el campo tiene valor Y es diferente al original
      if (currentValue && currentValue !== originalValue) {
        changes[key] = {
          anterior: originalValue,
          nuevo: currentValue
        };
      }
    });

    // Agregar imagen si cambió
    if (imageFile) {
      changes.image = {
        anterior: 'Imagen actual',
        nuevo: imageFile.name
      };
    }

    return changes;
  };

  const handlePreSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const changes = detectChanges();
    
    if (Object.keys(changes).length === 0) {
      setMessage('⚠️ No hay cambios para guardar');
      return;
    }

    setChangedFields(changes);
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setMessage('');

    try {
      const submitData = new FormData();
      
      // Solo enviar campos que cambiaron
      Object.keys(changedFields).forEach((key) => {
        if (key !== 'image') {
          const currentValue = (formData as any)[key];
          if (currentValue) {
            submitData.append(key, currentValue);
          }
        }
      });

      // Agregar imagen si cambió
      if (imageFile) {
        submitData.append('mainImage', imageFile);
      }

      // IMPORTANTE: Siempre enviar los datos originales como fallback
      // para que el backend no pierda información
      Object.keys(originalData).forEach((key) => {
        if (!submitData.has(key)) {
          submitData.append(key, originalData[key]);
        }
      });

      const res = await fetch(`/api/admin/productos?id=${id}`, {
        method: 'PUT',
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage('❌ ' + (data.error || 'Error al actualizar el producto'));
      } else {
        setMessage('✅ Producto actualizado correctamente!');
        
        // Actualizar estados con los nuevos datos
        if (data.image) {
          setImagePreview(data.image);
        }
        setProduct(data);
        
        const newData = {
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          subcategory: data.subcategory || '',
          price: data.price?.toString() || '',
          inventory: data.inventory?.toString() || '',
          sku: data.sku || '',
          status: data.status || 'activo',
        };
        
        setFormData(newData);
        setOriginalData(newData);
        setImageFile(null);
        setChangedFields({});
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando producto...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Editar: {product.name}
        </h1>

        <form
          onSubmit={handlePreSubmit}
          className="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-md space-y-6 max-w-4xl mx-auto"
        >
          {/* Imagen */}
          <div className="flex flex-col items-center">
            <img
              src={imagePreview || '/no-image.jpg'}
              alt={product.name}
              className="w-64 h-64 object-cover rounded-lg shadow-md mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/no-image.jpg';
              }}
            />
            <label className="block mb-2 font-semibold">
              {imageFile ? '✅ Nueva imagen seleccionada' : 'Actualizar Imagen'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-gray-200"
            />
            {imageFile && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(product.image || '/placeholder-product.jpg');
                }}
                className="mt-2 text-sm text-red-400 hover:text-red-300"
              >
                Cancelar cambio de imagen
              </button>
            )}
          </div>

          {/* Primera grilla: Nombre, Categoría, Subcategoría, Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Actual: {product.name}</p>
              <label className="block mb-1 font-semibold">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dejar vacío para mantener el actual"
                className="w-full p-2 border rounded text-gray-400"
              />
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Actual: {product.status}</p>
              <label className="block mb-1 font-semibold">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
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
                onChange={handleCategoryChange}
              />
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Actual: {product.subcategory}</p>
              <SelectSubcategoriesInput
                value={formData.subcategory}
                onChange={handleSubcategoryChange}
                category={formData.category}
              />
            </div>
          </div>

          {/* Segunda grilla: Precio, Inventario, SKU */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Actual: ${product.price}</p>
              <label className="block mb-1 font-semibold">Precio</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Mantener actual"
                className="w-full p-2 border rounded text-gray-400"
                min={0}
                step="0.01"
              />
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Actual: {product.inventory}</p>
              <label className="block mb-1 font-semibold">Inventario</label>
              <input
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                placeholder="Mantener actual"
                className="w-full p-2 border rounded text-gray-400"
                min={0}
              />
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Actual: {product.sku || 'Sin SKU'}</p>
              <label className="block mb-1 font-semibold">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Mantener actual"
                className="w-full p-2 border rounded text-gray-400"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <p className="text-gray-400 text-sm mb-1">Descripción actual:</p>
            <p className="text-gray-400 text-sm italic mb-2 line-clamp-2">{product.description}</p>
            <label className="block mb-1 font-semibold">Nueva Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Dejar vacío para mantener la actual"
              className="w-full p-3 border rounded text-gray-900"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Revisar cambios'}
          </button>

          {message && (
            <p className={`mt-2 text-center font-semibold ${
              message.includes('✅') ? 'text-green-400' : 
              message.includes('⚠️') ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {message}
            </p>
          )}
        </form>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
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
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmedSubmit}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
              >
                Confirmar actualización
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function EditarProducto() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <EditarProductoContent />
    </Suspense>
  );
}