// wsClient.ts
import { WebSocketMessage } from "../models/WebSocket";

export function sendMessage<T>(
    ws: WebSocket,
    type: string,
    payload: T
) {
    const message: WebSocketMessage<T> = {
        type,
        payload,
    };

    ws.send(JSON.stringify(message));
}