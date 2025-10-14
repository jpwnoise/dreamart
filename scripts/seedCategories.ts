import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { Subcategory } from '../models/Subcategory';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const categoriesData = [
  { name: 'Figuras' },
  { name: 'Bisutería' },
  { name: 'Llaveros' },
];

const subcategoriesData = [
  { name: 'Aretes', categoryName: 'Bisutería' },
  { name: 'Pulseras', categoryName: 'Bisutería' },
  { name: 'Dijes', categoryName: 'Bisutería' },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('Define MONGODB_URI en .env.local');
    process.exit(1);
  }

  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Insertar categorías si no existen
    const categoriesMap: Record<string, mongoose.Types.ObjectId> = {};
    for (const cat of categoriesData) {
      let category = await Category.findOne({ name: cat.name });
      if (!category) {
        category = await Category.create({ name: cat.name });
        console.log(`Categoría creada: ${category.name}`);
      }
      categoriesMap[cat.name] = category._id;
    }

    // Insertar subcategorías solo si la categoría existe
    for (const sub of subcategoriesData) {
      const categoryId = categoriesMap[sub.categoryName];
      if (!categoryId) {
        console.warn(`No se encontró categoría para la subcategoría "${sub.name}"`);
        continue;
      }

      const existing = await Subcategory.findOne({ name: sub.name, category: categoryId });
      if (existing) {
        console.log(`Subcategoría "${sub.name}" ya existe`);
        continue;
      }

      await Subcategory.create({ name: sub.name, category: categoryId });
      console.log(`Subcategoría creada: ${sub.name} (Categoría: ${sub.categoryName})`);
    }

    await mongoose.disconnect();
    console.log('Desconectado de MongoDB. Script terminado.');
    process.exit(0);
  } catch (error) {
    console.error('Error creando categorías/subcategorías:', error);
    process.exit(1);
  }
}

seed();
