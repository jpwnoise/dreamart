import { useState, useEffect } from "react";

export interface Subcategory {
    _id: string;
    name: string;
    category: string;
}

interface SelectSubcategoriesInputProps {
    value: string;
    onChange: (value: string) => void;
    category: string; // ← Necesitas saber qué categoría está seleccionada
}

export default function SelectSubcategoriesInput({ 
    value, 
    onChange, 
    category 
}: SelectSubcategoriesInputProps) {
    const [subcategories, setSubcategories] = useState<string[]>([]);

    // Cargar subcategorías cuando cambie la categoría
    useEffect(() => {
        if (category) {
            async function loadSubcategories() {
                try {
                    const res = await fetch(`/api/admin/subcategories?category=${category}`);
                    if (res.ok) {
                        const data = await res.json();
                        const subcategoryNames = data.subcategories.map((s: Subcategory) => s.name);
                        setSubcategories(subcategoryNames);
                        if (subcategoryNames.length > 0 && !value) {
                            onChange(subcategoryNames[0]); // Setear la primera
                        }
                    } else {
                        setSubcategories(['Sin subcategoría']);
                        onChange('Sin subcategoría');
                    }
                } catch (error) {
                    console.error('Error cargando subcategorías:', error);
                    setSubcategories(['Sin subcategoría']);
                    onChange('Sin subcategoría');
                }
            }
            loadSubcategories();
        } else {
            setSubcategories([]);
            onChange('');
        }
    }, [category]); // ← Se recarga cuando cambia la categoría

    return (
        <div>
            <label className="block mb-1 font-semibold">Subcategoría</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 border rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                disabled={!category || subcategories.length === 0}
            >
                {subcategories.length === 0 && (
                    <option value="" style={{ color: '#111827', backgroundColor: '#ffffff' }}>
                        {category ? 'Cargando...' : 'Selecciona una categoría primero'}
                    </option>
                )}
                {subcategories.map((subcat) => (
                    <option
                        key={subcat}
                        value={subcat}
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    >
                        {subcat}
                    </option>
                ))}
            </select>
        </div>
    );
}