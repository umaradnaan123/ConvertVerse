import mongoose from 'mongoose';
import { Sequelize, DataTypes } from 'sequelize';

// ==========================================
// 1. MONGODB / MONGOOSE DOCUMENT SCHEMA
// ==========================================
const DocumentMongoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  elements: [
    {
      id: String,
      type: { type: String, enum: ['text', 'signature', 'image', 'shape', 'form', 'drawing'] },
      pageIndex: Number,
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      rotate: Number,
      value: mongoose.Schema.Types.Mixed, // text string, signature dataUrl, check states
      color: String,
      fontSize: Number,
      opacity: Number,
      formType: String,
      placeholder: String,
      required: Boolean,
      options: [String],
      shapeType: String,
      fillColor: String,
      strokeWidth: Number,
      paths: [[Number]] // list of coordinate tuples for drawing
    }
  ],
  signersWorkflow: [
    {
      email: String,
      signed: { type: Boolean, default: false },
      signedAt: Date,
      verificationToken: String
    }
  ],
  status: { type: String, enum: ['draft', 'pending_signatures', 'completed'], default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

export const MongoDocument = mongoose.models.Document || mongoose.model('Document', DocumentMongoSchema);

// ==========================================
// 2. POSTGRESQL / SQL SEQUELIZE DOCUMENT MODEL
// ==========================================
export const defineSqlDocument = (sequelizeInstance) => {
  return sequelizeInstance.define('Document', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER
    },
    elements: {
      type: DataTypes.JSONB, // store full list of layout elements
      defaultValue: []
    },
    signersWorkflow: {
      type: DataTypes.JSONB, // tracks signer flow status
      defaultValue: []
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'draft' // draft, pending_signatures, completed
    }
  });
};
