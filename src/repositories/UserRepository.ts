import User from '../models/User';

export class UserRepository {
    async findByUsername(username: string) {
        return await User.findOne({ where: { username } });
    }

    async findById(id: number) {
        return await User.findByPk(id);
    }

    async create(user: any) {
        return await User.create(user);
    }

    async update(id: number, data: any) {
        const user = await this.findById(id);
        if (user) {
            return await user.update(data);
        }
        return null;
    }
}
