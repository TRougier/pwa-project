"use client";

import Link from "next/link";

export default function Reception() {
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
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Reception</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px", lineHeight: "1.6" }}>
        Bienvenue dans la réception ! Cette page peut servir de page d’accueil pour accueillir vos utilisateurs ou présenter des informations importantes.
      </p>

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
    </div>
  );
}
