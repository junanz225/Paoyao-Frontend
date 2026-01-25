export interface WebSocketMessage<T> {
    type: string;
    payload: T;
}

export type ClientMessage =
    | { type: "join"; payload: { name: string } }
    | { type: "play_cards"; payload: { playedCards: string[] } };