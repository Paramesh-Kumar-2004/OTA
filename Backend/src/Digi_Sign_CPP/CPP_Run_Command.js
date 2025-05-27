import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';




// File paths for encryption and file management
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '../../src/Digi_Sign_CPP');  // Path to the directory containing your cpp files
const publicDir = path.join(__dirname,"../../public")



// Define paths for the C++ file and output file
const cppFilePath = path.join(srcDir, "main.cpp");
const outputFilePath = path.join(publicDir,"outh"); // The executable will be placed here



// Promisify exec to use async/await syntax
const execPromise = promisify(exec);


// Function to compile the C++ file
async function compileCPP(cppFilePath, outputFilePath) {
    try {
        console.log("Compiling C++ code...");
        const compileCommand = `g++ -o "${outputFilePath}" "${cppFilePath}" -lssl -lcrypto -fPIE`;
        await execPromise(compileCommand);
        console.log("Compilation successful!\n");
    } catch (error) {
        console.error('Error occurred during compilation:', error);
        throw new Error("Error occurred during compilation:");
    }
}



async function runExecutable(outputFilePath) {
    try {
        console.log("Running the compiled executable...");
        const runCommand = `cd "${publicDir}"; "${outputFilePath}"`;
        console.log(`Running command: ${runCommand}`);
        const output = await execPromise(runCommand);
        console.log('Output from the C++ program:', output.stdout);
    } catch (error) {
        console.error('Error occurred while running the executable:', error);
        throw new Error("Error occurred while running the executable:");
    }
}





// Execute the compilation and running steps
export async function execute() {

    try {
        // Create New Key Pairs
        // await generateRsaKeyPair()


        // First compile the C++ code
        await compileCPP(cppFilePath, outputFilePath);

        // If compilation is successful, run the executable
        // Pass the full path to runouth to ensure it can find the executable
        await runExecutable(outputFilePath)
    } catch (error) {
        console.error('Error in the overall process:', error);
        throw new Error("Error in the overall process:");
    }
}

// Call the execute function to run both steps
// execute();

 