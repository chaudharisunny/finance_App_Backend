import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const createToken = (user) => {
    const payload = {
        id: user._id, 
        email: user.email,
        username: user.username,
        image:user.image
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in .env")
    }

    return jwt.sign(payload, secret, { expiresIn: '8h' })
}


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id }; // ✅ now _id exists
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};


