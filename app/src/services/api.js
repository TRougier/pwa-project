
const BASE_URL = "https://api.tools.gavago.fr/socketio/api";

export async function createRoom(roomName) {
  const res = await fetch(`${BASE_URL}/rooms/${roomName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomName }),
  });
  return await res.json();
}


export async function getRooms() {
  const res = await fetch(`${BASE_URL}/rooms`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
}
