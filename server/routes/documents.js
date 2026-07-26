import express from 'express';
import multer from 'multer';
import { MongoDocument } from '../models/Document.js';
import { MongoAuditLog } from '../models/AuditLog.js';

const router = express.Router();

// Config Multer for storage uploads (temp file buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload a new PDF workspace document
router.post('/upload', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const { title } = req.body;
  try {
    // In production, upload buffer to AWS S3 / Cloudinary and use URL.
    // For local mock: convert buffer to base64 dataURI
    const base64Data = req.file.buffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64Data}`;

    const doc = new MongoDocument({
      title: title || req.file.originalname,
      fileUrl: dataUrl,
      fileSize: req.file.size,
      elements: []
    });
    await doc.save();

    res.status(201).json({ message: 'Upload success', document: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch document details & elements
router.get('/:id', async (req, res) => {
  try {
    const doc = await MongoDocument.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save overlay elements & states updates
router.post('/:id/save', async (req, res) => {
  const { elements, status } = req.body;
  try {
    const doc = await MongoDocument.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    doc.elements = elements || doc.elements;
    doc.status = status || doc.status;
    await doc.save();

    // Register event in audit logs
    const log = new MongoAuditLog({
      documentId: doc._id.toString(),
      userEmail: req.body.userEmail || 'anonymous@convertverse.com',
      action: `Saved changes to document layout`
    });
    await log.save();

    res.status(200).json({ message: 'Saved successfully', document: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a digital signature request email workflow
router.post('/:id/request-signing', async (req, res) => {
  const { signers } = req.body; // signers = [{ email }]
  try {
    const doc = await MongoDocument.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const workflow = signers.map(s => ({
      email: s.email,
      signed: false,
      verificationToken: Math.random().toString(36).substr(2, 9)
    }));

    doc.signersWorkflow = workflow;
    doc.status = 'pending_signatures';
    await doc.save();

    const log = new MongoAuditLog({
      documentId: doc._id.toString(),
      userEmail: req.body.ownerEmail || 'owner@convertverse.com',
      action: `Requested signature flow for: ${signers.map(s => s.email).join(', ')}`
    });
    await log.save();

    res.status(200).json({ message: 'Workflow created successfully', document: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sign target doc and confirm audits
router.post('/:id/sign', async (req, res) => {
  const { email, signatureDataUrl, ipAddress, userAgent, documentHash } = req.body;
  try {
    const doc = await MongoDocument.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Mark corresponding signer workflow as complete
    let foundSigner = false;
    doc.signersWorkflow = doc.signersWorkflow.map(signer => {
      if (signer.email === email) {
        foundSigner = true;
        return { ...signer, signed: true, signedAt: new Date() };
      }
      return signer;
    });

    // Check if all workflow signers have signed
    const allSigned = doc.signersWorkflow.every(s => s.signed);
    if (allSigned) doc.status = 'completed';

    await doc.save();

    // Register in audit trail logs
    const log = new MongoAuditLog({
      documentId: doc._id.toString(),
      userEmail: email,
      action: 'Digitally signed document',
      ipAddress: ipAddress || '127.0.0.1',
      userAgent: userAgent || 'Web browser client',
      documentHash: documentHash || 'sha256-sealdocx-hash',
      certificateLog: `Verified by ConvertVerse digital cert. Token: ${Math.random().toString(36).substr(2, 6)}`
    });
    await log.save();

    res.status(200).json({ message: 'Document signed successfully', document: doc, auditLog: log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get audit logs for document
router.get('/:id/audit-trail', async (req, res) => {
  try {
    const logs = await MongoAuditLog.find({ documentId: req.params.id }).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
