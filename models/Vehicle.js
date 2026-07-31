const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    mileage: {
      type: Number,
      required: true,
    },

    fuel: {
      type: String,
      required: true,
      enum: ["Essence", "Diesel", "Hybride", "Électrique"],
    },

    gearbox: {
      type: String,
      required: true,
      enum: ["Manuelle", "Automatique"],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["Disponible", "Réservé", "Vendu"],
      default: "Disponible",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
