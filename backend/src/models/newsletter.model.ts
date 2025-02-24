// backend/src/models/newsletter.model.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class Newsletter extends Model {
    public id!: number;
    public resource_id!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Newsletter.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        resource_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'newsletters',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export { Newsletter };
