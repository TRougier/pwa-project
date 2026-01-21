"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { addNotification, clearNotifications, getNotifications, SimpleNotification } from "../utils/notifications";
import { io } from "socket.io-client";

const SOCKET_URL = "https://api.tools.gavago.fr";

type ChatMessage = {
  content: string;
  roomName: string;
  userId: string;
  categorie: "MESSAGE" | "INFO" | "NEW_IMAGE";
  serverId: string;
  pseudo?: string;
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<SimpleNotification[]>([]);
  const pseudoRef = useRef<string | null>(null);

  const refresh = () => setNotifs(getNotifications());

  useEffect(() => {
    pseudoRef.current = localStorage.getItem("pseudo");
    refresh();

    const handler = () => refresh();
    window.addEventListener("notifications-updated", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("notifications-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: false,
    });

    s.on("chat-msg", (msg: ChatMessage) => {
      if (msg.categorie !== "MESSAGE") return;

      //Eviter les notifications pour ses propres messages
      const myPseudo = pseudoRef.current;
      if (myPseudo && msg.pseudo === myPseudo) return;

      const author = msg.pseudo || msg.userId || "Anonyme";
      addNotification(`[${msg.roomName}] ${author}: ${msg.content}`);
      refresh();
    });

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Notifications</h1>

      <button
        style={styles.clearBtn}
        onClick={() => {
          clearNotifications();
          refresh();
        }}
      >
        Vider
      </button>

      <div style={styles.list}>
        {notifs.length === 0 ? (
          <p>Aucune notification.</p>
        ) : (
          notifs.map((n) => (
            <div key={n.id} style={styles.item}>
              {n.text}
            </div>
          ))
        )}
      </div>

      <Link href="/" style={styles.link}>
        Retour à l’accueil
      </Link>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "Arial, sans-serif",
    color: "#333",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    padding: "40px 20px",
    textAlign: "center",
  },
  title: { fontSize: "2.2rem", marginBottom: "1rem" },
  clearBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    marginBottom: "16px",
  },
  list: {
    maxWidth: 600,
    margin: "0 auto 20px auto",
    textAlign: "left",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 12,
  },
  item: { padding: "10px 12px", borderBottom: "1px solid #eee" },
  link: {
    border: "1px solid #007bff",
    borderRadius: "5px",
    padding: "10px 20px",
    textDecoration: "none",
    color: "#007bff",
    backgroundColor: "#fff",
    display: "inline-block",
  },
};
