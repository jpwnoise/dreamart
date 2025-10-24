export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/mongodb';


/** de momento solo devuelve 3 aleatoriamente */
export async function GET() {
  try {
    await connectDB();

    const productos = await Product.aggregate([
      {
        $match: {
          model3d: { $exists: true, $ne: null, $nin: ['Sin modelo', 'sin modelo', 'Sin Modelo', ''] },
          active: true,
        },
      },
      { $sample: { size: 3 } },
    ]);

    if (!productos || productos.length === 0) {
      return NextResponse.json(
        { error: 'No hay productos con modelo 3D disponibles' },
        { status: 404 }
      );
    }

    console.log('Los productos son ');
    console.log(productos)

    // Devuelve los metadatos de los 3 productos
    return NextResponse.json({ productos });
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}
