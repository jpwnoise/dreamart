import { NextResponse } from 'next/server';
import Product from '@/models/Product'; // asegúrate de tener este modelo
import connectDB  from '@/lib/mongodb'; // tu helper de conexión

// 🔹 GET: Obtener todos los productos
export async function GET() {
  try {
    await connectDB();

    const productos = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los productos' },
      { status: 500 }
    );
  }
}

// 🔹 POST: Crear nuevo producto
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const nuevoProducto = await Product.create(body);

    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    );
  }
}
