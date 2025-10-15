import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    title: string,
    children: React.ReactNode
}

/** ==== UN SIMPLE MODAL CON LA ESTETICA DARK  */
export default function Modal({ isOpen, onClose, title, children }: ModalProps ) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}