import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoUser } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-token-key-1234';

// User signup endpoint
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existing = await MongoUser.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new MongoUser({
      email,
      password: hashedPassword,
      name
    });
    await user.save();
    
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await MongoUser.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token, user: { id: user._id, email: user.email, name: user.name, savedSignatures: user.savedSignatures } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save signature dataURL in user profile
router.post('/signatures', async (req, res) => {
  const { email, signatureName, dataUrl } = req.body;
  try {
    const user = await MongoUser.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const sigItem = {
      id: `${Date.now()}`,
      name: signatureName || 'New Signature',
      dataUrl
    };
    user.savedSignatures.unshift(sigItem);
    await user.save();

    res.status(200).json({ message: 'Signature saved successfully', signatures: user.savedSignatures });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch saved signature list
router.get('/signatures/:email', async (req, res) => {
  try {
    const user = await MongoUser.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ signatures: user.savedSignatures });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
