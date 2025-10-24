"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getRooms } from "../src/services/api.js";
import { useRouter } from "next/navigation";

const SOCKET_URL = "https://api.tools.gavago.fr/socketio";

export default function RoomsPage() {
  const [socket, setSocket] = useState<any>(null);
  const [rooms, setRooms] = useState<Record<string, any>>({});
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ pseudo: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newRoom, setNewRoom] = useState("");
  const router = useRouter();

  // Connexion socket
useEffect(() => {
  const s = io(SOCKET_URL, { transports: ["websocket"] });
  setSocket(s);

  s.on("connect", () => console.log("Connecté au serveur socket"));
  s.on("disconnect", () => console.log("Déconnecté"));

  // ✅ Retourne une fonction, pas l'objet
  return () => {
    s.disconnect();
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

  return (
    <div style={styles.container}>
      {!currentRoom ? (
        <div>
          <h2 style={styles.title}>Liste des rooms</h2>

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
          <button style={styles.homeBtn} onClick={() => router.push("/")}>
            Retour à l’accueil
          </button>
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
                  <b>{m.pseudo}</b>: {m.text}
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
