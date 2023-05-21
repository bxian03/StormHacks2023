import { firebaseApp, firebaseDb } from "./firebase";
import { get, push, ref, set, update } from "firebase/database";
import Player from "./Player";

/**
 *
 * @param {Player} player the player that is creating the room
 * @param {gameType} gameType the type of game that is being created
 */
export async function createRoom(player, gameType) {
  const newRoomRef = ref(firebaseDb, "rooms");
  const id = generateId(4);
  const newRoom = await push(newRoomRef, {
    id: id, // roomID
    type: gameType,
    players: [
      {
        id: player.id,
        name: player.name,
        score: 0,
      },
    ],
  });
  return await get(newRoom);
}

// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex(dec) {
  return dec.toString(16).padStart(2, "0");
}

// generateId :: Integer -> String
function generateId(len) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}
