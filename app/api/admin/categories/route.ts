import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import { Category } from '@/models/Category';

// GET: obtener todas las categorías
export async function GET() {
  try {
    await connect();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error GET /api/admin/categories:', error);
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 });
  }
}

// POST: crear una nueva categoría
export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return NextResponse.json({ error: 'La categoría ya existe' }, { status: 400 });
    }

    const category = await Category.create({ name });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error POST /api/admin/categories:', error);
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}
