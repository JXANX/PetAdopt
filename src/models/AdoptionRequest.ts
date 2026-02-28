import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Pet from './Pet';
import User from './User';

class AdoptionRequest extends Model {
    public id!: number;
    public petId!: number;
    public userId!: number;
    public message!: string;
    public status!: string; // 'pending' | 'approved' | 'rejected'
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
            allowNull: true,
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
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'adoption_requests',
    }
);

// Associations
Pet.hasMany(AdoptionRequest, { foreignKey: 'petId' });
AdoptionRequest.belongsTo(Pet, { foreignKey: 'petId' });

User.hasMany(AdoptionRequest, { foreignKey: 'userId' });
AdoptionRequest.belongsTo(User, { foreignKey: 'userId' });

export default AdoptionRequest;
