const crypto = require('crypto');
require('dotenv').config();

// ==========================================
//         Encryption Configuration
// ==========================================

// AES-256-CBC is an industry-standard symmetric encryption algorithm
const ALGORITHM = 'aes-256-cbc';

// The secret key must be exactly 32 bytes (256 bits) for AES-256.
// We get it from the .env file, or fall back to a random key if missing.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
    ? Buffer.from(process.env.ENCRYPTION_KEY).slice(0, 32) 
    : crypto.randomBytes(32);

// Initialization Vector (IV) length must be 16 bytes for AES.
const IV_LENGTH = 16;

// ==========================================
//          Encryption Functions
// ==========================================

/**
 * Encrypts plain text into ciphertext.
 * @param {string} text - The plain text to encrypt.
 * @returns {string} - The encrypted text format: iv:encryptedData
 */
function encrypt(text) {
    // 1. Generate a random IV for every single encryption (ensures uniqueness)
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // 2. Create the cipher instance
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    // 3. Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // 4. Return the IV and the encrypted text combined (we need the IV for decryption)
    return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts ciphertext back into plain text.
 * @param {string} encryptedText - The encrypted text format: iv:encryptedData
 * @returns {string} - The original plain text.
 */
function decrypt(encryptedText) {
    // 1. Split the IV and the encrypted data
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedData = textParts.join(':');
    
    // 2. Create the decipher instance using the SAME key and the extracted IV
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    // 3. Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

// Export the functions to be used in other files
module.exports = { encrypt, decrypt };