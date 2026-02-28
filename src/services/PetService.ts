import { PetRepository } from '../repositories/PetRepository';

export class PetService {
    private petRepository: PetRepository;

    constructor() {
        this.petRepository = new PetRepository();
    }

    async getAllPets() {
        return await this.petRepository.findAll();
    }

    async getPetById(id: number) {
        return await this.petRepository.findById(id);
    }

    async createPet(data: any) {
        return await this.petRepository.create(data);
    }

    async updatePet(id: number, data: any) {
        return await this.petRepository.update(id, data);
    }

    async deletePet(id: number) {
        return await this.petRepository.delete(id);
    }

    async getStatistics() {
        // Ejemplo de Promise.all para concurrencia
        const [total, available, adopted, pending] = await Promise.all([
            this.petRepository.countAll(),
            this.petRepository.countByStatus('available'),
            this.petRepository.countByStatus('adopted'),
            this.petRepository.countByStatus('pending')
        ]);

        return { total, available, adopted, pending };
    }
}
