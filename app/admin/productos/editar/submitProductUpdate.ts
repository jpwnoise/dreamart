export async function submitProductUpdate({
  id,
  changedFields,
  formData,
  originalData,
  imageFile
}: {
  id: string | null;
  changedFields: any;
  formData: any;
  originalData: any;
  imageFile: File | null;
}) {
  const submitData = new FormData();

  Object.keys(changedFields).forEach((key) => {
    if (key !== 'image') {
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

  Object.keys(originalData).forEach((key) => {
    if (!submitData.has(key)) {
      submitData.append(key, originalData[key]);
    }
  });

  const res = await fetch(`/api/admin/productos?id=${id}`, {
    method: 'PUT',
    body: submitData,
  });

  const data = await res.json();
  return { res, data };
}
