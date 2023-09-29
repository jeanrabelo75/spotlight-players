import axios from "axios";
import mongoose from "mongoose";
import { config } from "dotenv";
import { readFile } from "fs/promises";
import Team from "../src/models/team.js";
import League from "../src/models/league.js";

config({ path: "../.env" });

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY || "";
const API_FOOTBALL_URL = process.env.API_FOOTBALL_URL || "";
const API_FOOTBALL_HOST = process.env.API_FOOTBALL_HOST || "";

const SEASON = "2023";
const LEAGUES = JSON.parse(
  await readFile(new URL("../data/leagues.json", import.meta.url))
);

async function populateTeams() {
  try {
    for (const entry of LEAGUES.leagues) {
      const { name, country, code, number } = entry;

      const response = await axios.get(API_FOOTBALL_URL + "teams", {
        headers: {
          "X-RapidAPI-Key": API_FOOTBALL_KEY,
          "X-RapidAPI-Host": API_FOOTBALL_HOST,
        },
        params: {
          league: number,
          season: SEASON,
        },
      });

      console.log("Status da resposta da API:", response.status);

      const league = await League.findOneAndUpdate(
        { code },
        { name, country, code },
        { upsert: true, new: true }
      );

      for (const entry of response.data.response) {
        const { team, venue } = entry;
        const externalId = team.id;

        const existingTeam = await Team.findOne({ external_id: externalId });

        if (!existingTeam) {
          const newTeam = new Team({
            name: team.name,
            country: team.country,
            league: league._id,
            code: team.code,
            external_id: team.id,
            founded: team.founded,
            logo: team.logo,
            city: venue.city,
          });

          try {
            await newTeam.save();
            console.log("Time " + team.name + " salvo!");
          } catch (error) {
            console.error("Erro ao salvar o time " + team.name + ":", error);
          }
        } else {
          console.log("Time " + team.name + " já existente.");
        }
      }
    }

    console.log('Coleção "teams" preenchida com sucesso!');
  } catch (error) {
    console.error('Erro ao preencher a coleção "teams":', error);
  } finally {
    mongoose.connection.close();
  }
}

mongoose.connect("mongodb://localhost:27017/spotlightplayers", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Conexão com o MongoDB estabelecida com sucesso!");

  if (!API_FOOTBALL_KEY || !API_FOOTBALL_HOST || !API_FOOTBALL_URL) {
    console.log("As configurações da API não foram encontradas.");
    process.exit(1);
  } else {
    populateTeams();
  }
});
