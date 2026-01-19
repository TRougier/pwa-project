
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
  try {
    const res = await fetch(`${BASE_URL}/rooms`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.error("Erreur API:", res.status, res.statusText);
      return { success: false, data: null };
    }
    return await res.json();
  } catch (error) {
    console.error("Erreur lors du chargement des rooms:", error);
    return { success: false, data: null };
  }
}
