import Pet from '../models/Pet';

export class PetRepository {
    async findAll() {
        return await Pet.findAll();
    }

    async findById(id: number) {
        return await Pet.findByPk(id);
    }

    async create(pet: any) {
        return await Pet.create(pet);
    }

    async update(id: number, data: any) {
        const pet = await this.findById(id);
        if (pet) {
            return await pet.update(data);
        }
        return null;
    }

    async delete(id: number) {
        const pet = await this.findById(id);
        if (pet) {
            await pet.destroy();
            return true;
        }
        return false;
    }

    async findByStatus(status: string) {
        return await Pet.findAll({ where: { status } });
    }

    async countByStatus(status: string) {
        return await Pet.count({ where: { status } });
    }

    async countAll() {
        return await Pet.count();
    }
}
