import { Schema, model, models } from 'mongoose';
import { unique } from 'next/dist/build/utils';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: '/no-image.jpg'
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  model3d: {
    type: String,
    default: 'Sin modelo'
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true, // Para búsquedas rápidas
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // Solo letras, números y guiones
    maxlength: 100,
    validate: {
      validator: function (v: string) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: 'Slug solo puede contener letras minúsculas, números y guiones'
    }
  }
}, {
  timestamps: true
});

const Product = models.Product || model('Product', ProductSchema);

export default Product;