import mongoose from 'mongoose';
import { Sequelize, DataTypes } from 'sequelize';

// ==========================================
// 1. MONGODB / MONGOOSE USER SCHEMA
// ==========================================
const UserMongoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  savedSignatures: [
    {
      id: String,
      name: String,
      dataUrl: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  verifiedEmail: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const MongoUser = mongoose.models.User || mongoose.model('User', UserMongoSchema);

// ==========================================
// 2. POSTGRESQL / SQL SEQUELIZE SCHEMA MODEL
// ==========================================
export const defineSqlUser = (sequelizeInstance) => {
  return sequelizeInstance.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    savedSignatures: {
      type: DataTypes.JSONB, // store array of structures in JSONB
      defaultValue: []
    },
    verifiedEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};
