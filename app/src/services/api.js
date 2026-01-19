
const BASE_URL = "https://api.tools.gavago.fr/socketio/api";

export async function createRoom(roomName) {
  try {
    const res = await fetch(`${BASE_URL}/rooms/${roomName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName }),
    });
    if (!res.ok) {
      console.error(`Erreur: ${res.status} ${res.statusText}`);
      return { success: false, error: `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (error) {
    console.error("Erreur createRoom:", error);
    return { success: false, error: error.message };
  }
}


export async function getRooms() {
  try {
    const res = await fetch(`${BASE_URL}/rooms`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.error(`Erreur: ${res.status} ${res.statusText}`);
      return { success: false, data: [], error: `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (error) {
    console.error("Erreur getRooms:", error);
    return { success: false, data: [], error: error.message };
  }
}
