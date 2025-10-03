"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Gallery() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // Charger les photos sauvegardées
  useEffect(() => {
    const savedPhotos = localStorage.getItem("gallery_photos");
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  // Sauvegarder les photos
  useEffect(() => {
    localStorage.setItem("gallery_photos", JSON.stringify(photos));
  }, [photos]);

  // Démarrer la caméra
  useEffect(() => {
    if (isCameraOn && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Erreur accès caméra:", err));
    }
  }, [isCameraOn]);

  // Prendre une photo
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const imageData = canvasRef.current.toDataURL("image/png");
        setPhotos((prev) => [...prev, imageData]);
      }
    }
  };

  // Supprimer une photo
  const deletePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

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
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Gallery</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px", lineHeight: "1.6" }}>
        Prenez des photos 📸 — elles apparaîtront juste en dessous et resteront sauvegardées localement.
      </p>

      {/* Caméra */}
      {isCameraOn && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "640px",
            height: "480px",
            border: "2px solid #00bfff",
            borderRadius: "10px",
            marginTop: "1rem",
          }}
        />
      )}

      {/* Boutons */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={takePhoto}
          style={{
            padding: "0.7rem 1.5rem",
            backgroundColor: "#00bfff",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
            color: "#121212",
            marginRight: "1rem",
          }}
        >
          Prendre une photo
        </button>
        <button
          onClick={() => setIsCameraOn((prev) => !prev)}
          style={{
            padding: "0.7rem 1.5rem",
            backgroundColor: "#444",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          {isCameraOn ? "Arrêter la caméra" : "Relancer la caméra"}
        </button>
      </div>

      {/* Miniatures en ligne */}
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          maxWidth: "90vw",
          padding: "10px",
        }}
      >
        {photos.map((photo, index) => (
          <div key={index} style={{ position: "relative" }}>
            <img
              src={photo}
              alt={`photo-${index}`}
              style={{
                width: "120px",
                height: "90px",
                objectFit: "cover",
                border: "2px solid #00bfff",
                borderRadius: "8px",
              }}
            />
            <button
              onClick={() => deletePhoto(index)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
                fontSize: "0.8rem",
                lineHeight: "1",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Canvas caché */}
      <canvas ref={canvasRef} width={640} height={480} style={{ display: "none" }} />

      {/* Retour accueil */}
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
