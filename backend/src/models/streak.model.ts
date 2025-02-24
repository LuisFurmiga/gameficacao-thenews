// backend/src/models/streak.model.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Reader } from './reader.model';

class Streak extends Model {
    public id!: number;
    public reader_id!: number;
    public current_streak!: number;
    public longest_streak!: number;
    public last_opened_date!: Date;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    public life!: number;
}

Streak.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        reader_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Reader,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        current_streak: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        longest_streak: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        last_opened_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        life: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1, // Número inicial de "vidas"
          },
    },
    {
        sequelize,
        tableName: 'streaks',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

Streak.belongsTo(Reader, { foreignKey: 'reader_id', as: 'reader' });
Reader.hasOne(Streak, { foreignKey: 'reader_id', as: 'streak' });

export { Streak };
