// Este archivo lo correrás con: npx tsx scripts/seedProducts.ts

import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/dreamart';

const productsData = [
  {
    name: "Figura Goku Super Saiyan",
    description: "Figura coleccionable impresa en resina de alta calidad. Altura 15cm. Acabado profesional.",
    price: 350,
    category: "figuras",
    featured: true,
    inStock: true
  },
  {
    name: "Dije Triforce - Zelda",
    description: "Dije de la Trifuerza de The Legend of Zelda. Impreso en resina dorada. Incluye cadena.",
    price: 200,
    category: "joyeria",
    featured: true,
    inStock: true
  },
  {
    name: "Llavero Pokébola",
    description: "Llavero de pokébola detallado. 5cm de diámetro. Colores rojo y blanco.",
    price: 80,
    category: "llaveros",
    featured: true,
    inStock: true
  },
  {
    name: "Anillo One Ring - LOTR",
    description: "Anillo único de El Señor de los Anillos. Grabado élfico. Diferentes tallas disponibles.",
    price: 250,
    category: "joyeria",
    featured: true,
    inStock: true
  },
  {
    name: "Figura Luffy Gear 5",
    description: "Figura de Monkey D. Luffy en su forma Gear 5. One Piece. 18cm de altura.",
    price: 400,
    category: "figuras",
    featured: true,
    inStock: true
  },
  {
    name: "Llavero Baby Yoda",
    description: "Llavero de Grogu (Baby Yoda) de The Mandalorian. Super detallado.",
    price: 90,
    category: "llaveros",
    featured: true,
    inStock: true
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📡 Conectado a MongoDB');

    const Product = mongoose.model('Product', new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      category: String,
      featured: Boolean,
      inStock: Boolean
    }, { timestamps: true }));

    // Borrar productos existentes (opcional)
    await Product.deleteMany({});
    console.log('🗑️  Productos anteriores eliminados');

    // Crear productos nuevos
    const products = await Product.insertMany(productsData);
    console.log(`✅ ${products.length} productos creados`);

    await mongoose.connection.close();
    console.log('👋 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedProducts();