import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  createdAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const Category = models.Category || model<ICategory>('Category', categorySchema);
