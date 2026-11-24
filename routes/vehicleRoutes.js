const express = require("express");
const router = express.Router();

const authAdmin = require("../middleware/authAdmin");
const Vehicle = require("../models/Vehicle");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

// GET - Tous les véhicules
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("ERREUR RÉCUPÉRATION VÉHICULES :", error);
    res.status(500).json({
      message: "Erreur récupération véhicules",
      error: error.message,
    });
  }
});

// GET - Un véhicule par ID
router.get("/:id", async (req, res) => {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        message: "Identifiant du véhicule invalide",
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Véhicule introuvable",
      });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error("ERREUR RÉCUPÉRATION VÉHICULE :", error);
    res.status(500).json({
      message: "Erreur récupération véhicule",
      error: error.message,
    });
  }
});

// POST - Ajouter un véhicule avec images Cloudinary
router.post("/", authAdmin, upload.array("images", 5), async (req, res) => {
  try {
    const imagePaths = [];

    // Envoyer les images vers Cloudinary
    for (const file of req.files || []) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "fast-import/vehicles",
            resource_type: "image",
            transformation: [
              {
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        stream.end(file.buffer);
      });

      imagePaths.push(result.secure_url);
    }

    // Enregistrer le véhicule dans MongoDB
    const vehicle = new Vehicle({
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      mileage: req.body.mileage,
      fuel: req.body.fuel,
      gearbox: req.body.gearbox,
      price: req.body.price,
      description: req.body.description,
      status: req.body.status,
      images: imagePaths,
    });

    const savedVehicle = await vehicle.save();

    res.status(201).json(savedVehicle);
  } catch (error) {
    console.error("ERREUR CRÉATION :", error);

    res.status(500).json({
      message: "Erreur création véhicule",
      error: error.message,
    });
  }
});

// DELETE - Supprimer un véhicule (admin uniquement)
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        message: "Identifiant du véhicule invalide",
      });
    }

    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Véhicule introuvable",
      });
    }

    res.status(200).json({
      message: "Véhicule supprimé avec succès",
    });
  } catch (error) {
    console.error("ERREUR SUPPRESSION :", error);

    res.status(500).json({
      message: "Erreur suppression véhicule",
      error: error.message,
    });
  }
});

module.exports = router;
