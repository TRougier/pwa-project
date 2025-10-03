"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Message {
  id: string;
  pseudo: string;
  text: string;
  timestamp: number;
}

export default function Room() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pseudo, setPseudo] = useState("inconnu");

  // Charger pseudo et messages depuis le localStorage au démarrage
  useEffect(() => {
    const savedPseudo = localStorage.getItem("pseudo");
    if (savedPseudo) setPseudo(savedPseudo);

    const savedMessages = localStorage.getItem("messages");
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`, // id unique
      pseudo,
      text: input,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setInput("");

    // Sauvegarde immédiate dans le localStorage
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Room</h1>

      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#1e1e1e",
          padding: "1rem",
          borderRadius: "10px",
          marginBottom: "1rem",
          flexGrow: 1,
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#bdbcbcff" }}>Aucun message pour le moment...</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "0.5rem",
              textAlign: msg.pseudo === pseudo ? "right" : "left",
            }}
          >
            <span style={{ fontWeight: "bold", marginRight: "0.5rem", color: "#00bfff" }}>
              {msg.pseudo}:
            </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", width: "100%", maxWidth: "600px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez votre message..."
          style={{
            flexGrow: 1,
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #00bfff",
            color: "#fff",
            backgroundColor: "#1e1e1e",
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: "#00bfff",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Envoyer
        </button>
      </div>

      <Link
        href="/"
        style={{
          color: "#00bfff",
          textDecoration: "none",
          fontSize: "1.2rem",
          border: "1px solid #00bfff",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
        }}
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
