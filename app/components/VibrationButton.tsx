"use client";

import React, { useState } from "react";

type Props = {
  label?: string;
  pattern?: number | number[];
};

export default function VibrationButton({ label = "📳 Vibrer", pattern = 200 }: Props) {
  const [supported] = useState(() => "vibrate" in navigator);

  const vibrate = () => {
    if (!("vibrate" in navigator)) return;

    // pattern peut être: 200 ou [100, 50, 100]
    navigator.vibrate(pattern);
  };

  return (
    <button onClick={vibrate} disabled={!supported} style={styles.btn}>
      {supported ? label : "Vibration non supportée"}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  btn: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "1px solid #007bff",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
