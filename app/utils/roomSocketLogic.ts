
//test unitaire 

import { Socket } from "socket.io-client";




export function emitJoinRoom(socket: Socket | any, roomName: string, pseudo: string | null): boolean {
    if (!socket || !roomName || !pseudo) {
        console.warn("emitJoinRoom: Arguments invalides", { socket: !!socket, roomName, pseudo });
        return false;
    }
    socket.emit("chat-join-room", { roomName, pseudo });
    return true;
}


export function emitCreateRoom(socket: Socket | any, roomName: string, pseudo: string | null): boolean {
    if (!socket || !roomName || !pseudo) {
        console.warn("emitCreateRoom: Arguments invalides", { socket: !!socket, roomName, pseudo });
        return false;
    }
    socket.emit("chat-create-room", { roomName, pseudo });
    return true;
}


export function emitSendMessage(socket: Socket | any, content: string, roomName: string, pseudo: string | null): boolean {
    if (!socket || !content || !roomName || !pseudo) {
        console.warn("emitSendMessage: Arguments invalides", { socket: !!socket, content, roomName, pseudo });
        return false;
    }
    socket.emit("chat-msg", { content, roomName, pseudo });
    return true;
}
