import jwt from "jsonwebtoken";
import multer from "multer";

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};

export const conditionalMiddleware = (middleware) => {
  return (req, res, next) => {
    if (req.query.userId) {
      return middleware(req, res, next);
    }
    next();
  };
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

export const uploadSingle = upload.single("image");