import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'client';
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  createdAt: { type: Date, default: Date.now },
});

// Evitar recompilar el modelo
export const User = models.User || model<IUser>('User', userSchema);
