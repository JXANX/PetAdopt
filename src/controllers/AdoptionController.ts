import { Request, Response } from 'express';
import { AdoptionService } from '../services/AdoptionService';

const adoptionService = new AdoptionService();

export const getAdoptions = async (req: Request, res: Response) => {
    try {
        const adoptions = await adoptionService.getAllRequests();
        res.json(adoptions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createAdoption = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        data.userId = (req as any).user.id; // Del token JWT
        const adoption = await adoptionService.createRequest(data);
        res.status(201).json(adoption);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const processAdoptionsBatch = async (req: Request, res: Response) => {
    try {
        const { requests } = req.body; // Expects [{ id: number, status: 'approved'|'rejected' }]
        const results = await adoptionService.processRequestsBatch(requests);
        res.json(results);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
