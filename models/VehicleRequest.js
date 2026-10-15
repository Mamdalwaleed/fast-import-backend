const mongoose = require("mongoose");

const vehicleRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

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

    budget: {
      type: Number,
      min: 0,
      default: null,
    },

    year: {
      type: Number,
      min: 1900,
      default: null,
    },

    mileage: {
      type: Number,
      min: 0,
      default: null,
    },

    fuel: {
      type: String,
      default: "",
    },

    gearbox: {
      type: String,
      default: "",
    },

    power: {
      type: Number,
      min: 0,
      default: null,
    },

    preferredColor: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Nouvelle", "En cours", "Traitée"],
      default: "Nouvelle",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("VehicleRequest", vehicleRequestSchema);
