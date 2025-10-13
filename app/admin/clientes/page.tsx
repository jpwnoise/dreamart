import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DreamArt - Clientes",
  description: "Tienda de figuras y joyería geek",
};

export default function ClientesPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Clientes</h2>
      <p>Contenido de la sección Clientes aquí...</p>
    </div>
  );
}
