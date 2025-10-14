import mongoose, { Schema, Document, model, models, Types } from 'mongoose';
import { ICategory } from './Category';

export interface ISubcategory extends Document {
  name: string;
  category: Types.ObjectId | ICategory; // referencia obligatoria a categoría
  createdAt: Date;
}

const subcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Subcategory = models.Subcategory || model<ISubcategory>('Subcategory', subcategorySchema);