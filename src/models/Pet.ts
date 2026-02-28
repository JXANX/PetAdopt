import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

/**
 * Modelo que representa a una mascota en el sistema.
 * Define la estructura de la tabla 'pets' en PostgreSQL.
 */
class Pet extends Model {
    public id!: number;
    public name!: string;
    public species!: string;
    public breed!: string;
    public age!: number;
    public description!: string;
    public photoUrl!: string;
    public status!: string; // Posibles: 'available' (disponible), 'adopted' (adoptado), 'pending' (en proceso)
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
            // Usamos ENUM para restringir los tipos de animales permitidos
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
            // El estado por defecto siempre es disponible al registrar una mascota
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
