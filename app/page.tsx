"use client"; // <- ça indique que ce composant est un Client Component

import { useEffect } from "react";
import Link from "next/link";


export default function Page() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW enregistré", reg))
        .catch((err) => console.error("Erreur SW:", err));
    }
  }, []);

  

  return (
    <div
      style={{
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
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Mon Projet React
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px", lineHeight: "1.6" }}>
        Bienvenue sur la page d’accueil de mon projet. Ce projet est une
        application web construite avec React et TypeScript.
      </p>

      <h2 style={{ fontSize: "2rem", marginTop: "2rem" }}>
        Technologies utilisées :
      </h2>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
        <li style={{ marginBottom: "0.5rem" }}>⚛ React 18</li>
        <li style={{ marginBottom: "0.5rem" }}>TypeScript</li>
        <li style={{ marginBottom: "0.5rem" }}>Service Worker pour PWA</li>
        <li style={{ marginBottom: "0.5rem" }}>CSS </li>
      </ul>

      <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
  <Link
    href="/room"
    style={{
      color: "#00bfff",
      textDecoration: "underline",
      fontSize: "1.2rem",
    }}
  >
    Aller dans la Room
  </Link>
  <Link
    href="/gallery"
    style={{
      color: "#00bfff",
      textDecoration: "underline",
      fontSize: "1.2rem",
    }}
  >
    Aller dans la Gallery
  </Link>
  <Link
    href="/reception"
    style={{
      color: "#00bfff",
      textDecoration: "underline",
      fontSize: "1.2rem",
    }}
  >
    Aller dans la Reception
  </Link>
</div>


    </div>
  );
}

  
