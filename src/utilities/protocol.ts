import {ClientMessage} from "../models/WebSocket";

export function joinMessage(name: string): ClientMessage {
    return { type: "join", payload: { name } };
}

export function playCardsMessage(cards: string[]): ClientMessage {
    return { type: "play_cards", payload: { cards } };
}