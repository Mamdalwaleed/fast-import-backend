const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Connexion administrateur
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.JWT_SECRET
    ) {
      return res.status(500).json({
        message: "Configuration administrateur manquante.",
      });
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Erreur connexion admin :", error.message);

    return res.status(500).json({
      message: "Erreur lors de la connexion administrateur.",
    });
  }
});

module.exports = router;
