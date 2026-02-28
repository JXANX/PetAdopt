import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configuración de CORS
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
app.use(cors({
    origin: (origin, callback) => {
        // Permitir peticiones sin origin y dominios aprobados
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Servidor de adopción corriendo en el puerto ${port}`);
    console.log(`CORS habilitado para: ${allowedOrigins.join(', ')}`);
});
