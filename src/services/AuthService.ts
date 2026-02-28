import { UserRepository } from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(data: any) {
        // En una app real, hashear la contraseña aquí
        return await this.userRepository.create(data);
    }

    async login(username: string, password: string) {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }

        // Comparación simple para fines educativos (igual que el proyecto base)
        if (password !== user.password) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        return token;
    }
}
