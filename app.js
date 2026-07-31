const express = require("express");
const cors = require("cors");

const app = express();

// Autorise les requêtes du frontend
app.use(cors());

// Permet de recevoir du JSON
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API Fast Import 🚗",
  });
});

module.exports = app;
