// app/api/admin/productos/route.ts
import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    // Si no hay id, devolvemos todos
    const productos = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json({ error: 'Error al obtener los productos' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    
    // Extraer datos del form
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string;
    const price = parseFloat(formData.get('price') as string);
    const inventory = parseInt(formData.get('inventory') as string);
    const sku = formData.get('sku') as string;
    const status = formData.get('status') as string;
    const mainImageFile = formData.get('mainImage') as File;

    let imageUrl = '';

    // Si hay imagen, guardarla
    if (mainImageFile) {
      const bytes = await mainImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generar nombre único
      const fileName = `${Date.now()}-${mainImageFile.name}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    console.log('📸 mainImageFile recibido:', mainImageFile); // ← Log 1
    console.log('la url despues de almacenar es ' + imageUrl)

    const nuevoProducto = await Product.create({
      name,
      description,
      category,
      subcategory,
      price,
      inventory,
      sku,
      status,
      image: imageUrl,
    });

    console.log('✅ Producto creado con mainImage:', nuevoProducto.image); // ← AGREGAR ESTE


    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    );
  }
}