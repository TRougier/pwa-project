"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function LoginPage() {
  const [pseudo, setPseudo] = useState("");
  const [connectedUser, setConnectedUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedPseudo = localStorage.getItem("pseudo");
    if (storedPseudo) {
      setConnectedUser(storedPseudo);
    }
  }, []);

  const handleLogin = () => {
    if (!pseudo.trim()) return;
    localStorage.setItem("pseudo", pseudo);
    setConnectedUser(pseudo);
    setPseudo("");
    router.push("/room");
  };

  const handleLogout = () => {
    localStorage.removeItem("pseudo");
    setConnectedUser(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {connectedUser ? (
          <>
            <h2 style={styles.title}>Bienvenue, {connectedUser}!</h2>
            <p style={styles.subtitle}>Vous êtes connecté</p>
            <button onClick={() => router.push("/room")} style={{ ...styles.button, marginBottom: "10px" }}>
              Aller au chat
            </button>
            <button onClick={handleLogout} style={{ ...styles.button, backgroundColor: "#dc3545", marginBottom: "15px" }}>
              Se déconnecter
            </button>
            <div style={{ marginTop: "2rem" }}>
        <Link
          href="/"
          style={{
            color: "#00bfff",
            textDecoration: "none",
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
          </>
        ) : (
          <>
            <h2 style={styles.title}>Connexion</h2>
            <input
              type="text"
              placeholder="Entrez votre pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={styles.input}
            />
            <button onClick={handleLogin} style={{ ...styles.button, marginBottom: "15px" }}>
              Entrer
            </button>
             <div style={{ marginTop: "2rem" }}>
        <Link
          href="/"
          style={{
            color: "#00bfff",
            textDecoration: "none",
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
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  subtitle: {
    marginBottom: "20px",
    color: "#666",
    fontSize: "0.95rem",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "200px",
    marginBottom: "15px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
