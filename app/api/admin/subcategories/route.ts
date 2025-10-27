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
  console.log('Agregando nueva subcategoría')
  try {
    await connectDB();
    
    const body = await req.json();
    const { name, category } = body;
    
    
    console.log(name,category)
    
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

// ✅ Actualizar una subcategoría existente
export async function PUT(request: Request) {
  try {
    await connectDB();

    // Obtener el ID desde los parámetros de búsqueda
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Falta el ID de la subcategoría' }, { status: 400 });
    }

    const { category, name } = await request.json();

    if (!category) {
      return NextResponse.json({ error: 'No se envió el ID de categoría en la solicitud' }, { status: 400 });
    }

    const before = await Subcategory.findById(id);

    if (!before) return NextResponse.json({error: 'No se encontró la subcategoria'})


    // Buscar y actualizar la subcategoría
    const updated = await Subcategory.findByIdAndUpdate(
      id,
      { name, category },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Subcategoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Subcategoría actualizada correctamente',
      subcategory: updated,
    });
  } catch (error: any) {
    console.error('Error en PUT /subcategories:', error);
    return NextResponse.json({ error: 'Error al actualizar la subcategoría' }, { status: 500 });
  }
}