import multer from "multer";

// memory storage: file is kept in RAM buffer, not written to disk
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
