import { PlayerStateDTO, TableStateDTO } from "../models/Game";

interface Props {
    tableState: TableStateDTO;
    players: PlayerStateDTO[];
}

export default function Table({ tableState, players }: Props) {
    if (tableState.cards.length === 0) {
        return <div>No cards on table</div>;
    }

    const lastPlayer = players.find(
        p => p.playerId === tableState.lastPlayedPlayerId
    );

    return (
        <div>
            <h4>
                Last played by: {lastPlayer?.playerName ?? "Unknown"}
            </h4>

            <div style={{ display: "flex", gap: "8px" }}>
                {tableState.cards.map(card => (
                    <div key={card}>
                        {card}
                    </div>
                ))}
            </div>
        </div>
    );
}