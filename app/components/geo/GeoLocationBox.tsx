

"use client";

import React, { useMemo, useState } from "react";

type GeoState = {
  status: "idle" | "loading" | "success" | "error";
  lat?: number;
  lng?: number;
  accuracy?: number;
  error?: string;
};

export default function GeoLocationBox() {
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

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

  const googleMapsUrl = useMemo(() => {
    return geo.status === "success" ? `https://www.google.com/maps?q=${geo.lat},${geo.lng}&z=16` : null;
  }, [geo.status, geo.lat, geo.lng]);

  const googleMapsEmbedUrl = useMemo(() => {
    return geo.status === "success"
      ? `https://www.google.com/maps?q=${geo.lat},${geo.lng}&z=16&output=embed`
      : null;
  }, [geo.status, geo.lat, geo.lng]);

  return (
    <div style={styles.geoBox}>
      <h2 style={styles.subtitle}>Ma position</h2>

      <button onClick={getLocation} style={styles.geoBtn} disabled={geo.status === "loading"}>
        {geo.status === "loading" ? "Localisation..." : "Afficher ma position"}
      </button>

      {geo.status === "success" && (
        <>
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

      {geo.status === "error" && <p style={styles.geoError}> {geo.error}</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  subtitle: {
    fontSize: "1.5rem",
    marginTop: "2rem",
    marginBottom: "1rem",
  },
  geoBox: {
    maxWidth: "700px",
    margin: "3rem auto 0 auto",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    background: "#fff",
    textAlign: "center",
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
};
