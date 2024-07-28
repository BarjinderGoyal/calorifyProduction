// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";

// // Get the current file path and directory name
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const uploadDirectory = path.join(__dirname, "../../public/foods");
// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("file inside multer", file);
//     cb(null, path.join(__dirname, "../../public/foods"));
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname + "-" + uniqueSuffix);
//   },
// });

// export const upload = multer({ storage: storage });

import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
