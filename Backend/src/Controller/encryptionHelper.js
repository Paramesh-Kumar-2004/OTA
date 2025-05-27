import fs from 'fs';
import crypto, { publicEncrypt } from 'crypto';
import path from 'path';
import * as tar from 'tar';
import os from 'os';
import targz from 'targz';
import { fileURLToPath } from 'url';
import forge from 'node-forge';



// File paths for encryption and file management
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../../public');




const generateSHA256Hash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return hash.digest('hex');
};



// APK Encryption Using AES
// export const encryptAPKFile = async (inputAPKPath, outputEncryptedAPKPath, aeskey, ivkey,outputKeyFilePath) => {
//   try {
//     console.log("\nEntered To APK ENCRYPTION FUNCTION + Keys.json File Creation")

//     const aesKeyBuffer = Buffer.from(aeskey, 'hex');
//     const ivBuffer = Buffer.from(ivkey, 'hex');
//     console.log('aesKeyBuffer :',aesKeyBuffer);
//     console.log('ivBuffer :',ivBuffer);

//     if (aesKeyBuffer.length !== 32 || ivBuffer.length !== 16) {
//       throw new Error("Invalid AES key or IV length");
//     }

//     // Read the APK file
//     const apkBuffer = fs.readFileSync(inputAPKPath);
//     const cipher = crypto.createCipheriv('aes-256-cbc', aesKeyBuffer, ivBuffer);

//     let encryptedAPK = cipher.update(apkBuffer);
//     encryptedAPK = Buffer.concat([encryptedAPK, cipher.final()]);

//     fs.writeFileSync(outputEncryptedAPKPath, encryptedAPK);
//     console.log("APK FILE Encrypted Successfully...")


//     const sha256Hash = generateSHA256Hash(outputEncryptedAPKPath);
//     console.log('\nSHA-256 Hash of Encrypted APK:', sha256Hash,"\n");


//     const key = aeskey.toString('hex')
//     const iv = ivkey.toString('hex')
//     const sha256 = sha256Hash

//     const keyJson = { key, iv, sha256 };

//     fs.writeFileSync(outputKeyFilePath, JSON.stringify(keyJson, null, 2));
//     console.log("Keys.json (key,iv,sha256)File Created Successfully...");
//     return [outputEncryptedAPKPath];

//   } catch (error) {
//     console.error('Error encrypting APK file:', error);
//     throw new Error('Could not encrypt APK file');
//   }
// };



export const createTarball = async (files, tarFileName) => {
  console.log("\nEntered Into The TarGz File Creation Function");

  // Define the paths to the files in the public folder
  const publicDir = path.join(__dirname, '../../public');

  // Define the output tarball file path (this will be saved in the public folder)
  const outputTarGz = path.join(publicDir, tarFileName);

  try {
    console.log("Starting Tar.Gz File Creation");

    console.log("FILES TO MAKE TAR :",files)
    // Create the tarball directly from the files
    await tar.c(
      {
        gzip: true,          // Compress with gzip
        file: outputTarGz,   // Output file path
        cwd: publicDir       // Specify the base directory for relative paths
      },
      files // Just the file names, not full paths
    );

    console.log("Tarball (Tar.Gz) Created Successfully!...");
  } catch (err) {
    console.error("Error creating tarball:", err);
  }
};




export const encryptAPKFile = async (inputAPKPath, outputEncryptedAPKPath, aeskey, ivkey, outputKeyFilePath,APKTarGzFileName) => {
  try {
    console.log("\nEntered To APK ENCRYPTION FUNCTION + Keys.json File Creation")


    const apkTarGzFileName = APKTarGzFileName

    const aesKeyBuffer = Buffer.from(aeskey, 'hex');
    const ivBuffer = Buffer.from(ivkey, 'hex');
    console.log('aesKeyBuffer :', aesKeyBuffer);
    console.log('ivBuffer :', ivBuffer);

    if (aesKeyBuffer.length !== 32 || ivBuffer.length !== 16) {
      throw new Error("Invalid AES key or IV length");
    }
 
    const publicDir = path.join(__dirname, '../../public');

    // Define the output tarball file path (this will be saved in the public folder)
    const outputTarGz = path.join(publicDir, apkTarGzFileName);
    console.log("Starting APK Tar.Gz File Creation");
    
    console.log("Input APK To Make It As A TarGz :",inputAPKPath)
    console.log("Output APK Tar Path :",outputTarGz)
    // Create the tarball directly from the files
    await tar.c(
      {
        gzip: true,          // Compress with gzip
        file: outputTarGz,   // Output Tar file path
        cwd: publicDir       // It Helps TO where the tar take file(Our File) for make tar.gz
      },
      [inputAPKPath] // Just the file names, not full path. Why File Name Means the cwd used to take the file in that location using this name only
    );

    console.log("Tarball For APK Created Successfully!...");


    // Read the APK file
    // const apkBuffer = fs.readFileSync(inputAPKPath);
    const apkBuffer = fs.readFileSync(path.join(publicDir,apkTarGzFileName));
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKeyBuffer, ivBuffer);

    let encryptedAPK = cipher.update(apkBuffer);
    encryptedAPK = Buffer.concat([encryptedAPK, cipher.final()]);

    fs.writeFileSync(outputEncryptedAPKPath, encryptedAPK);
    console.log("APK FILE Encrypted Successfully...")


    const sha256Hash = generateSHA256Hash(outputEncryptedAPKPath);
    console.log('\nSHA-256 Hash of Encrypted APK:', sha256Hash, "\n");


    const key = aeskey.toString('hex')
    const iv = ivkey.toString('hex')
    const sha256 = sha256Hash

    const keyJson = { key, iv, sha256 };

    fs.writeFileSync(outputKeyFilePath, JSON.stringify(keyJson, null, 2));
    console.log("Keys.json (key,iv,sha256)File Created Successfully...");
    return [outputEncryptedAPKPath];

  } catch (error) {
    console.error('Error encrypting APK file:', error);
    throw new Error('Could not encrypt APK file');
  }
};


