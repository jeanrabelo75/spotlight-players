import axios from "axios";
import mongoose from "mongoose";
import { config } from "dotenv";
import Team from "../src/models/team.js";
import Player from "../src/models/player.js";

config({ path: "../.env" });

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY || "";
const API_FOOTBALL_URL = process.env.API_FOOTBALL_URL || "";
const API_FOOTBALL_HOST = process.env.API_FOOTBALL_HOST || "";

const SEASON = "2023";

async function fetchPlayers(teamExternalId, page) {
  try {
    const response = await axios.get(API_FOOTBALL_URL + "players", {
      headers: {
        "X-RapidAPI-Key": API_FOOTBALL_KEY,
        "X-RapidAPI-Host": API_FOOTBALL_HOST,
      },
      params: {
        team: teamExternalId,
        season: SEASON,
        page: page,
      },
    });

    console.log("Status da resposta da API:", response.status);

    return response.data.response;
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error);
    return [];
  }
}

async function populatePlayers() {
  try {
    const teams = await Team.find();

    for (const team of teams) {
      let currentPage = 1;
      let totalPages = 1;

      do {
        const playersData = await fetchPlayers(team.external_id, currentPage);

        if (playersData.length === 0) {
          break;
        }

        for (const playerData of playersData) {
          const { player, statistics } = playerData;

          const name =
            player.firstname && player.lastname
              ? `${player.firstname} ${player.lastname}`
              : player.name;

          const newPlayer = new Player({
            name: name,
            team: team._id,
            photo: player.photo,
            height: player.height,
            weight: player.weight,
            external_id: player.id,
            birthday: player.birth.date,
            country: player.nationality,
            position: statistics[0].games.position,
          });

          try {
            await newPlayer.save();
            console.log("Jogador " + player.name + " salvo!");
          } catch (error) {
            if (error.code === 11000) {
              console.warn("Jogador duplicado, pulando...");
            } else {
              console.error(
                "Erro ao salvar o jogador " + player.name + ":",
                error
              );
            }
          }
        }

        totalPages = playersData.paging.total;
        currentPage++;
      } while (currentPage <= totalPages);
    }

    console.log('Coleção "players" preenchida com sucesso!');
  } catch (error) {
    console.error('Erro ao preencher a coleção "players":', error);
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
    populatePlayers();
  }
});
