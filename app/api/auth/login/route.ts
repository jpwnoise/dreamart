import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User } from '../../../../models/User';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Correo y contraseña son obligatorios' }, { status: 400 });
    }

    // Conectar a MongoDB
    if (!mongoose.connection.readyState) {
      if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI no definido');
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Buscar usuario por email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    // ✅ Login exitoso
    return NextResponse.json({
      message: 'Login exitoso',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
