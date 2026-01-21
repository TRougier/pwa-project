import { emitJoinRoom, emitCreateRoom, emitSendMessage } from "../app/utils/roomSocketLogic";

describe("Room Socket Logic", () => {
    let mockSocket: any;

    beforeEach(() => {
        mockSocket = {
            emit: jest.fn(),
        };
    });

    describe("emitJoinRoom", () => {
        it("should emit 'chat-join-room' with correct data when arguments are valid", () => {
            const result = emitJoinRoom(mockSocket, "General", "Toto");
            expect(result).toBe(true);
            expect(mockSocket.emit).toHaveBeenCalledWith("chat-join-room", {
                roomName: "General",
                pseudo: "Toto",
            });
        });

        it("should return false and not emit if pseudo is missing", () => {
            const result = emitJoinRoom(mockSocket, "General", null);
            expect(result).toBe(false);
            expect(mockSocket.emit).not.toHaveBeenCalled();
        });

        it("should return false if socket is null", () => {
            const result = emitJoinRoom(null, "General", "Toto");
            expect(result).toBe(false);
        });
    });

    describe("emitCreateRoom", () => {
        it("should emit 'chat-create-room' when valid", () => {
            const result = emitCreateRoom(mockSocket, "NewRoom", "Admin");
            expect(result).toBe(true);
            expect(mockSocket.emit).toHaveBeenCalledWith("chat-create-room", {
                roomName: "NewRoom",
                pseudo: "Admin",
            });
        });
    });

    describe("emitSendMessage", () => {
        it("should emit 'chat-msg' with content", () => {
            const result = emitSendMessage(mockSocket, "Hello world", "General", "Toto");
            expect(result).toBe(true);
            expect(mockSocket.emit).toHaveBeenCalledWith("chat-msg", {
                content: "Hello world",
                roomName: "General",
                pseudo: "Toto",
            });
        });

        it("should fail if content is empty", () => {
            // @ts-ignore - testing runtime behavior for empty string if typed as string
            const result = emitSendMessage(mockSocket, "", "General", "Toto");
            expect(result).toBe(false);
            expect(mockSocket.emit).not.toHaveBeenCalled();
        });
    });
});
