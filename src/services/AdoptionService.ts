import { AdoptionRequestRepository } from '../repositories/AdoptionRequestRepository';
import { PetRepository } from '../repositories/PetRepository';

/**
 * Servicio encargado de la lógica de negocio para las adopciones.
 * Aquí validamos las reglas antes de tocar la base de datos.
 */
export class AdoptionService {
    private adoptionRepository: AdoptionRequestRepository;
    private petRepository: PetRepository;

    constructor() {
        this.adoptionRepository = new AdoptionRequestRepository();
        this.petRepository = new PetRepository();
    }

    // Retorna todas las solicitudes existentes
    async getAllRequests() {
        return await this.adoptionRepository.findAll();
    }

    /**
     * Crea una solicitud de adopción verificando disponibilidad.
     */
    async createRequest(data: any) {
        // Primero, verificamos que la mascota realmente exista y esté disponible
        const pet = await this.petRepository.findById(data.petId);

        if (!pet || pet.status !== 'available') {
            throw new Error('Lo sentimos, esta mascota ya no está disponible para adopción.');
        }

        // Si está libre, creamos el registro de solicitud
        const request = await this.adoptionRepository.create(data);

        // Marcamos la mascota como 'pending' para que nadie más intente adoptarla
        // mientras el administrador revisa esta solicitud.
        await this.petRepository.update(pet.id, { status: 'pending' });

        return request;
    }

    /**
     * Procesa un lote de solicitudes de forma asíncrona. 
     * Este es un gran ejemplo de cómo usar Promise.all para eficiencia.
     */
    async processRequestsBatch(requests: { id: number, status: 'approved' | 'rejected' }[]) {
        // Ejecutamos todas las actualizaciones en paralelo
        return await Promise.all(requests.map(async (req) => {
            const adoptionReq = await this.adoptionRepository.findById(req.id);
            if (!adoptionReq) return { id: req.id, success: false, message: 'Solicitud no encontrada' };

            // Actualizamos el estado de la solicitud (Aprobada/Rechazada)
            const updated = await this.adoptionRepository.updateStatus(req.id, req.status);

            // Si se aprueba, la mascota queda como 'adopted'. 
            // Si se rechaza, la mascota vuelve a estar 'available' para otros.
            const petStatus = req.status === 'approved' ? 'adopted' : 'available';
            await this.petRepository.update(adoptionReq.petId, { status: petStatus });

            return { id: req.id, success: true, request: updated };
        }));
    }
}
