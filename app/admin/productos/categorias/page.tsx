'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ICategory from './ICategory';
import NewCategoryModal from './NewCategoryModal';
import EditCategoryFormModal from './EditCategoryModal';
import EditSubcategoryFormModal from './EditSubcategotyFormModal';
import ISubcategory from './ISubcategory';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Modal states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Edit states
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<ISubcategory | null>(null);
  const [deletingItem, setDeletingItem] = useState<ICategory | ISubcategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, subRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/subcategories'),
      ]);

      const catData = await catRes.json();
      console.log('Categorias obtenidas');
      
      const subData = await subRes.json();
      console.log('Subcategorias obtenidas');

      setCategories(catData.categories || []);
      setSubcategories(subData.subcategories || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    setDeleteLoading(true);
    if (!deletingItem) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${deletingItem._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new globalThis.Error('Error al eliminar');
      }

      setMessage('✅ Categoría eliminada');
      loadData();
      setDeleteModalOpen(false);
      setDeletingItem(null);
    } catch (error) {
      setMessage('❌ Error al eliminar categoría');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteSubcategory = async () => {
    setDeleteLoading(true);
    if (!deletingItem) return;
    try {
      const res = await fetch(`/api/admin/subcategories?id=${deletingItem._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new globalThis.Error('Error al eliminar');
      }

      setMessage('✅ Subcategoría eliminada');
      loadData();
      setDeleteModalOpen(false);
      setDeletingItem(null);
    } catch (error) {
      setMessage('❌ Error al eliminar subcategoría');
    } finally {
      setDeleteLoading(false);
    }
  };

  /** Obtiene las subcategorias por id de categoria  */
  const getSubcategoriesByCategory = (categoryId: string) => {
    return subcategories.filter((sub: ISubcategory) => {
      return sub.category._id === categoryId; 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestión de Categorías</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
            }`}>
            {message}
          </div>
        )}

        {/* Nueva categoria*/ }
        <NewCategoryModal isOpen={categoryModalOpen} onClose={()=>{setCategoryModalOpen(false)}}  onSuccess={()=>{}}/>

        {/* Categories Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Categorías</h2>
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              <Plus size={20} />
              Nueva Categoría
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg overflow-hidden">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No hay categorías. Crea una para empezar.
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {categories.map((category: ICategory) => (
                  <div key={category._id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <div className="flex gap-2">
                        {/** boton de [+] */}
                        <button
                          onClick={() => {
                            setEditingSubcategory(null);
                            setEditingCategory(category);
                            setSubcategoryModalOpen(true);
                          }}
                          className="p-2 bg-green-600 hover:bg-green-700 rounded transition"
                          title="Agregar subcategoría"
                        >
                          <Plus size={18} />
                        </button>

                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setCategoryModalOpen(true);
                          }}
                          className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded transition"
                          title="Editar categoría"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingItem({ ...category, type: 'category' });
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                          title="Eliminar categoría"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="ml-6 space-y-2">
                      {getSubcategoriesByCategory(category._id).map((sub: ISubcategory) => (
                        <div
                          key={sub._id}
                          className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                        >
                          <span className="text-gray-300">{sub.name}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingSubcategory(sub);
                                setSubcategoryModalOpen(true);
                              }}
                              className="p-1.5 bg-yellow-600 hover:bg-yellow-700 rounded transition"
                              title="Editar subcategoría"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingItem({ ...sub, type: 'subcategory' });
                                setDeleteModalOpen(true);
                              }}
                              className="p-1.5 bg-red-600 hover:bg-red-700 rounded transition"
                              title="Eliminar subcategoría"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {getSubcategoriesByCategory(category._id).length === 0 && (
                        <div className="text-sm text-gray-500 italic p-2">
                          Sin subcategorías
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {editingCategory && (
          <EditCategoryFormModal
            isOpen={categoryModalOpen}
            onClose={() => {
              setCategoryModalOpen(false);
              setEditingCategory(null);
            }}
            category={editingCategory}
            onSuccess={() => {
              loadData();
              setMessage('✅ Categoría guardada correctamente');
              setTimeout(() => setMessage(''), 3000);
            }}
          />)}

        {editingSubcategory &&
          (<EditSubcategoryFormModal
            isOpen={subcategoryModalOpen}
            onClose={() => {
              setSubcategoryModalOpen(false);
              setEditingSubcategory(null);
              setEditingCategory(null);
            }}
            subcategory={editingSubcategory}
            categories={categories}
            onSuccess={() => {
              loadData();
              setMessage('✅ Subcategoría guardada correctamente');
              setTimeout(() => setMessage(''), 3000);
            }}
          />)}
        {deletingItem && (
          <DeleteConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setDeletingItem(null);
            }}
            onConfirm={deletingItem?.type === 'category' ? handleDeleteCategory : handleDeleteSubcategory}
            itemName={deletingItem?.name}
            loading={deleteLoading}
          />
        )}

      </div>
    </div>
  );
}