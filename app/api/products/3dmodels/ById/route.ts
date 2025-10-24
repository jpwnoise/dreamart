export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/lib/mongodb';
import path from 'path';
import { readFile } from 'fs/promises';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const id = searchParams.get('id')
    const producto = await Product.findById(id);

    if (!producto || !producto.model3d) {
      return NextResponse.json({ error: 'Modelo no disponible' }, { status: 404 });
    }

    const modelPath = path.join(process.cwd(), producto.model3d.replace(/^\//, ''));
    const modelBuffer = await readFile(modelPath);

    return new NextResponse(new Uint8Array(modelBuffer), {
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Content-Disposition': `inline; filename="${path.basename(modelPath)}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('❌ Error al servir modelo:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
