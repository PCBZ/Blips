import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
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