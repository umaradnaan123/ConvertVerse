import mongoose from 'mongoose';
import { Sequelize, DataTypes } from 'sequelize';

// ==========================================
// 1. MONGODB / MONGOOSE AUDIT LOG SCHEMA
// ==========================================
const AuditLogMongoSchema = new mongoose.Schema({
  documentId: { type: String, required: true },
  userEmail: { type: String, required: true },
  action: { type: String, required: true }, // e.g. 'created', 'edited', 'signed', 'completed'
  ipAddress: { type: String },
  userAgent: { type: String },
  documentHash: { type: String }, // SHA-256 hash of document binary for compliance
  certificateLog: { type: String }, // Digital sealing certificate details
  timestamp: { type: Date, default: Date.now }
});

export const MongoAuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogMongoSchema);

// ==========================================
// 2. POSTGRESQL / SQL SEQUELIZE AUDIT LOG MODEL
// ==========================================
export const defineSqlAuditLog = (sequelizeInstance) => {
  return sequelizeInstance.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    documentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING
    },
    userAgent: {
      type: DataTypes.STRING
    },
    documentHash: {
      type: DataTypes.STRING
    },
    certificateLog: {
      type: DataTypes.TEXT
    }
  });
};
