// app/api/admin/subcategories/route.ts
import { NextResponse } from 'next/server';
import { Subcategory } from '@/models/Subcategory';
import { Category } from '@/models/Category';
import connectDB from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categoryName = searchParams.get('category');

    let subcategories;
    
    if (categoryName) {
      // Primero buscar el ID de la categoría por su nombre
      const category = await Category.findOne({ name: categoryName });
      
      if (!category) {
        return NextResponse.json({ subcategories: [] });
      }

      // Buscar subcategorías por el ObjectId
      subcategories = await Subcategory.find({ category: category._id })
        .populate('category', 'name')
        .sort({ name: 1 });
    } else {
      subcategories = await Subcategory.find()
        .populate('category', 'name')
        .sort({ name: 1 });
    }

    return NextResponse.json({ subcategories });
  } catch (error) {
    console.error('Error obteniendo subcategorías:', error);
    return NextResponse.json(
      { error: 'Error al obtener las subcategorías' },
      { status: 500 }
    );
  }
}


// 🔹 POST: Crear nueva subcategoría
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, category } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: 'El nombre y la categoría son requeridos' },
        { status: 400 }
      );
    }

    const nuevaSubcategoria = await Subcategory.create({ name, category });

    return NextResponse.json(nuevaSubcategoria, { status: 201 });
  } catch (error) {
    console.error('Error creando subcategoría:', error);
    return NextResponse.json(
      { error: 'Error al crear la subcategoría' },
      { status: 500 }
    );
  }
}

// 🔹 DELETE: Eliminar subcategoría
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }

    const subcategoriaEliminada = await Subcategory.findByIdAndDelete(id);

    if (!subcategoriaEliminada) {
      return NextResponse.json(
        { error: 'Subcategoría no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Subcategoría eliminada exitosamente',
      subcategory: subcategoriaEliminada 
    });
  } catch (error) {
    console.error('Error eliminando subcategoría:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la subcategoría' },
      { status: 500 }
    );
  }
}