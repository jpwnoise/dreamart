// app/api/admin/productos/route.ts
import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/mongodb';
import { unlink, writeFile, mkdir } from 'fs/promises';
import path from 'path';

/** ===================== GET ===================== */
export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      const product = await Product.findById(id);
      if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      return NextResponse.json(product);
    }

    const productos = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json({ error: 'Error al obtener los productos' }, { status: 500 });
  }
}

/** ===================== POST ===================== */
export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string;
    const price = parseFloat(formData.get('price') as string);
    const inventory = parseInt(formData.get('inventory') as string);
    const sku = formData.get('sku') as string;
    const status = formData.get('status') as string;
    const mainImageFile = formData.get('mainImage') as File;
    const model3dFile = formData.get('model3d') as File;

    let imageUrl = '';
    let model3dUrl = '';

    if (mainImageFile) imageUrl = await saveImage(mainImageFile);
    if (model3dFile) model3dUrl = await saveModel3d(model3dFile);

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
      model3d: model3dUrl,
    });

    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 });
  }
}

/** ===================== FUNCIONES DE GUARDADO ===================== */
async function saveImage(file: File, oldImage?: string) {
  if (oldImage && oldImage !== '/placeholder-product.jpg' && !oldImage.startsWith('http')) {
    try { await unlink(path.join(process.cwd(), 'public', oldImage)); } 
    catch (err) { console.warn('No se pudo eliminar imagen anterior:', err); }
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

/** almacena el archivo del modelo en el sistema de archivos  */
async function saveModel3d(file: File, oldModel?: string) {
  console.log('guardando el modelo 3d')
  
  // Ignorar placeholders y strings por defecto
  if (oldModel && oldModel !== 'Sin modelo' && !oldModel.startsWith('http')) {
    try {
      // CORREGIDO: Eliminar desde uploads en raíz, no desde public
      const oldFilePath = path.join(process.cwd(), oldModel.replace(/^\//, ''));
      await unlink(oldFilePath);
      console.log('✅ Modelo anterior eliminado:', oldFilePath);
    } catch (err) {
      console.warn('⚠️ No se pudo eliminar modelo 3D anterior:', err);
    }
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), 'uploads', 'models');
  await mkdir(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsDir, fileName);
  await writeFile(filePath, buffer);

  console.log(`✅ Se guardó el archivo ${fileName}`)
  return `/uploads/models/${fileName}`;
}

/** ===================== BUILD UPDATE DATA ===================== */
function buildUpdateData(formData: FormData, currentProduct: any, imageUrl: string, model3dUrl: string) {
  const fields = ['name', 'description', 'category', 'subcategory', 'price', 'active', 'featured'];
  const updateData: any = { image: imageUrl, model3d: model3dUrl };

  fields.forEach((field) => {
    const rawValue = formData.get(field);
    let finalValue: any;

    switch (field) {
      case 'price':
        finalValue = rawValue ? parseFloat(rawValue as string) : currentProduct.price;
        break;
      case 'active':
      case 'featured':
        finalValue = rawValue === 'true';
        break;
      default:
        finalValue = rawValue ? String(rawValue) : currentProduct[field];
    }

    if (finalValue !== currentProduct[field]) {
      updateData[field] = finalValue;
    }
  });

  return updateData;
}

/** ===================== PUT ===================== */
export async function PUT(req: Request) {
  console.log('Actualizanfo el producto')
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID del producto es requerido' }, { status: 400 });

    const formData = await req.formData();
    const productoActual = await Product.findById(id);
    if (!productoActual) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });

    let imageUrl = productoActual.image || '/no-image.jpg';
    const mainImageFile = formData.get('mainImage') as File;
    if (mainImageFile && mainImageFile.size > 0) {
      imageUrl = await saveImage(mainImageFile, productoActual.image);
    }

    let model3dUrl = productoActual.model3d || '';
    const model3dFile = formData.get('model3d') as File;
    if (model3dFile && model3dFile.size > 0) {
      model3dUrl = await saveModel3d(model3dFile, productoActual.model3d);
    }
    const updateData = buildUpdateData(formData, productoActual, imageUrl, model3dUrl);
    console.log(`los datos de actualizacion son`, updateData)
    const productoActualizado = await Product.findByIdAndUpdate(id, updateData, { new: true });
    console.log(`el producto actualizado es`, productoActualizado)

    return NextResponse.json(productoActualizado);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}

/** ===================== DELETE ===================== */
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID del producto es requerido' }, { status: 400 });

    const producto = await Product.findById(id);
    if (!producto) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });

    if (producto.image && producto.image !== '/placeholder-product.jpg' && !producto.image.startsWith('http')) {
      try { await unlink(path.join(process.cwd(), 'public', producto.image)); } 
      catch (err) { console.log('⚠️ No se pudo eliminar imagen:', err); }
    }

    if (producto.model3d && !producto.model3d.startsWith('http')) {
      try { await unlink(path.join(process.cwd(), 'public', producto.model3d)); } 
      catch (err) { console.log('⚠️ No se pudo eliminar modelo 3D:', err); }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Producto eliminado exitosamente', id });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
  }
}
