"use client";

import { useEffect, useState } from "react";
import { getRooms } from "../src/services/api";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms()
      .then((data) => {
        if (data.success && data.data) setRooms(Object.keys(data.data));
      })
      .catch((err) => console.error("Erreur API:", err));
  }, []);

  return (
    <div>
      <h1>Liste des Rooms</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room}>{room}</li>
        ))}
      </ul>
    </div>
  );
}
