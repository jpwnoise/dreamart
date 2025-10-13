#!/bin/bash
# Script para crear subpáginas del módulo Productos desde scripts/bash/

# Obtenemos la ruta absoluta a la raíz del proyecto (2 niveles arriba del script)
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
BASE_DIR="$ROOT_DIR/app/admin/productos"

# Lista de submódulos
SUBMODULES=(create import export inventario categorias historial)

# Crear carpeta base si no existe
mkdir -p "$BASE_DIR"

# Crear page.tsx principal (Lista de productos)
cat > "$BASE_DIR/page.tsx" <<EOL
'use client';
import React from 'react';

export default function ListaProductos() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">Lista de Productos</h1>
      <p>Aquí se mostrará la lista de todos los productos.</p>
    </div>
  );
}
EOL

# Crear submódulos
for module in "${SUBMODULES[@]}"; do
  mkdir -p "$BASE_DIR/$module"
  cat > "$BASE_DIR/$module/page.tsx" <<EOL
'use client';
import React from 'react';

export default function ${module^}() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">${module^}</h1>
      <p>Aquí irá la funcionalidad correspondiente al módulo ${module}.</p>
    </div>
  );
}
EOL
done

echo "✅ Subpáginas de Productos creadas correctamente en $BASE_DIR"
