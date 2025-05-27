import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';




// File paths for encryption and file management
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const srcDir = path.join(__dirname, '../../src/Digi_Sign_CPP');  // Path to the directory containing your cpp files
const publicDir = path.join(__dirname,"../../public");

console.log(__dirname)

// Function to generate RSA key pair
export async function generateRsaKeyPair() {
    try {
        // Generate RSA key pair with 2048 bits
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,  // RSA key size
            publicKeyEncoding: {
                type: 'spki',  // Use 'spki' for public key format
                format: 'pem', // PEM format
            },
            privateKeyEncoding: {
                type: 'pkcs8',  // Use 'pkcs8' for private key format
                format: 'pem',  // PEM format
            },
        });

        // Log the keys to the console (they will be in PEM format with the appropriate headers)
        console.log("New Public Key:\n", publicKey);
        console.log("New Private Key:\n", privateKey);

        // Save the keys to files
        // fs.writeFileSync("../Digi_Sign_CPP/new_public_key.pem", publicKey);
        // fs.writeFileSync("../Digi_Sign_CPP/new_private_key.pem", privateKey);


        fs.writeFileSync(path.join(publicDir,"new_public_key.pem"),publicKey)
        fs.writeFileSync(path.join(publicDir,"new_private_key.pem"),privateKey)

        console.log("RSA keys generated and saved successfully!\n");

        // Return the generated keys
        return { publicKey, privateKey };
        
    } catch (err) {
        console.error("Error generating RSA key pair:", err);
        throw new Error("Error generating RSA key pair:");
        // process.exit(1);  // Exit with error code
    }
}

// Example usage:
// const { publicKey, privateKey } = generateRsaKeyPair();
// generateRsaKeyPair()



 
