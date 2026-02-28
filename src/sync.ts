import sequelize from './config/database';

// Importamos los modelos para que Sequelize sepa qué tablas crear
import './models/User';
import './models/Pet';
import './models/AdoptionRequest';

import User from './models/User';
import Pet from './models/Pet';

/**
 * Función encargada de sincronizar los modelos con la base de datos de PostgreSQL.
 * Si estamos en desarrollo, este proceso puede borrar y recrear las tablas para 
 * asegurar que el esquema coincida con nuestro código de TypeScript.
 */
const syncDatabase = async () => {
    try {
        console.log('--- INICIANDO SINCRONIZACIÓN DE BASE DE DATOS ---');

        // Verificamos la conexión antes de intentar sincronizar
        await sequelize.authenticate();
        console.log('✔ Conexión establecida. Revisando modelos registrados...');

        const models = Object.keys(sequelize.models);
        console.log('Modelos detectados:', models);

        // Si no detecta AdoptionRequest, algo anda mal con las importaciones
        if (!models.includes('AdoptionRequest')) {
            console.warn('⚠ Advertencia: AdoptionRequest no parece estar registrado aún.');
        }

        // En desarrollo (NODE_ENV != production), forzamos la sincronización (borra todo)
        // Esto es útil para aplicar cambios en los modelos rápidamente.
        const isDev = process.env.NODE_ENV !== 'production';
        console.log(`Sincronizando tablas (Modo Desarrollo: ${isDev})...`);

        await sequelize.sync({ force: isDev });
        console.log('✔ Base de datos sincronizada y limpia.');

        // Si es entorno de desarrollo, insertamos datos de prueba para no empezar de cero
        if (isDev) {
            console.log('Insertando datos de prueba...');

            // Creamos un admin por defecto
            await User.create({
                username: 'admin',
                password: 'password123',
                email: 'admin@pet-adoption.com',
                role: 'admin'
            });

            // Agregamos algunas mascotas iniciales
            await Pet.bulkCreate([
                { name: 'Max', species: 'perro', breed: 'Golden Retriever', age: 3, description: 'Súper amigable y le encanta jugar.', status: 'available' },
                { name: 'Luna', species: 'gato', breed: 'Siamés', age: 2, description: 'Muy tranquila, ideal para un departamento.', status: 'available' },
                { name: 'Thor', species: 'perro', breed: 'Pastor Alemán', age: 4, description: 'Leal y protector, busca una familia activa.', status: 'available' }
            ]);

            console.log('✔ Datos de prueba (Admin y mascotas) creados con éxito.');
        }
    } catch (error) {
        console.error('❌ Error crítico durante la sincronización:', error);
    }
};

// Ejecutamos la sincronización
syncDatabase();
