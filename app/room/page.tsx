"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getRooms } from "../src/services/api.js";
import { useRouter } from "next/navigation";
import Link from "next/link";


//const SOCKET_URL = "https://api.tools.gavago.fr/socketio";
const SOCKET_URL = "https://api.tools.gavago.fr";

interface ChatMessage {
  content: string;
  dateEmis: string;
  roomName: string;
  userId: string;
  categorie: "MESSAGE" | "INFO" | "NEW_IMAGE";
  serverId: string;
}

export default function RoomsPage() {
  const [socket, setSocket] = useState<any>(null);
  const [rooms, setRooms] = useState<Record<string, any>>({});
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<(ChatMessage & { pseudo?: string })[]>([]);
  const [input, setInput] = useState("");
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newRoom, setNewRoom] = useState("");
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("Déconnecté");
  const router = useRouter();

  // Connexion socket
  const connectSocket = () => {
    console.log("Connexion à :", SOCKET_URL);
    const s = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: false,
    });

    if (socket) s.disconnect();
    setSocket(s);
    setStatus("Connexion en cours...");

    s.on("connect", () => {
      console.log("✅ Connecté ! ID :", s.id);
      setConnected(true);
      setStatus("✅ Connecté");
    });

    // 🔹 Écoute des messages du serveur
    s.on("chat-msg", (msg: ChatMessage & { pseudo?: string }) => {
      setMessages((prev) => [...prev, msg]);
    });

    // 🔹 Quand on rejoint une room
    s.on("chat-joined-room", (data: { roomName: string }) => {
      console.log("🎉 Rejoint la room :", data.roomName);
      setCurrentRoom((prev) => prev ?? data.roomName);
    });

    s.on("disconnect", () => {
      console.log("🔌 Déconnecté du serveur");
      setConnected(false);
      setStatus("Déconnecté");
    });

    // 🔹 Écoute des erreurs
    s.on("error", (msg: string) => {
      alert(`Erreur du serveur: ${msg}`);
    });
  };

useEffect(() => {
  connectSocket();

  // ✅ Retourne une fonction, pas l'objet
  return () => {
    socket?.disconnect();
  };
}, []);


  // Chargement initial via API
  useEffect(() => {
    getRooms().then((res) => {
      if (res.success && res.data) setRooms(res.data);
    });

    const storedPseudo = localStorage.getItem("pseudo");
    if (storedPseudo) setPseudo(storedPseudo);
  }, []);

  const joinRoom = (roomName: string) => {
    if (!pseudo) {
      setShowPopup(true);
      return;
    }
    setCurrentRoom(roomName);
    setMessages([]);
    socket?.emit("chat-join-room", { roomName, pseudo });
  };

  const createRoom = () => {
    if (!newRoom.trim() || !socket) return;
    const roomName = newRoom.trim();
    socket.emit("chat-create-room", { roomName, pseudo });
    setNewRoom("");
  };

  const sendMessage = () => {
    if (!input.trim() || !socket || !currentRoom) return;
    socket.emit("chat-msg", { content: input, roomName: currentRoom, pseudo });
    setInput("");
  };
console.log(messages);
  return (
    <div style={styles.container}>
      {!currentRoom ? (
        <div>
          <h2 style={styles.title}>Liste des roooooms</h2>

          <div style={styles.newRoomContainer}>
            <input
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              placeholder="Nom de la nouvelle room"
              style={styles.input}
            />
            <button onClick={createRoom} style={styles.createBtn}>
              Créer
            </button>
          </div>

          <div style={styles.roomGrid}>
            {Object.keys(rooms).length === 0 ? (
              <p>Aucune room disponible.</p>
            ) : (
              Object.keys(rooms).map((r) => (
                <div key={r} onClick={() => joinRoom(r)} style={styles.roomCard}>
                  {r}
                </div>
              ))
            )}
          </div>

          {/* Bouton retour accueil */}
          <div style={{ marginTop: "2rem" }}>
        <Link
          href="/"
          style={{
            color: "#00bfff",
            textDecoration: "none",
            justifyContent: "center",
            fontSize: "1.2rem",
            border: "1px solid #00bfff",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            transition: "all 0.3s",
          }}
        >
          Retour à l’accueil
        </Link>
      </div>
        </div>
      ) : (
        <div style={styles.chatContainer}>
          <button onClick={() => setCurrentRoom(null)} style={styles.backBtn}>
            ← Retour
          </button>
          <h3 style={styles.roomTitle}>Room : {currentRoom}</h3>

          <div style={styles.messageBox}>
            {messages.length === 0 ? (
              <p>Aucun message...</p>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={styles.message}>
                  <b>{m.pseudo || m.userId || "Anonyme"}</b>: {m.content}
                </div>
              ))
            )}
          </div>

          <div style={styles.inputRow}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Écrire un message..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendBtn}>
              Envoyer
            </button>
          </div>

          {/* Bouton retour accueil */}
          <button style={styles.homeBtn} onClick={() => router.push("/")}>
            Retour à l’accueil
          </button>
        </div>
      )}

      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h3>Veuillez vous connecter</h3>
            <p>Vous devez être connecté pour rejoindre une room.</p>
            <div style={styles.popupBtns}>
              <button onClick={() => router.push("/reception")} style={styles.popupBtn}>
                Aller à la réception
              </button>
              <button onClick={() => setShowPopup(false)} style={styles.popupCancel}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { fontFamily: "Arial, sans-serif", padding: "30px", maxWidth: "700px", margin: "0 auto" },
  title: { textAlign: "center", marginBottom: "20px" },
  newRoomContainer: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "5px" },
  createBtn: {
    padding: "8px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  roomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px",
  },
  roomCard: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f8f8f8",
    cursor: "pointer",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  chatContainer: { display: "flex", flexDirection: "column", gap: "10px" },
  backBtn: { border: "none", background: "none", color: "#007bff", cursor: "pointer" },
  roomTitle: { textAlign: "center" },
  messageBox: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    height: "300px",
    overflowY: "auto",
    backgroundColor: "#fafafa",
  },
  message: { marginBottom: "5px", wordWrap: "break-word" },
  inputRow: { display: "flex", gap: "5px" },
  sendBtn: {
    padding: "8px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  homeBtn: {
    marginTop: "30px",
    width: "100%",
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  popup: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "8px",
    textAlign: "center",
    width: "300px",
  },
  popupBtns: { display: "flex", justifyContent: "space-between", marginTop: "15px" },
  popupBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  popupCancel: {
    backgroundColor: "#ccc",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
