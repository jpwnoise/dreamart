    import mongoose from 'mongoose';
    import bcrypt from 'bcrypt';
    import { User, IUser } from '../models/User';
    import dotenv from 'dotenv';
    import path from 'path';

    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

    const adminData = {
    name: 'Juan Pablo',
    email: 'jpwnoise@outlook.com',
    password: 'Wavnoi2017',
    role: 'admin' as const,
    };

    async function seedAdmin() {
    console.log('Iniciando script seedAdmin...');

    if (!process.env.MONGODB_URI) {
        console.error('Por favor define MONGODB_URI en .env.local');
        process.exit(1);
    }

    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Buscar si ya existe el admin
        let admin = await User.findOne({ email: adminData.email });

        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        if (admin) {
        console.log('El admin ya existe, actualizando contraseña...');
        admin.password = hashedPassword;
        await admin.save();
        console.log('Contraseña actualizada exitosamente:', admin.email);
        } else {
        // Crear nuevo admin
        admin = await User.create({
            ...adminData,
            password: hashedPassword,
        });
        console.log('Admin creado exitosamente:', admin.email);
        }

        await mongoose.disconnect();
        console.log('Desconectado de MongoDB. Script terminado.');
        process.exit(0);
    } catch (error) {
        console.error('Error creando o actualizando el admin:', error);
        process.exit(1);
    }
    }

    seedAdmin();
