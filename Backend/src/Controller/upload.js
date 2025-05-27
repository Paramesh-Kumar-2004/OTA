import multer from 'multer';
import path from 'path';

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for encryption
const upload = multer({ storage: storage });

export default upload;





 