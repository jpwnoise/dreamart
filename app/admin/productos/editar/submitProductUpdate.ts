export async function submitProductUpdate({
  id,
  changedFields,
  formData,
  originalData,
  imageFile,
  model3dFile
}: {
  id: string | null;
  changedFields: any;
  formData: any;
  originalData: any;
  imageFile: File | null;
  model3dFile: File | null; 
}) {
  const submitData = new FormData();

  Object.keys(changedFields).forEach((key) => {
    if (key !== 'image' && key !== 'model3d') { // <-- ignorar ambos aquí
      let value = formData[key];

      if (key === 'active') {
        value = value === 'activo' || value === true;
      }

      if (key === 'featured') {
        value = Boolean(value);
      }

      submitData.append(key, String(value));
    }
  });

  if (imageFile) {
    submitData.append('mainImage', imageFile);
  }

  if (model3dFile) {                  // <-- agregar aquí
    submitData.append('model3d', model3dFile);
  }

  // Completar con valores originales si no se cambiaron
  Object.keys(originalData).forEach((key) => {
    if (!submitData.has(key)) {
      submitData.append(key, originalData[key]);
    }
  });

  console.log('Estos son los nuevos datos');
  for (const entry of submitData.entries()) {
    console.log(entry);
  }

  const res = await fetch(`/api/admin/productos?id=${id}`, {
    method: 'PUT',
    body: submitData,
  });

  const data = await res.json();
  return { res, data };
}
