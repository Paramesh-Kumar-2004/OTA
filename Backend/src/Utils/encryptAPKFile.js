
import fs from 'fs';
import crypto from 'crypto';
import axios from 'axios';
import path from 'path'

// Fetch public key from the server
const fetch_key = async () => {
    try {
        const response = await axios.get('http://localhost:3000/keys'); // Raspberry PI Host URL 
        console.log(response.data)
        return response.data.publickey;
    } catch (error) {
        console.error('Error fetching public key from server:', error);
        throw new Error('Failed to fetch public key');
    }
};

// Encrypt APK file
const encryptAPKFile = async (inputAPK, outputEncryptedAPK) => {
    try {
        // Read the APK file as a buffer
        const apkBuffer = fs.readFileSync(inputAPK);

        // Fetch public key for encryption
        const publicKey = await fetch_key();

        // Ensure the public key is formatted correctly
        const formattedPublicKey = publicKey.trim();  // Clean any extra whitespace
        const publicKeyBuffer = formattedPublicKey;

        // Encrypt the APK file using the public key
        const encryptedAPKBuffer = crypto.publicEncrypt(
            {
                key: publicKeyBuffer,  
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, // RSA OAEP padding for encryption
            },
            apkBuffer
        );

        // Write the encrypted APK to the specified output path
        fs.writeFileSync(outputEncryptedAPK, encryptedAPKBuffer);

        console.log(`Encryption done. Encrypted APK saved to: ${outputEncryptedAPK}`);
        return outputEncryptedAPK;
    } catch (error) {
        console.error('Error encrypting APK file:', error);
        throw new Error('Could not encrypt APK file');
    }
};





export { encryptAPKFile };


// const ip = './input.apk';  
// const op = "./ENCENCddjnjndjfnjnd.apk"

// encryptAPKFile(ip,op)
 