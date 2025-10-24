'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, ChangeEvent, FormEvent, Suspense } from 'react';
import { Product } from '@/app/types/product';
import SelectCategoriesInput from '../create/selectCategories';
import SelectSubcategoriesInput from '../create/selectSubcategories';
import { detectChanges } from './detectChanges';
import { submitProductUpdate } from './submitProductUpdate';
import ModalConfirm from './ModalConfirm';
import ProductImageInput from './ProductImageInput';
import Model3DInput from './Model3dInput';
import ProductBasicFields from './ProductBasicFields';
import ProductPricingAndFeatured from './ProductPricingAndFeatured';
import ProductDescriptionInput from './ProductDescriptionInput';

/** ==== COMPONENTE REACT ==== */
function EditarProductoContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [product, setProduct] = useState<Product | null>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [model3dFile, setModel3dFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    featured: false,
    price: '',
    model3d: 'Sin Modelo',
    active: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [changedFields, setChangedFields] = useState<any>({});
  //** estados para los erroes al cargar modelos 3d */
  const [modelError, setModelError] = useState<string | null>(null);

  /** OBTENER PRODUCTO */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/productos?id=${id}`);
        const data = await res.json();
        setProduct(data);

        const initial = {
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          subcategory: data.subcategory || '',
          price: data.price?.toString() || '',
          featured: data.featured || false,
          model3d: data.model3d || 'Sin modelo',
          active: data.active || false, // Inicializar con valor real
        };

        setFormData(initial);
        setOriginalData(initial);
        setImagePreview(data.image || '/images/no-image.jpg');
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setMessage('Error al cargar el producto');
      }
    };

    fetchProduct();
  }, [id]);



  /** HANDLERS */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === 'true' ? true : value === 'false' ? false : value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value, subcategory: '' }));
  };

  const handleSubcategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subcategory: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePreSubmit = (e: FormEvent) => {
    e.preventDefault();

    const changes = detectChanges({ formData, originalData, imageFile, model3dFile });

    if (Object.keys(changes).length === 0) {
      setMessage('⚠️ No hay cambios para guardar');
      return;
    }

    setChangedFields(changes);
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setMessage('');

    try {
      const { res, data } = await submitProductUpdate({
        id,
        changedFields,
        formData,
        originalData,
        imageFile, 
        model3dFile
      });

      if (!res.ok) {
        setMessage('❌ ' + (data.error || 'Error al actualizar el producto'));
      } else {
        setMessage('✅ Producto actualizado correctamente!');
        if (data.image) setImagePreview(data.image);
        setProduct(data);

        const newData = {
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          subcategory: data.subcategory || '',
          featured: data.featured || false,
          price: data.price?.toString() || '',
          model3d: data.model3d || 'Sin modelo',
          active: data.active || false,
        };

        setFormData(newData);
        setOriginalData(newData);
        setImageFile(null);
        setChangedFields({});
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };


  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando producto...</div>
      </div>
    );
  }

  

  /** el manejador para el input del modelo 3d */
  function handleModel3dChange(file: File): void {
  if (!file.name.toLowerCase().endsWith('.glb')) {
    setModelError('El archivo debe tener extensión .glb');
    return;
  }

  setModelError(null);
  setModel3dFile(file);
}

  return (
    <>

      

      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Editar: {product.name}
        </h1>

        <form
          onSubmit={handlePreSubmit}
          className="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-md space-y-6 max-w-4xl mx-auto"
        >
          {/* Imagen */}
          <ProductImageInput
            productName={product.name}
            imagePreview={imagePreview}
            imageFile={imageFile}
            onImageChangeAction={handleImageChange}
            onCancelImageAction={() => {
              setImageFile(null);
              setImagePreview(product.image || '/placeholder-product.jpg');
            }}
          />


          {/* Primera grill a: Nombre, Categoría, Subcategoría, Estado */}
          <ProductBasicFields
            formData={formData}
            product={product}
            onChange={handleChange}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
          />

          <ProductPricingAndFeatured
            formData={formData} 
            product={product}
            onChange={handleChange}
          />

          <Model3DInput
            currentModelName={product.model3d}
            model3dFile={model3dFile}
            onModelChange={(file) => handleModel3dChange(file)}
          />
          {modelError && <p className="text-red-500 text-sm mt-1">{modelError}</p>}

          {/* Descripción */}
          <ProductDescriptionInput
            description={formData.description}
            originalDescription={product.description}
            onChange={handleChange}
          />

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-yellow-700 text-white font-semibold rounded disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Revisar cambios'}
          </button>

          {/* Mensaje de estado */}
          {message && (
            <p className={`mt-2 text-center font-semibold ${message.includes('✅') ? 'text-green-400' :
              message.includes('⚠️') ? 'text-yellow-400' : 'text-red-400'
              }`}>
              {message}
            </p>
          )}
        </form>
      </div>

      <ModalConfirm
        visible={showConfirmModal}
        changedFields={changedFields}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmedSubmit}
      />

      

    </>
  );
}

export default function EditarProducto() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <EditarProductoContent />
    </Suspense>
  );
}

