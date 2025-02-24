// backend/src/models/reader.model.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class Reader extends Model {
    public id!: number;
    public email!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Reader.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
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
        tableName: 'readers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export { Reader };
