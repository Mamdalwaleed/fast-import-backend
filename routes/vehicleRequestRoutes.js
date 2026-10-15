const express = require("express");
const router = express.Router();

const VehicleRequest = require("../models/VehicleRequest");
const authAdmin = require("../middleware/authAdmin");

// POST - Enregistrer une demande client
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      brand,
      model,
      budget,
      year,
      mileage,
      fuel,
      gearbox,
      power,
      preferredColor,
      notes,
    } = req.body;

    // Vérifier les informations obligatoires
    if (!name?.trim() || !phone?.trim() || !brand?.trim() || !model?.trim()) {
      return res.status(400).json({
        message:
          "Veuillez renseigner votre nom, votre téléphone, la marque et le modèle recherchés.",
      });
    }

    const request = await VehicleRequest.create({
      name,
      phone,
      email,
      brand,
      model,
      budget,
      year,
      mileage,
      fuel,
      gearbox,
      power,
      preferredColor,
      notes,
    });

    return res.status(201).json({
      message: "Votre demande a été envoyée avec succès.",
      request,
    });
  } catch (error) {
    console.error("ERREUR CRÉATION DEMANDE :", error);

    return res.status(500).json({
      message: "Impossible d'enregistrer votre demande.",
    });
  }
});

// GET - Consulter les demandes (admin uniquement)
router.get("/", authAdmin, async (req, res) => {
  try {
    const requests = await VehicleRequest.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(requests);
  } catch (error) {
    console.error("ERREUR RÉCUPÉRATION DEMANDES :", error);

    return res.status(500).json({
      message: "Erreur lors de la récupération des demandes.",
    });
  }
});

// PATCH - Modifier le statut d'une demande (admin uniquement)
router.patch("/:id/status", authAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Nouvelle", "En cours", "Traitée"];

    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        message: "Identifiant de demande invalide.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Statut invalide.",
      });
    }

    const request = await VehicleRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!request) {
      return res.status(404).json({
        message: "Demande introuvable.",
      });
    }

    return res.status(200).json({
      message: "Statut mis à jour.",
      request,
    });
  } catch (error) {
    console.error("ERREUR MODIFICATION STATUT :", error);

    return res.status(500).json({
      message: "Erreur lors de la modification du statut.",
    });
  }
});

module.exports = router;
