#!/bin/bash

# Carpeta base del admin
ADMIN_DIR="./app/admin"

# Array con los módulos que queremos crear
modules=("dashboard" "clientes" "productos" "pedidos" "ventas" "configuracion")

echo "Creando carpetas y páginas para el admin dashboard..."

for module in "${modules[@]}"; do
  MODULE_DIR="$ADMIN_DIR/$module"

  # Crear carpeta si no existe
  mkdir -p "$MODULE_DIR"

  # Crear page.tsx con contenido base si no existe
  PAGE_FILE="$MODULE_DIR/page.tsx"
  if [ ! -f "$PAGE_FILE" ]; then
    cat > "$PAGE_FILE" <<EOL
export default function ${module^}Page() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">${module^}</h2>
      <p>Contenido de la sección ${module^} aquí...</p>
    </div>
  );
}
EOL
    echo "Creado: $PAGE_FILE"
  else
    echo "Ya existe: $PAGE_FILE"
  fi
done

echo "✅ Todas las páginas del admin dashboard creadas."
