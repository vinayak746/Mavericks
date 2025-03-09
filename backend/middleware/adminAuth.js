import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Not authorized, try again" });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, try again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(token_decode);
    if (token_decode.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default adminAuth;