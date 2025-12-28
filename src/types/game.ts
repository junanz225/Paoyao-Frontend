export interface PlayerStateDTO {
    playerId: string;
    playerName: string;
    cardCount: number;
}

export interface GameStatePayload {
    playerStates: PlayerStateDTO[];
    currentTurnPlayerId: string | null;
}

export interface DealCardsPayload {
    playerId: string; // player self id
    cards: string[];
}

export interface WebSocketMessage<T> {
    type: string;
    payload: T;
}