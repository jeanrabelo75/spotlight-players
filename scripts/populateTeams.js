import axios from "axios";
import mongoose from "mongoose";
import { config } from "dotenv";
import leagues from './leagues.json';
import Team from "../src/models/team.js";
import League from "../src/models/league.js";

config();

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY || "";
const API_FOOTBALL_HOST = process.env.API_FOOTBALL_HOST || "";
const API_FOOTBALL_URL = process.env.API_FOOTBALL_URL || "";

async function populateTeams() {
  try {
    if (!API_FOOTBALL_KEY || !API_FOOTBALL_HOST || !API_FOOTBALL_URL) {
      throw new Error("As configurações da API não foram encontradas.");
    }

    for (const entry of leagues.leagues) {
      const { name, country, code, number } = entry;
      const season = "2023";

      const response = await axios.get(API_FOOTBALL_URL + "teams", {
        headers: {
          "X-RapidAPI-Key": API_FOOTBALL_KEY,
          "X-RapidAPI-Host": API_FOOTBALL_HOST,
        },
        params: {
          league: number,
          season: season,
        },
      });

      console.log("Status da resposta da API:", response.status);

      const newLeague = new League({
        name: name,
        country: country,
        code: code,
      });

      newLeague.save();

      for (const entry of response.data.response) {
        const { team, venue } = entry;

        const newTeam = new Team({
          name: team.name,
          country: team.country,
          league: newLeague._id,
          code: team.code,
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
  populateTeams();
});
