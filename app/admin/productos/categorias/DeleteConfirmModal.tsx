import Modal from "@/app/components/Modal";

// Delete Confirmation Modal
export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, loading }: { isOpen: boolean, onClose: () => void, onConfirm: () => {}, itemName: string, loading: boolean }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Eliminación">
      <div className="space-y-4">
        <p className="text-gray-300">
          ¿Estás seguro de que deseas eliminar <strong className="text-white">"{itemName}"</strong>?
        </p>
        <p className="text-sm text-yellow-400">
          Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition disabled:opacity-50"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}