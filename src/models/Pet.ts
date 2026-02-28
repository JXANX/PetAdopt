import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Pet extends Model {
    public id!: number;
    public name!: string;
    public species!: string;
    public breed!: string;
    public age!: number;
    public description!: string;
    public photoUrl!: string;
    public status!: string; // 'available' | 'adopted' | 'pending'
}

Pet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        species: {
            type: DataTypes.ENUM('perro', 'gato', 'otro'),
            allowNull: false,
        },
        breed: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        photoUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('available', 'adopted', 'pending'),
            defaultValue: 'available',
        },
    },
    {
        sequelize,
        tableName: 'pets',
    }
);

export default Pet;
