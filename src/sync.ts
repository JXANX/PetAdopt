import sequelize from './config/database';
import User from './models/User';
import Pet from './models/Pet';
import AdoptionRequest from './models/AdoptionRequest';

const syncDatabase = async () => {
    try {
        console.log('Cargando modelos...');

        await sequelize.authenticate();
        console.log('Conexión a BD establecida exitosamente.');

        // Evitar borrar datos en producción accidentalmente
        const isDev = process.env.NODE_ENV !== 'production';
        await sequelize.sync({ force: isDev });
        console.log('Base de datos sincronizada.');

        if (isDev) {
            // Usuario administrador por defecto para poder entrar rápido
            await User.create({
                username: 'admin',
                password: 'password123',
                email: 'admin@pet-adoption.com',
                role: 'admin'
            });
            console.log('Usuario admin de prueba creado.');

            // Algunas mascotas de prueba para no tener la app vacía
            await Pet.bulkCreate([
                { name: 'Max', species: 'perro', breed: 'Golden Retriever', age: 3, description: 'Muy amigable', status: 'available' },
                { name: 'Luna', species: 'gato', breed: 'Siames', age: 2, description: 'Tranquila y cariñosa', status: 'available' },
                { name: 'Rocky', species: 'perro', breed: 'Bulldog', age: 5, description: 'Un poco dormilón', status: 'available' }
            ]);
            console.log('Mascotas de prueba insertadas.');
        }

    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
};

syncDatabase();
