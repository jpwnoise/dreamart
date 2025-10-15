import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '@/app/components/Modal';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

//=== MODAL PARA LA NUEVA CATEGORIA ===
function NewCategoryModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear la categoría');
      }

      toast.success('Categoría creada con éxito');
      setName('');
      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error desconocido';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Categoría">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre de la categoría
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            disabled={loading}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Guardando…' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default NewCategoryModal;