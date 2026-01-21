import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VibrationButton from "../app/components/vibration/VibrationButton";

describe("VibrationButton", () => {
    it("renders correctly", () => {
        Object.defineProperty(window.navigator, "vibrate", {
            value: jest.fn(),
            writable: true,
            configurable: true,
        });
        render(<VibrationButton label="Test Vibration" />);
        expect(screen.getByText("Test Vibration")).toBeInTheDocument();
    });

    it("triggers navigator.vibrate when clicked", () => {
        // Mock navigator.vibrate
        const mockVibrate = jest.fn();
        Object.defineProperty(window.navigator, "vibrate", {
            value: mockVibrate,
            writable: true,
        });

        render(<VibrationButton />);
        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(mockVibrate).toHaveBeenCalledWith(200);
    });
});
