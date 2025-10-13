import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    
    // Obtener productos destacados
    const products = await Product.find({ featured: true }).limit(6);
    
    return NextResponse.json({
      success: true,
      products
    });
  } catch (error: any) {
    console.error('Error en API productos:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al obtener productos',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const product = await Product.create(body);
    
    return NextResponse.json({
      success: true,
      product
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creando producto:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al crear producto',
        message: error.message 
      },
      { status: 500 }
    );
  }
}