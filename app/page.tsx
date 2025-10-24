"use client";


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
    <div style={styles.container}>
      <h1 style={styles.title}>Mon Projet React...</h1>

      <p style={styles.description}>
        Bienvenue sur la page d’accueil de mon projet. Ce projet est une
        application web construite avec React et TypeScript.
      </p>

      <h2 style={styles.subtitle}>Technologies utilisées :</h2>
      <ul style={styles.list}>
        <li>⚛ React 18</li>
        <li>TypeScript</li>
        <li>Service Worker pour PWA</li>
        <li>CSS</li>
      </ul>

      <div style={styles.links}>
        <Link href="/room" style={styles.link}>
          Aller dans la Room
        </Link>
        <Link href="/gallery" style={styles.link}>
          Aller dans la Gallery
        </Link>
        <Link href="/reception" style={styles.link}>
          Aller dans la Reception
        </Link>
      </div>
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
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1.1rem",
    maxWidth: "600px",
    margin: "0 auto 2rem auto",
    lineHeight: "1.5",
  },
  subtitle: {
    fontSize: "1.5rem",
    marginTop: "2rem",
    marginBottom: "1rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "0 auto 2rem auto",
    fontSize: "1.1rem",
  },
  links: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  link: {
    border: "1px solid #007bff",
    borderRadius: "5px",
    padding: "10px 20px",
    textDecoration: "none",
    color: "#007bff",
    width: "220px",
    textAlign: "center",
    backgroundColor: "#fff",
    transition: "background 0.2s",
  },
};
