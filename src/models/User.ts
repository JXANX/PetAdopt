import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

/**
 * Modelo para gestionar los usuarios del sistema.
 * Maneja tanto adoptantes como administradores mediante el campo 'role'.
 */
class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;
    public email!: string;
    public phone!: string;
    public role!: string; // 'admin' (control total) o 'user' (usuario estándar)
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // No pueden existir dos usuarios con el mismo nombre
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            // Nota: Aquí se guarda el hash de la contraseña, no el texto plano
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user',
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export default User;
