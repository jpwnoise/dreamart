// app/api/admin/productos/route.ts
import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/mongodb';
import { unlink, writeFile } from 'fs/promises';
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

async function saveImage(file: File, oldImage?: string) {
  // Eliminar imagen anterior si existe y no es placeholder
  if (oldImage && oldImage !== '/placeholder-product.jpg' && !oldImage.startsWith('http')) {
    try {
      await unlink(path.join(process.cwd(), 'public', oldImage));
    } catch (err) {
      console.warn('No se pudo eliminar imagen anterior:', err);
    }
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

function buildUpdateData(formData: FormData, currentProduct: any, imageUrl: string) {
  // ✅ agregamos 'featured' al listado de campos
  const fields = ['name', 'description', 'category', 'subcategory', 'price', 'active', 'featured'];
  const updateData: any = { image: imageUrl };

  fields.forEach((field) => {
    const rawValue = formData.get(field); // FormDataEntryValue | null
    let finalValue: any;

    switch (field) {
      case 'price':
        finalValue = rawValue ? parseFloat(rawValue as string) : currentProduct.price;
        break;
      case 'active':
      case 'featured':
        // Convertir string "true"/"false" a boolean
        finalValue = rawValue === 'true';
        break;
      default:
        finalValue = rawValue ? String(rawValue) : currentProduct[field];
    }

    // Solo agregar si es diferente al valor actual
    if (finalValue !== currentProduct[field]) {
      updateData[field] = finalValue;
    }
  });

  return updateData;
}


export async function PUT(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID del producto es requerido' }, { status: 400 });

    const formData = await req.formData();

    const activeStr = formData.get('active') as string;
    const active = activeStr === 'true';


    // Buscar el producto actual
    const productoActual = await Product.findById(id);
    if (!productoActual) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });

    // Manejar imagen
    let imageUrl = productoActual.image || '/no-image.jpg';
    const mainImageFile = formData.get('mainImage') as File;
    if (mainImageFile && mainImageFile.size > 0) {
      imageUrl = await saveImage(mainImageFile, productoActual.image);
    }

    // Construir objeto de actualización
    const updateData = buildUpdateData(formData, productoActual, imageUrl);

    const productoActualizado = await Product.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json(productoActualizado);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    const producto = await Product.findById(id);
    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar imagen si existe
    if (producto.image &&
      producto.image !== '/placeholder-product.jpg' &&
      !producto.image.startsWith('http')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', producto.image);
        await unlink(imagePath);
        console.log('✅ Imagen eliminada:', imagePath);
      } catch (err) {
        console.log('⚠️ No se pudo eliminar imagen:', err);
      }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Producto eliminado exitosamente',
      id
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
}