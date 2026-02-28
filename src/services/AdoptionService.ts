import { AdoptionRequestRepository } from '../repositories/AdoptionRequestRepository';
import { PetRepository } from '../repositories/PetRepository';

export class AdoptionService {
    private adoptionRepository: AdoptionRequestRepository;
    private petRepository: PetRepository;

    constructor() {
        this.adoptionRepository = new AdoptionRequestRepository();
        this.petRepository = new PetRepository();
    }

    async getAllRequests() {
        return await this.adoptionRepository.findAll();
    }

    async createRequest(data: any) {
        // Verificar si la mascota está disponible
        const pet = await this.petRepository.findById(data.petId);
        if (!pet || pet.status !== 'available') {
            throw new Error('Mascota no disponible para adopción');
        }

        // Crear la solicitud
        const request = await this.adoptionRepository.create(data);

        // Cambiar estado de la mascota a 'pending'
        await this.petRepository.update(pet.id, { status: 'pending' });

        return request;
    }

    async processRequestsBatch(requests: { id: number, status: 'approved' | 'rejected' }[]) {
        // Ejemplo principal de asincronicidad con Promise.all
        return await Promise.all(requests.map(async (req) => {
            const adoptionReq = await this.adoptionRepository.findById(req.id);
            if (!adoptionReq) return { id: req.id, success: false, message: 'Request not found' };

            const updated = await this.adoptionRepository.updateStatus(req.id, req.status);

            // Si se aprueba, la mascota pasa a 'adopted'. Si se rechaza, vuelve a 'available'
            const petStatus = req.status === 'approved' ? 'adopted' : 'available';
            await this.petRepository.update(adoptionReq.petId, { status: petStatus });

            return { id: req.id, success: true, request: updated };
        }));
    }
}
