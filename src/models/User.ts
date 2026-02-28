import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;
    public email!: string;
    public phone!: string;
    public role!: string; // 'admin' | 'user'
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
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
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
