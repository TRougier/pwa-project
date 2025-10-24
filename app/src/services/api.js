
const BASE_URL = "http://formation.anjousoft.fr/socketio/api";

export async function getImage(id) {
  const res = await fetch(`${BASE_URL}/images/${id}`);
  return await res.json();
}

export async function postImage(id, imageData) {
  const res = await fetch(`${BASE_URL}/images/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, image_data: imageData }),
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
