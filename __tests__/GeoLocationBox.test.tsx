import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GeoLocationBox from "../app/components/geo/GeoLocationBox";

describe("GeoLocationBox", () => {
    const mockGeolocation = {
        getCurrentPosition: jest.fn(),
    };

    beforeAll(() => {
        Object.defineProperty(global.navigator, "geolocation", {
            value: mockGeolocation,
            writable: true,
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders initial button", () => {
        render(<GeoLocationBox />);
        expect(screen.getByText("Afficher ma position")).toBeInTheDocument();
    });

    it("displays map link on success", async () => {
        mockGeolocation.getCurrentPosition.mockImplementation((success) =>
            success({
                coords: {
                    latitude: 48.8566,
                    longitude: 2.3522,
                    accuracy: 10,
                },
            })
        );

        render(<GeoLocationBox />);
        const button = screen.getByText("Afficher ma position");
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("Ouvrir Google Maps")).toBeInTheDocument();
        });
    });

    it("displays error message on failure", async () => {
        mockGeolocation.getCurrentPosition.mockImplementation((_, error) =>
            error({
                code: 1, // PERMISSION_DENIED
                PERMISSION_DENIED: 1,
            })
        );

        render(<GeoLocationBox />);
        const button = screen.getByText("Afficher ma position");
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Permission de géolocalisation refusée/i)).toBeInTheDocument();
        });
    });
});
