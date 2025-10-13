'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const categories = ['Figuras', 'Joyería', 'Llaveros'];

export default function CrearProductoPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [price, setPrice] = useState('');
    const [inventory, setInventory] = useState('');
    const [sku, setSku] = useState('');
    const [status, setStatus] = useState('activo');
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMainImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('price', price);
            formData.append('inventory', inventory);
            formData.append('sku', sku);
            formData.append('status', status);
            if (mainImage) formData.append('mainImage', mainImage);

            const res = await fetch('/api/admin/productos', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || 'Ocurrió un error al crear el producto.');
            } else {
                setMessage('Producto creado exitosamente!');
                router.push('/admin/productos'); // redirigir a la lista
            }
        } catch (err) {
            console.error(err);
            setMessage('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Crear Producto</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-2xl"
            >
                <div>
                    <label className="block mb-1 font-semibold">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-3 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Descripción</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-3 border rounded"
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Categoría</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 border rounded"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-semibold">Precio</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="w-full p-3 border rounded"
                            min={0}
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Inventario</label>
                        <input
                            type="number"
                            value={inventory}
                            onChange={(e) => setInventory(e.target.value)}
                            required
                            className="w-full p-3 border rounded"
                            min={0}
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">SKU</label>
                    <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full p-3 border rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Estado</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-3 border rounded"
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Imagen Principal</label>
                    <input type="file" onChange={handleMainImageChange} accept="image/*" />
                    {preview && (
                        <img src={preview} alt="Preview" className="mt-2 w-48 h-48 object-cover rounded" />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                >
                    {loading ? 'Creando...' : 'Crear Producto'}
                </button>

                {message && <p className="mt-2 text-center text-yellow-600">{message}</p>}
            </form>
        </div>
    );
}
