"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type GeoState = {
  status: "idle" | "loading" | "success" | "error";
  lat?: number;
  lng?: number;
  accuracy?: number;
  error?: string;
};

type BatteryState = {
  supported: boolean;
  level?: number; // 0..1
  charging?: boolean;
  chargingTime?: number; // seconds
  dischargingTime?: number; // seconds
  error?: string;
};

export default function Page() {
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });
  const [battery, setBattery] = useState<BatteryState>({ supported: true });

  useEffect(() => {
    // PWA Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW enregistré", reg))
        .catch((err) => console.error("Erreur SW:", err));
    }

    // Batterie
    const setupBattery = async () => {
      try {
        // API Battery pas supportée partout (notamment iOS Safari)
        const anyNav = navigator as any;
        if (!anyNav.getBattery) {
          setBattery({ supported: false });
          return;
        }

        const batt = await anyNav.getBattery();

        const update = () => {
          setBattery({
            supported: true,
            level: batt.level,
            charging: batt.charging,
            chargingTime: batt.chargingTime,
            dischargingTime: batt.dischargingTime,
          });
        };

        update();

        // listeners (mise à jour temps réel)
        batt.addEventListener("levelchange", update);
        batt.addEventListener("chargingchange", update);
        batt.addEventListener("chargingtimechange", update);
        batt.addEventListener("dischargingtimechange", update);

        return () => {
          batt.removeEventListener("levelchange", update);
          batt.removeEventListener("chargingchange", update);
          batt.removeEventListener("chargingtimechange", update);
          batt.removeEventListener("dischargingtimechange", update);
        };
      } catch (e: any) {
        setBattery({
          supported: false,
          error: e?.message || "Impossible de récupérer la batterie.",
        });
      }
    };

    let cleanup: undefined | (() => void);
    setupBattery().then((fn) => {
      cleanup = fn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const getLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeo({
        status: "error",
        error: "La géolocalisation n’est pas supportée par ce navigateur.",
      });
      return;
    }

    setGeo({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          status: "success",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        let message = "Erreur inconnue.";

        if (err.code === err.PERMISSION_DENIED) message = "Permission de géolocalisation refusée.";
        if (err.code === err.POSITION_UNAVAILABLE) message = "Position indisponible.";
        if (err.code === err.TIMEOUT) message = "Timeout lors de la récupération de la position.";

        setGeo({ status: "error", error: message });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  };

  const googleMapsUrl =
    geo.status === "success" ? `https://www.google.com/maps?q=${geo.lat},${geo.lng}&z=16` : null;

  const googleMapsEmbedUrl =
    geo.status === "success" ? `https://www.google.com/maps?q=${geo.lat},${geo.lng}&z=16&output=embed` : null;

  const batteryPercent =
    battery.supported && typeof battery.level === "number" ? Math.round(battery.level * 100) : null;

  const formatSeconds = (secs?: number) => {
    if (secs === undefined || secs === null) return "N/A";
    if (!Number.isFinite(secs) || secs === Infinity) return "N/A";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h <= 0) return `${m} min`;
    return `${h}h ${m}min`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mon Projet Reacttttttt</h1>

      <p style={styles.description}>
        Bienvenue sur la page d’accueil de mon projet. Ce projet est une application web construite avec React et
        TypeScript.
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

      {/* ✅ GEOLOCALISATION EN BAS */}
      <div style={styles.geoBox}>
        <h2 style={styles.subtitle}>📍 Ma position</h2>

        <button onClick={getLocation} style={styles.geoBtn} disabled={geo.status === "loading"}>
          {geo.status === "loading" ? "Localisation..." : "Afficher ma position"}
        </button>

        {geo.status === "success" && (
          <>
            <div style={styles.geoResult}>
              <div>
                Latitude : <b>{geo.lat?.toFixed(6)}</b>
              </div>
              <div>
                Longitude : <b>{geo.lng?.toFixed(6)}</b>
              </div>
              <div>
                Précision : <b>±{Math.round(geo.accuracy || 0)}m</b>
              </div>
            </div>

            <div style={styles.mapActions}>
              <a href={googleMapsUrl!} target="_blank" rel="noreferrer" style={styles.geoLink}>
                Ouvrir Google Maps
              </a>
            </div>

            <div style={styles.mapWrapper}>
              <iframe
                title="Ma position Google Maps"
                src={googleMapsEmbedUrl!}
                width="100%"
                height="320"
                style={{ border: 0, borderRadius: 10 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </>
        )}

        {geo.status === "error" && <p style={styles.geoError}>❌ {geo.error}</p>}

        {/* ✅ BATTERIE EN DESSOUS */}
        <div style={styles.batteryBox}>
          <h3 style={styles.batteryTitle}>🔋 Batterie</h3>

          {!battery.supported ? (
            <p style={styles.batteryText}>
              Batterie non disponible sur ce navigateur{battery.error ? ` (${battery.error})` : ""}.
            </p>
          ) : (
            <>
              <p style={styles.batteryText}>
                Niveau : <b>{batteryPercent !== null ? `${batteryPercent}%` : "N/A"}</b>{" "}
                {battery.charging ? "(en charge)" : "(sur batterie)"}
              </p>

              {/* barre */}
              <div style={styles.batteryBar}>
                <div
                  style={{
                    ...styles.batteryBarFill,
                    width: `${batteryPercent ?? 0}%`,
                  }}
                />
              </div>

              <div style={styles.batteryMeta}>
                <div>
                  Temps charge : <b>{battery.charging ? formatSeconds(battery.chargingTime) : "-"}</b>
                </div>
                <div>
                  Autonomie : <b>{!battery.charging ? formatSeconds(battery.dischargingTime) : "-"}</b>
                </div>
              </div>
            </>
          )}
        </div>
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

  // GEO
  geoBox: {
    maxWidth: "700px",
    margin: "3rem auto 0 auto",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    background: "#fff",
  },
  geoBtn: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid #007bff",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  geoResult: {
    marginTop: "12px",
    lineHeight: "1.7",
  },
  geoError: {
    marginTop: "12px",
    color: "#c0392b",
    fontWeight: 600,
  },
  geoLink: {
    display: "inline-block",
    marginTop: "12px",
    textDecoration: "none",
    color: "#007bff",
    fontWeight: 700,
  },
  mapWrapper: {
    marginTop: "14px",
    overflow: "hidden",
    borderRadius: 10,
  },
  mapActions: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
  },

  // BATTERY
  batteryBox: {
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid #eee",
    textAlign: "left",
  },
  batteryTitle: {
    margin: 0,
    fontSize: "1.2rem",
  },
  batteryText: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  batteryBar: {
    width: "100%",
    height: 12,
    borderRadius: 999,
    border: "1px solid #ddd",
    overflow: "hidden",
    background: "#f3f3f3",
  },
  batteryBarFill: {
    height: "100%",
    borderRadius: 999,
    background: "#28a745",
    transition: "width 0.2s ease",
  },
  batteryMeta: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
    fontSize: "0.95rem",
  },
};
