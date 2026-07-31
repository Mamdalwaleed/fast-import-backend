const express = require("express");
const router = express.Router();

const Vehicle = require("../models/Vehicle");

// GET : récupérer tous les véhicules
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des véhicules",
      error: error.message,
    });
  }
});

// GET : récupérer un véhicule par son ID
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Véhicule introuvable",
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du véhicule",
      error: error.message,
    });
  }
});

// POST : ajouter un véhicule
router.post("/", async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);

    const savedVehicle = await vehicle.save();

    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la création du véhicule",
      error: error.message,
    });
  }
});

module.exports = router;
