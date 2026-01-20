"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW enregistré", reg))
      .catch((err) => console.error("Erreur SW:", err));
  }, []);

  return null;
}
