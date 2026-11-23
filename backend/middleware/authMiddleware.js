import jwt from "jsonwebtoken";
export const authMiddlware = (role = ["user", "admin"]) => {
  return (req, res, next) => {
    try {
      const token = req?.headers?.authorization?.split(" ")[1];
      if (!token) {
        return res.status(400).json({
          message: "Token not found",
        });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!decoded) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }
      if (!role.includes(decoded?.role)) {
        return res.status(403).json({
          message: "Unauthorized",
        });
      }
      req.user = decoded;
      next();
    } catch (e) {
      console.error(e);
      if (e?.name === "TokenExpiredError" || e === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired",
        });
      }
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};

export const authMiddleware = authMiddlware;
