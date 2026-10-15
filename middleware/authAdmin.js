const jwt = require("jsonwebtoken");

function authAdmin(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentification administrateur requise",
    });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: "Token manquant",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET est absent de la configuration.");
    return res.status(500).json({
      message: "Configuration de sécurité manquante",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Accès réservé à l'administrateur",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Erreur JWT :", error.name);

    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Session expirée. Reconnecte-toi."
          : "Session invalide. Reconnecte-toi.",
    });
  }
}

module.exports = authAdmin;
