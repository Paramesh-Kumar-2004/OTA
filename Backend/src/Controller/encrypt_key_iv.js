import { exec } from 'child_process';
import path from 'path';

// Function to run the C++ encryption program and proceed to the next process after encryption completes
export function encryptKeyFileWithPublicKey(inputFilePath, outputFilePath, publicKey) {
    return new Promise((resolve, reject) => {
        // Construct the command to execute the C++ program
        const executablePath = path.resolve('./src/key_iv_encrypt_CPP/enc');  // Path to the compiled C++ executable
        const command = `"${executablePath}" "${publicKey}" "${inputFilePath}" "${outputFilePath}"`;

        // Execute the C++ program
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing C++ program: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`C++ program stderr: ${stderr}`);
                reject(stderr);
                return;
            }

            console.log(`Key, IV, HASH Value Encryption completed successfully: ${stdout}`);
            resolve(stdout);  // Proceed to the next process if successful
        });
    });
}





// // Example usage of the function
// const inputFilePath = './keys.json';  // Path to your input file
// const outputFilePath = './encrypted_key_iv.bin';  // Path to save encrypted output
// const publicKey = `-----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3y7SVWdVxz7tjA1n9hWU
// 5sxkIKKwg4awIQCQ2gg2zL71uUkOfEN51bwB0LkqU89qCgYs1BpVokOXtKGHGPV4
// EfCKL65WPlj4eJsFZsT48CK1OtkvJkAcee/XhOAh9MvkE37dGldOd1kAr4fhNwLH
// 9tIdiRIPGSS/evFEH+1PumiljAIFqJweWr4D2eFBd6mCcVLFETZLmVSYkHw34GbQ
// k0oFRB5BauUtJCwQ/Bk+l76Fvr/BI7BxLhUAOyBqeFZnaikO8uZnL2KMjpdvA6po
// oFT5+8NCt2+qUQP5j4+ozXULgShIIbP0/3rLvtWKtEGsHseJyila69iosjngdI9i
// 7wIDAQAB
// -----END PUBLIC KEY-----`;

// encryptKeyFileWithPublicKey(inputFilePath, outputFilePath, publicKey)
//     .then(() => {
//         // This block runs only after encryption is successfully completed
//         console.log("Proceeding to the next process after successful encryption.");
//         // Call the next process or function here
//     })
//     .catch((err) => {
//         // Handle errors, if any
//         console.error("Encryption failed. Error:", err);
//     });

 