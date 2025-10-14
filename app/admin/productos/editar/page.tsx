'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Product } from '@/app/types/product';

export default function EditarProducto() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    inventory: '',
    sku: '',
    status: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/productos?id=${id}`);
        const data = await res.json();
        setProduct(data);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          subcategory: data.subcategory || '',
          price: data.price?.toString() || '',
          inventory: data.inventory?.toString() || '',
          sku: data.sku || '',
          status: data.status || 'activo',
        });
        setImagePreview(data.image || '/images/no-image.jpg');
      } catch (err) {
        console.error('Error al cargar producto:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const submitData = new FormData();
      for (const key in formData) {
        submitData.append(key, (formData as any)[key]);
      }
      if (imageFile) submitData.append('mainImage', imageFile);

      const res = await fetch(`/api/admin/productos?id=${id}`, {
        method: 'PUT',
        body: submitData,
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Error al actualizar el producto');
      } else {
        setMessage('Producto actualizado correctamente!');
        if (data.image) setImagePreview(data.image);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Editar producto: {product.name}</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-md space-y-6 max-w-4xl mx-auto"
      >
        {/* Imagen */}
        <div className="flex flex-col items-center">
          <img
            src={imagePreview || '/images/no-image.jpg'}
            alt={product.name}
            className="w-64 h-64 object-cover rounded-lg shadow-md mb-2"
          />
          <label className="block mb-2 font-semibold">Actualizar Imagen</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Primera grilla: Nombre, Categoría, Subcategoría, Estado */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Actual: {product.name}</p>
            <label className="block mb-1 font-semibold">Nuevo Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <p className="text-gray-400 text-sm">Actual: {product.category}</p>
            <label className="block mb-1 font-semibold">Nueva Categoría</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <p className="text-gray-400 text-sm">Actual: {product.subcategory}</p>
            <label className="block mb-1 font-semibold">Nueva Subcategoría</label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <p className="text-gray-400 text-sm">Actual: {product.status}</p>
            <label className="block mb-1 font-semibold">Nuevo Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Segunda grilla: Precio, Inventario, SKU */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Actual: {product.price}</p>
            <label className="block mb-1 font-semibold">Nuevo Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min={0}
              step="0.01"
            />
          </div>

          <div>
            <p className="text-gray-400 text-sm">Actual: {product.inventory}</p>
            <label className="block mb-1 font-semibold">Nuevo Inventario</label>
            <input
              type="number"
              name="inventory"
              value={formData.inventory}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min={0}
            />
          </div>

          <div>
            <p className="text-gray-400 text-sm">Actual: {product.sku}</p>
            <label className="block mb-1 font-semibold">Nuevo SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Descripción completa */}
        <div>
          <p className="text-gray-400 text-sm">Actual: {product.description}</p>
          <label className="block mb-1 font-semibold">Nueva Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded"
        >
          {loading ? 'Actualizando...' : 'Actualizar Producto'}
        </button>

        {message && <p className="mt-2 text-center text-green-400">{message}</p>}
      </form>
    </div>
  );
}
