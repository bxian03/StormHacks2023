import { firebaseApp, firebaseDb } from "./firebase";
import { child, get, push, ref, set, update } from "firebase/database";
import Player from "./Player";

/**
 *
 * @param {Player} player the player that is creating the room
 * @param {gameType} gameType the type of game that is being created
 */
export async function createRoom(player, gameType) {
  const newRoomRef = ref(firebaseDb, "rooms");
  const id = generateId(4);
  const newRoom = await set(child(newRoomRef, id), {
    type: gameType,
    players: [
      {
        name: player.name,
        score: 0,
        ready: false,
      },
    ],
  });
  return id;
}

export async function joinRoom(player, roomId) {
  const playerRef = ref(firebaseDb, `rooms/${roomId}/players`);
  const user = await get(ref(firebaseDb, `rooms/${roomId}`));
  if (!user.exists() || user.exists() === undefined) {
    throw new Error("Room does not exist");
  }
  const room = await push(playerRef, {
    name: player.name,
    score: 0,
    ready: false,
  });
}

export async function getUsers(roomId) {
  const playerRef = ref(firebaseDb, `rooms/${roomId}/players`);
  const player = await get(playerRef);
  return player.val();
}

export async function checkReady(roomId) {
  const playerRef = ref(firebaseDb, `rooms/${roomId}/players`);
  const player = await get(playerRef);
  const players = player.val();
  for (const player of players) {
    if (!player.ready) return false;
  }
  return true;
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
