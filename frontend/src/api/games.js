import { apiFetch } from "./http";

export async function listAllGames() {
  return apiFetch("/api/games");
}

export async function getGameById(gameId) {
  return apiFetch(`/api/games/${gameId}`);
}

export async function getMyCollection() {
  return apiFetch("/api/user/collection"); // requires cookie
}

// NOTE: your backend currently expects userId in body
export async function addToMyCollection({ userId, gameId }) {
  return apiFetch("/api/user/games", {
    method: "POST",
    body: { userId, gameId },
  });
}

export async function removeFromMyCollection(gameId) {
  return apiFetch(`/api/user/games/${gameId}`, { method: "DELETE" });
}
