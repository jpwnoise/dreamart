import Modal from "@/app/components/Modal";
import ICategory from "./ICategory";
import toast from 'react-hot-toast';
import { useState } from 'react';

type NewSubCategoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category: ICategory | null
};

// == MODAL PARA AGREGAR NUEVAS SUBCATEGORIAS 
export default function NewSubcategoryModal({ isOpen, onClose, onSuccess, category }: NewSubCategoryModalProps) {
    console.log(`Abriendo modal new subcat para la categoria ${category}`);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    if (!category) return null;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('El nombre no puede estar vacío');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/subcategories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category: category._id }),
            });

            
            const resData = await res.json();
            if (!res.ok) {
                throw new Error(resData.message || 'Error al crear la subcategoría');
            }
            console.log(resData)
            toast.success(`Subcategoría "${resData.name}" creada con éxito`);
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
        <Modal isOpen={isOpen} onClose={onClose} title="Nueva subcategoría">
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-600">
                    Se agregará a la categoría: <strong>{category.name}</strong>
                </p>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre de la subcategoría
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
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={loading}
                    >
                        {loading ? 'Guardando…' : 'Guardar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}