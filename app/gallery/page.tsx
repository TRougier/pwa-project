"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "gallery_photos";

export default function Gallery() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [photos, setPhotos] = useState<string[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // Charger les photos sauvegardées
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPhotos(JSON.parse(saved));
    } catch {
      setPhotos([]);
    }
  }, []);

  // Persist immédiat (évite perte lors navigation)
  const persist = (next: string[]) => {
    setPhotos(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("LocalStorage plein ou indisponible:", e);
    }
  };

  // Démarrer / arrêter la caméra proprement
  useEffect(() => {
    const stopStream = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    if (!isCameraOn) {
      stopStream();
      return;
    }

    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Erreur accès caméra:", err));
    }

    return () => stopStream();
  }, [isCameraOn]);

  // Prendre une photo
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const imageData = canvasRef.current.toDataURL("image/png");

    const next = [...photos, imageData];
    persist(next);
  };

  // Supprimer une photo
  const deletePhoto = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    persist(next);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gallery</h1>
      <p style={styles.description}>Prenez des photos.</p>

      {/* Caméra */}
      {isCameraOn && (
        <video ref={videoRef} autoPlay playsInline style={styles.video} />
      )}

      {/* Boutons */}
      <div style={styles.actions}>
        <button onClick={takePhoto} style={styles.primaryBtn}>
          Prendre une photo
        </button>

        <button onClick={() => setIsCameraOn((prev) => !prev)} style={styles.secondaryBtn}>
          {isCameraOn ? "Arrêter la caméra" : "Relancer la caméra"}
        </button>
      </div>

      {/* Miniatures */}
      <div style={styles.thumbsRow}>
        {photos.map((photo, index) => (
          <div key={index} style={styles.thumbItem}>
            <img src={photo} alt={`photo-${index}`} style={styles.thumbImg} />
            <button onClick={() => deletePhoto(index)} style={styles.deleteBtn}>
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Canvas caché */}
      <canvas ref={canvasRef} width={640} height={480} style={{ display: "none" }} />

      {/* Retour accueil */}
      <div style={styles.backWrap}>
        <Link href="/" style={styles.backLink}>
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#f5f5f5", // ✅ gris clair comme les autres pages
    color: "#333",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1.2rem",
    maxWidth: "600px",
    lineHeight: "1.6",
  },
  video: {
    width: "640px",
    height: "480px",
    border: "2px solid #007bff",
    borderRadius: "10px",
    marginTop: "1rem",
    background: "#000",
  },
  actions: {
    marginTop: "1rem",
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryBtn: {
    padding: "0.7rem 1.5rem",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#fff",
  },
  secondaryBtn: {
    padding: "0.7rem 1.5rem",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#333",
  },
  thumbsRow: {
    marginTop: "2rem",
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    maxWidth: "90vw",
    padding: "10px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },
  thumbItem: {
    position: "relative",
  },
  thumbImg: {
    width: "120px",
    height: "90px",
    objectFit: "cover",
    border: "2px solid #007bff",
    borderRadius: "8px",
  },
  deleteBtn: {
    position: "absolute",
    top: "5px",
    right: "5px",
    backgroundColor: "#c0392b",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    fontSize: "0.8rem",
    lineHeight: "1",
  },
  backWrap: {
    marginTop: "2rem",
  },
  backLink: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "1.2rem",
    border: "1px solid #007bff",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    background: "#fff",
  },
};
