import { useState, useEffect } from "react";

export interface Category {
    _id: string;
    name: string;
}

interface SelectCategoriesInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SelectCategoriesInput({ value, onChange }: SelectCategoriesInputProps) {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await fetch('/api/admin/categories');
                if (res.ok) {
                    const data = await res.json();
                    const categoryNames = data.categories.map((c: Category) => c.name);
                    setCategories(categoryNames);
                    if (categoryNames.length > 0 && !value) {
                        onChange(categoryNames[0]); // Setear la primera
                    }
                } else {
                    setCategories(['Sin categoría']);
                    if (!value) onChange('Sin categoría');
                }
            } catch (error) {
                console.error('Error cargando categorías:', error);
                setCategories(['Sin categoría']);
                if (!value) onChange('Sin categoría');
            }
        }
        loadCategories();
    }, []);

    return (
        <div>
            <label className="block mb-1 font-semibold">Categoría</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 border rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
            >
                {categories.length === 0 && (
                    <option value="" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                        Cargando...
                    </option>
                )}
                {categories.map((cat) => (
                    <option
                        key={cat}
                        value={cat}
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    >
                        {cat}
                    </option>
                ))}
            </select>
        </div>
    );
}