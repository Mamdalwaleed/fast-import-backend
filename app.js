const express = require("express");
const cors = require("cors");

const vehicleRoutes = require("./routes/vehicleRoutes");

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

// Routes véhicules
app.use("/api/vehicles", vehicleRoutes);

module.exports = app;
