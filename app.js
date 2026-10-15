const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const vehicleRequestRoutes = require("./routes/vehicleRequestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/vehicle-requests", vehicleRequestRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API Fast Import 🚗",
  });
});

module.exports = app;
