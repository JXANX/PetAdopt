import AdoptionRequest from '../models/AdoptionRequest';
import Pet from '../models/Pet';
import User from '../models/User';

export class AdoptionRequestRepository {
    async findAll() {
        return await AdoptionRequest.findAll({
            include: [
                { model: Pet, attributes: ['name', 'species'] },
                { model: User, attributes: ['username', 'email'] }
            ]
        });
    }

    async findById(id: number) {
        return await AdoptionRequest.findByPk(id);
    }

    async findByUserId(userId: number) {
        return await AdoptionRequest.findAll({
            where: { userId },
            include: [{ model: Pet, attributes: ['name', 'species'] }]
        });
    }

    async findByPetId(petId: number) {
        return await AdoptionRequest.findAll({
            where: { petId },
            include: [{ model: User, attributes: ['username'] }]
        });
    }

    async create(data: any) {
        return await AdoptionRequest.create(data);
    }

    async updateStatus(id: number, status: string) {
        const request = await this.findById(id);
        if (request) {
            request.status = status;
            request.responseDate = new Date();
            return await request.save();
        }
        return null;
    }
}
