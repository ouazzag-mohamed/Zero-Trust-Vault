const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
//          Security Middlewares
// ==========================================

// 1. Helmet: Secures the Express app by setting various HTTP headers. 
// It hides the 'X-Powered-By' header and protects against XSS & Clickjacking.
app.use(helmet()); 

// 2. CORS (Zero-Trust Approach): We do not trust any external origin.
// We strictly allow ONLY our React frontend to communicate with this API.
app.use(cors({
    origin: 'http://localhost:5173', // The exact URL of our React app
    methods: ['GET', 'POST'],        // Allow only specific HTTP methods
    credentials: true                // Allow cookies and authorization headers
}));

// 3. Body Parser: Allows the server to parse incoming JSON payloads.
app.use(express.json());

// ==========================================
//                API Routes
// ==========================================

// Health Check Route: Used by DevOps tools to verify if the server is alive.
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'Secure', 
        message: 'Zero-Trust Vault Backend is running safely. 🛡️' 
    });
});

// ==========================================
//               Start Server
// ==========================================
app.listen(PORT, () => {
    console.log(`🛡️ Vault Server is actively running on http://localhost:${PORT}`);
    console.log(`🔒 Security Middlewares (Helmet, CORS) are enabled.`);
});