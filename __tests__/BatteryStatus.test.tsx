import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import BatteryStatus from "../app/components/battery/BatteryStatus";

describe("BatteryStatus", () => {
    it("renders battery level when supported", async () => {
        const mockBattery = {
            level: 0.55,
            charging: true,
            chargingTime: 0,
            dischargingTime: Infinity,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };

        Object.defineProperty(navigator, "getBattery", {
            value: jest.fn().mockResolvedValue(mockBattery),
            writable: true,
            configurable: true,
        });

        render(<BatteryStatus />);

        await waitFor(() => {
            expect(screen.getByText(/55%/)).toBeInTheDocument();
            expect(screen.getByText(/\(en charge\)/)).toBeInTheDocument();
        });
    });

    it("handles unsupported browser", async () => {
        Object.defineProperty(navigator, "getBattery", {
            value: undefined,
            writable: true,
            configurable: true,
        });

        render(<BatteryStatus />);

        await waitFor(() => {
            expect(screen.getByText(/Batterie non disponible sur ce navigateur/i)).toBeInTheDocument();
        });
    });
});
