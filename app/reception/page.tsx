"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Reception() {
  const [pseudo, setPseudo] = useState("");
  const [tempPseudo, setTempPseudo] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Marquer que le composant est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger pseudo au démarrage côté client
  useEffect(() => {
    if (!isClient) return;

    const saved = localStorage.getItem("pseudo");
    if (saved) {
      setPseudo(saved);
      setTempPseudo(saved);
    }

    const offlineChange = localStorage.getItem("pendingPseudo");
    if (offlineChange) {
      setTempPseudo(offlineChange);
    }
  }, [isClient]);

  // Synchronisation quand on redevient online
  useEffect(() => {
    if (!isClient) return;

    const syncPseudo = () => {
      const offlineChange = localStorage.getItem("pendingPseudo");
      if (offlineChange) {
        localStorage.setItem("pseudo", offlineChange);
        setPseudo(offlineChange);
        setTempPseudo(offlineChange);
        localStorage.removeItem("pendingPseudo");
        console.log("✅ Pseudo synchronisé :", offlineChange);
      }
    };

    window.addEventListener("online", syncPseudo);
    return () => window.removeEventListener("online", syncPseudo);
  }, [isClient]);

  const savePseudo = () => {
    setPseudo(tempPseudo); // Affiche immédiatement
    if (navigator.onLine) {
      localStorage.setItem("pseudo", tempPseudo);
      console.log("✅ Pseudo sauvegardé en ligne :", tempPseudo);
    } else {
      localStorage.setItem("pendingPseudo", tempPseudo);
      console.log("💾 Pseudo stocké hors-ligne :", tempPseudo);
    }
  };

  return (
    <div style={{
      backgroundColor: "#121212",
      color: "#ffffff",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Reception</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
        Bienvenue, <strong>{pseudo || "inconnu"}</strong>
      </p>

      <input
        type="text"
        value={tempPseudo}
        onChange={(e) => setTempPseudo(e.target.value)}
        placeholder="Entrez votre pseudo"
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          marginBottom: "1rem",
          borderRadius: "5px",
          border: "1px solid #00bfff",
          color: "#fff",
          backgroundColor: "#1e1e1e",
        }}
      />
      <button
        onClick={savePseudo}
        style={{
          backgroundColor: "#00bfff",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sauvegarder
      </button>

      <div style={{ marginTop: "2rem" }}>
        <Link href="/" style={{
          color: "#00bfff",
          textDecoration: "none",
          fontSize: "1.2rem",
          border: "1px solid #00bfff",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          transition: "all 0.3s",
        }}>
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
