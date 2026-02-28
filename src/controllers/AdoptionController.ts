import { Request, Response } from 'express';
import { AdoptionService } from '../services/AdoptionService';

/**
 * Controlador para gestionar las solicitudes de adopción.
 * Actúa como puente entre las peticiones HTTP y la lógica de negocio.
 */
const adoptionService = new AdoptionService();

// Obtener todas las solicitudes registradas
export const getAdoptions = async (req: Request, res: Response) => {
    try {
        const adoptions = await adoptionService.getAllRequests();
        res.json(adoptions);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al obtener las solicitudes: ' + error.message });
    }
};

// Crear una nueva solicitud de adopción
export const createAdoption = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        // El ID del usuario se extrae del token JWT previamente decodificado por el middleware
        data.userId = (req as any).user.id;

        const adoption = await adoptionService.createRequest(data);
        res.status(201).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: 'No se pudo procesar la adopción: ' + error.message });
    }
};

// Procesar múltiples solicitudes (Aprobar/Rechazar) en un solo lote
export const processAdoptionsBatch = async (req: Request, res: Response) => {
    try {
        const { requests } = req.body; // Espera un array del tipo [{ id, status }]
        const results = await adoptionService.processRequestsBatch(requests);
        res.json(results);
    } catch (error: any) {
        res.status(500).json({ message: 'Error procesando el lote de solicitudes: ' + error.message });
    }
};
