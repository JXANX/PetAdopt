import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Pet from './Pet';
import User from './User';

/**
 * Modelo que vincula a un Usuario con una Mascota mediante una solicitud.
 * Aquí guardamos el historial y estado de cada proceso de adopción.
 */
class AdoptionRequest extends Model {
    public id!: number;
    public petId!: number;
    public userId!: number;
    public message!: string;
    public status!: string; // 'pending' (espera), 'approved' (aprobada), 'rejected' (rechazada)
    public requestDate!: Date;
    public responseDate!: Date;
}

AdoptionRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        petId: {
            type: DataTypes.INTEGER,
            references: {
                model: Pet,
                key: 'id',
            },
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true, // El usuario puede dejar un mensaje explicando por qué quiere adoptar
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
        },
        requestDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        responseDate: {
            type: DataTypes.DATE,
            allowNull: true, // Fecha en la que el admin dio una respuesta
        },
    },
    {
        sequelize,
        tableName: 'adoption_requests',
    }
);

// Definición de Relaciones (Associations)
// Una mascota puede tener muchas solicitudes, pero una solicitud pertenece a una mascota
Pet.hasMany(AdoptionRequest, { foreignKey: 'petId' });
AdoptionRequest.belongsTo(Pet, { foreignKey: 'petId' });

// Un usuario puede realizar muchas solicitudes
User.hasMany(AdoptionRequest, { foreignKey: 'userId' });
AdoptionRequest.belongsTo(User, { foreignKey: 'userId' });

export default AdoptionRequest;
