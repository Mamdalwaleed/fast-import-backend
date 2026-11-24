require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Vehicle = require("./models/Vehicle");
const cloudinary = require("./config/cloudinary");

const uploadsFolder = path.join(__dirname, "uploads");

// Uniquement les quatre véhicules confirmés
const vehiclesToMigrate = [
  {
    id: "6acce64afbf565781f33ba2c",
    filename: "1791813194146-IMG_1939.jpeg",
    oldPath: "/uploads/1791813194146-IMG_1939.jpeg",
  },
  {
    id: "6accfbd953c3bb3010d8cd13",
    filename: "1791818713309-PRIUSB.jpeg",
    oldPath: "/uploads/1791818713309-PRIUSB.jpeg",
  },
  {
    id: "6accfc0e53c3bb3010d8cd14",
    filename: "1791818766783-PRIUSR.jpeg",
    oldPath: "/uploads/1791818766783-PRIUSR.jpeg",
  },
  {
    id: "6accfc5c53c3bb3010d8cd15",
    filename: "1791818844881-CHR.jpeg",
    oldPath: "/uploads/1791818844881-CHR.jpeg",
  },
];

async function migrateImages() {
  try {
    console.log("🚗 Démarrage de la migration Fast Import...");

    if (
      !process.env.MONGO_URI ||
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Une variable d'environnement manque dans .env");
    }

    await connectDB();

    const uploadedImages = [];

    // 1. Vérifier et transférer les quatre photos
    for (const item of vehiclesToMigrate) {
      const vehicle = await Vehicle.findById(item.id);

      if (!vehicle) {
        throw new Error(`Véhicule introuvable : ${item.id}`);
      }

      if (!vehicle.images.includes(item.oldPath)) {
        throw new Error(
          `L'ancienne adresse de la photo ne correspond pas pour ${item.id}`,
        );
      }

      const filePath = path.join(uploadsFolder, item.filename);

      if (!fs.existsSync(filePath)) {
        throw new Error(`Photo locale introuvable : ${item.filename}`);
      }

      console.log(`📤 Transfert : ${item.filename}`);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "fast-import/vehicles",
        public_id: path.parse(item.filename).name,
        resource_type: "image",
        overwrite: true,
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      });

      uploadedImages.push({
        ...item,
        url: result.secure_url,
      });

      console.log("✅ Photo envoyée sur Cloudinary.");
    }

    // 2. Mettre à jour uniquement les adresses des quatre photos
    const operations = uploadedImages.map((item) => ({
      updateOne: {
        filter: {
          _id: item.id,
          images: item.oldPath,
        },
        update: {
          $set: {
            "images.$[photo]": item.url,
          },
        },
        arrayFilters: [
          {
            photo: item.oldPath,
          },
        ],
      },
    }));

    const result = await Vehicle.bulkWrite(operations);

    console.log("\n🎉 MIGRATION TERMINÉE !");
    console.log("Photos envoyées :", uploadedImages.length);
    console.log("Véhicules modifiés :", result.modifiedCount);

    uploadedImages.forEach((item) => {
      console.log(`${item.filename} -> ${item.url}`);
    });
  } catch (error) {
    console.error("\n❌ ERREUR :", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    console.log("Connexion MongoDB fermée.");
  }
}

migrateImages();
