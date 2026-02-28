import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Importamos la configuración de la base de datos y los modelos
// Es vital importar los modelos aquí para que Sequelize los reconozca al iniciar
import sequelize from './config/database';
import './models/User';
import './models/Pet';
import './models/AdoptionRequest';

import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de Middlewares
app.use(cors()); // Permitimos peticiones desde otros dominios (como el frontend en desarrollo)
app.use(express.json()); // Necesario para procesar los datos que vienen en formato JSON

// Servimos los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Servimos las imágenes de las mascotas
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Conectamos todas nuestras rutas de la API bajo el prefijo /api
app.use('/api', routes);

// Función para arrancar el servidor
const startServer = async () => {
    try {
        // Verificamos que la conexión a la base de datos sea correcta
        await sequelize.authenticate();
        console.log('✔ Conexión con PostgreSQL establecida correctamente.');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor listo y corriendo en http://localhost:${PORT}`);
            console.log('CORS habilitado para todas las peticiones.');
        });
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
};

startServer();
