import { useEffect, useState } from "react";
import ISubcategory from "./ISubcategory";
import ICategory from "./ICategory";
import Modal from "@/app/components/Modal";

// Subcategory Form Modal para editar
function EditSubcategoryFormModal({ isOpen, onClose, subcategory, categories, onSuccess }: { isOpen: boolean, onClose: () => void, subcategory: ISubcategory, categories: ICategory[], onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subcategory) {
      setName(subcategory.name);
      setCategoryId(subcategory.category._id);
    } else {
      setName('');
      setCategoryId('');
    }
  }, [subcategory, isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = subcategory
        ? `/api/admin/subcategories?id=${subcategory._id}`
        : '/api/admin/subcategories';

      const method = subcategory ? 'PUT' : 'POST';

      // Buscar el nombre de la categoría
      const category = categories.find(c => c._id === categoryId)?.name || categoryId;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar');
      }

      onSuccess();
      onClose();
      setName('');
      setCategoryId('');
    } catch (err) {
      const error = err as globalThis.Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={subcategory ? 'Editar Subcategoría' : 'Nueva Subcategoría'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Categoría
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nombre de la Subcategoría
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Aretes"
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditSubcategoryFormModal