"use client"; // <- ça indique que ce composant est un Client Component

import { useEffect } from "react";

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
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Mon Projet React</h1>
      <p>
        Bienvenue sur la page d’accueil de mon projet. Ce projet est une
        application web moderne construite avec React et TypeScript.
      </p>

      <h2>Technologies utilisées :</h2>
      <ul>
        <li>React 18</li>
        <li>TypeScript</li>
        <li>Vite / Create React App (selon ton setup)</li>
        <li>Service Worker pour PWA (optionnel)</li>
        <li>CSS / Tailwind / Styled Components (selon ton choix)</li>
      </ul>
    </div>
  );}
