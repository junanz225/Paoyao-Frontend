export function arrangeTable(players: { playerId: string; playerName: string }[], selfId: string) {
    if (!players || players.length === 0) return {};

    // find self index
    const selfIndex = players.findIndex((p) => p.playerId === selfId);

    if (selfIndex === -1) return {};

    // rotate array so self is always index 0
    const rotated = [
        players[selfIndex],
        players[(selfIndex + 1) % 4],
        players[(selfIndex + 2) % 4],
        players[(selfIndex + 3) % 4],
    ];

    return {
        bottom: rotated[0],
        right: rotated[1],
        top: rotated[2],
        left: rotated[3],
    };
}