interface GameEndOverlayProps {
    winningTeam: number;
    teamScores: Record<string, number>;
    winReason: string;
}

const REASON_LABELS: Record<string, string> = {
    FIRST_EMPTIER_90: "reached 90 points as the first team out",
    SCORE_140: "reached 140 points",
    DOUBLE_OUT: "both players went out",
};

export default function GameEndOverlay({ winningTeam, teamScores, winReason }: GameEndOverlayProps) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200]">
            <div className="bg-white rounded-2xl px-10 py-8 text-center shadow-2xl">
                <div className="text-4xl font-extrabold mb-2">🎉 Team {winningTeam} Wins!</div>
                <div className="text-lg text-gray-600 mb-4">
                    {REASON_LABELS[winReason] ?? winReason}
                </div>
                <div className="text-xl font-semibold">
                    Final Score — Team 0: {teamScores["0"]} · Team 1: {teamScores["1"]}
                </div>
            </div>
        </div>
    );
}