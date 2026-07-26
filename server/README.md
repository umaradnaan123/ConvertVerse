# ConvertVerse PDF Suite Backend API & Socket Server

This directory contains the production-ready Node.js + Express API server and Socket.IO real-time sync server for **ConvertVerse PDF Editor, Form Builder & Signature Suite**.

---

## Technical Features

1. **Authentication API**:
   - Register, log in, and session tracking using JWT.
   - Encrypted user database using `bcryptjs` for security.
   - Save signatures data URLs directly in profile profiles.
2. **WebSocket Sync Workspace**:
   - Synchronize cursor placements and absolute coordinate pointers in real-time.
   - Delta elements updates broadcasting (simulating live collaboration like Figma/Google Docs).
3. **Sealed Signatures & Compliance Log**:
   - Multi-recipient signing workflows.
   - SHA-256 integrity document audits logs.
   - Metadata sealing logs tracking User IP, token verification, and signature stamps.

---

## Installation & Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in this directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/convertverse
   JWT_SECRET=super-secret-signature-key-1234
   ```
4. Run in development mode:
   ```bash
   npm run dev
   ```

---

## REST API Documentation

### Auth Router (`/api/auth`)
- `POST /signup`: Create a new account.
- `POST /login`: Verify credentials and retrieve a JWT token.
- `POST /signatures`: Store signature dataURL to account.
- `GET /signatures/:email`: Fetch saved signature cards.

### Document Router (`/api/documents`)
- `POST /upload`: Uploads a PDF binary and converts it to a workspace.
- `GET /:id`: Retrieves layout elements, coordinates, and workflow states.
- `POST /:id/save`: Saves active elements layout arrays.
- `POST /:id/request-signing`: Configures signer recipient emails.
- `POST /:id/sign`: Registers signature verification hashes and updates audit logs.
- `GET /:id/audit-trail`: Retrieves SHA auditing histories.

---

## WebSocket Events Sync (Socket.IO)

- `join-document`: Join a room with `documentId`, `username`, and `color`.
- `cursor-move`: Broadcast current coordinates `{ x, y }` of the mouse cursor.
- `element-update`: Broadcast element updates (text changes, signature inserts, shapes drag).
- `comment-add`: Sync and broadcast annotation thread comments.
