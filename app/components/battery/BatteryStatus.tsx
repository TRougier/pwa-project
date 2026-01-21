"use client";

import React, { useEffect, useMemo, useState } from "react";

type BatteryState = {
  supported: boolean;
  level?: number;
  charging?: boolean;
  chargingTime?: number;
  dischargingTime?: number;
  error?: string;
};

const styles: Record<string, React.CSSProperties> = {
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

export default function BatteryStatus() {
  const [battery, setBattery] = useState<BatteryState>({ supported: true });

  useEffect(() => {
    const setupBattery = async () => {
      try {
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

  const batteryPercent = useMemo(() => {
    return battery.supported && typeof battery.level === "number"
      ? Math.round(battery.level * 100)
      : null;
  }, [battery.supported, battery.level]);

  const formatSeconds = (secs?: number) => {
    if (secs === undefined || secs === null) return "N/A";
    if (!Number.isFinite(secs) || secs === Infinity) return "N/A";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h <= 0) return `${m} min`;
    return `${h}h ${m}min`;
  };

  return (
    <div style={styles.batteryBox}>
      <h3 style={styles.batteryTitle}>Batterie</h3>

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
  );
}
