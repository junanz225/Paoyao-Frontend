export interface PlayerStateDTO {
    playerId: string;
    playerName: string;
    cardCount: number;
}

export interface GameStatePayload {
    playerStates: PlayerStateDTO[];
    currentTurnPlayerId: string | null;
    table: string[];
    tablePoints: number;
}