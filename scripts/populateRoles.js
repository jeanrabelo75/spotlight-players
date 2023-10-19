import mongoose from "mongoose";
import { config } from "dotenv";
import { readFile } from "fs/promises";
import Roles from "../src/models/roles.js";

config();

const MONGO_URI = process.env.MONGO_URI || "";
const ROLES = JSON.parse(
  await readFile(new URL("../data/roles.json", import.meta.url)),
);

async function seedRoles() {
  try {
    await mongoose.connect('mongodb://localhost:27017/spotlightplayers', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    for (const roleData of ROLES.roles) {
      const role = new Roles({
        name: roleData.name,
        permissions: roleData.permissions,
      });

      await role.save();
      console.log(`Role '${role.name}' salva no banco de dados.`);
    }

    console.log('Seed concluído.');
  } catch (error) {
    console.error('Erro durante o seed:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedRoles();
