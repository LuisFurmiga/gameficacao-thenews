// backend/src/models/opening.model.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Reader } from './reader.model';
import { Newsletter } from './newsletter.model';

class Openings extends Model {
    public id!: number;
    public reader_id!: number;
    public newsletter_id!: number;
    public opened_at!: Date;
    public utm_source?: string;
    public utm_medium?: string;
    public utm_campaign?: string;
    public utm_channel?: string;
}

Openings.init(
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
        newsletter_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Newsletter,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        opened_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        utm_source: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        utm_medium: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        utm_campaign: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        utm_channel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'openings',
        timestamps: false,
    }
);

export { Openings };
