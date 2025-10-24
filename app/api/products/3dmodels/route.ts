// app/api/products/3dmodels/route.ts
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();

    // Buscar productos que tengan modelo 3D válido
    const productos = await Product.find({
      model3d: { 
        $exists: true, 
        $ne: null,
        $nin: ['Sin modelo', 'sin modelo', 'Sin Modelo', '']
      },
      active: true
    });

    if (!productos || productos.length === 0) {
      return NextResponse.json(
        { error: 'No hay productos con modelo 3D disponibles' },
        { status: 404 }
      );
    }

    // Seleccionar producto aleatorio
    const randomIndex = Math.floor(Math.random() * productos.length);
    const producto = productos[randomIndex];

    console.log('🎲 Producto aleatorio con 3D:', {
      id: producto._id,
      name: producto.name,
      model3d: producto.model3d
    });

    // Leer el archivo binario del modelo 3D desde el servidor
    // Los modelos están en /uploads/models/ (raíz del proyecto, NO en public)
    const modelRelativePath = producto.model3d.startsWith('/') 
      ? producto.model3d.slice(1) 
      : producto.model3d;
    
    // Construir ruta: /uploads/models/ está en la raíz, no en public
    const modelPath = path.join(process.cwd(), modelRelativePath);
    
    console.log('🔍 Rutas:', {
      modeloEnBD: producto.model3d,
      rutaRelativa: modelRelativePath,
      rutaCompleta: modelPath
    });
    
    const modelBuffer = await readFile(modelPath);

    console.log('📦 Archivo leído:', {
      path: modelPath,
      size: `${(modelBuffer.length / 1024 / 1024).toFixed(2)} MB`
    });

    // Crear headers con la información del producto como metadatos
    const headers = new Headers({
      'Content-Type': 'model/gltf-binary',
      'Content-Disposition': `inline; filename="${producto.model3d}"`,
      'Cache-Control': 'public, max-age=3600',
      // Metadatos del producto en headers custom
      'X-Product-Id': producto._id.toString(),
      'X-Product-Name': encodeURIComponent(producto.name),
      'X-Product-Description': encodeURIComponent(producto.description || ''),
      'X-Product-Category': producto.category || '',
      'X-Product-Subcategory': producto.subcategory || '',
      'X-Product-Price': producto.price?.toString() || '0',
      'X-Product-Image': producto.image || '',
      'X-Product-Featured': producto.featured?.toString() || 'false',
    });

    // Devolver el binario del modelo con los metadatos en headers
    // Convertir Buffer a Uint8Array para Next.js
    return new NextResponse(new Uint8Array(modelBuffer), { headers });

  } catch (error) {
    console.error('❌ Error obteniendo producto aleatorio:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto aleatorio' },
      { status: 500 }
    );
  }
}