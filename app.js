const express = require("express");
const cors = require("cors");

const vehicleRoutes = require("./routes/vehicleRoutes");

const app = express();

app.use(cors());

app.use(express.json());

// Permet d'accéder aux images
app.use("/uploads", express.static("uploads"));

// Route test
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API Fast Import 🚗",
  });
});

// Routes véhicules
app.use("/api/vehicles", vehicleRoutes);

module.exports = app;
