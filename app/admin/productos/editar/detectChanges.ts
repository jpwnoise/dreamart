/**
 * Compara los datos actuales del formulario con los datos originales del producto
 * para detectar qué campos han sido modificados antes de enviar la actualización.
 *
 * Esta función revisa:
 * - Todos los campos del objeto `formData` contra `originalData`, incluyendo strings, números y booleanos.
 * - Si se ha seleccionado una nueva imagen (`imageFile`), la incluye como cambio.
 * - Si se ha cargado un nuevo archivo 3D (`model3dFile`), también lo registra como cambio.
 *
 * Devuelve un objeto `changes` con los campos modificados, donde cada clave representa
 * el nombre del campo y contiene un objeto con los valores `anterior` y `nuevo`.
 *
 * Este resultado se utiliza para mostrar un resumen en el modal de confirmación
 * antes de enviar los datos al servidor.
 */

export function detectChanges({
  formData,
  originalData,
  imageFile,
  model3dFile
}: {
  formData: any;
  originalData: any;
  imageFile: File | null;
  model3dFile: File | null;
}) {
  const changes: any = {};

  Object.keys(formData).forEach((key) => {
    const currentValue = formData[key];
    const originalValue = originalData[key];

    if (currentValue !== originalValue) {
      changes[key] = {
        anterior: originalValue,
        nuevo: currentValue
      };
    }
  });

  if (imageFile) {
    changes.image = {
      anterior: 'Imagen actual',
      nuevo: imageFile.name
    };
  }

  if (model3dFile) {
    changes.model3d = {
      anterior: 'Modelo actual',
      nuevo: model3dFile.name
    };
  }

  return changes;
}
