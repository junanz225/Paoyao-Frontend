import {ClientMessage} from "../models/WebSocket";

export function joinMessage(name: string): ClientMessage {
    return { type: "join", payload: { name } };
}

export function playCardsMessage(playedCards: string[]): ClientMessage {
    return { type: "play_cards", payload: { playedCards } };
}

export function passMessage(): ClientMessage {
    return { type: "pass", payload: {} };
}