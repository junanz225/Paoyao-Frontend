export interface PlayerStateDTO {
    playerId: string;
    playerName: string;
    cardCount: number;
}

export interface GameStatePayload {
    playerStates: PlayerStateDTO[];
    currentTurnPlayerId: string | null;
    tableState: TableStateDTO;
    tablePoints: number;
}

export interface TableStateDTO {
    lastPlayedPlayerId: string | null;
    cards: string[];
}