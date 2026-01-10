import { useRef } from "react";
import { joinMessage, playCardsMessage } from "../utilities/protocol";

const WS_URL = "ws://localhost:9090/ws/paoyao";

export function useGameSocket(handlers: {
    onJoined: (playerId: string) => void;
    onPlayerList: (players: any[]) => void;
    onGameStart: () => void;
    onDealCards: (cards: string[]) => void;
    onGameState: (state: any) => void;
}) {
    const wsRef = useRef<WebSocket | null>(null);

    const connect = (name: string) => {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify(joinMessage(name)));
        };

        ws.onmessage = (msg) => {
            const data = JSON.parse(msg.data);

            switch (data.type) {
                case "joined":
                    handlers.onJoined(data.payload.playerId);
                    break;
                case "player_list":
                    handlers.onPlayerList(data.payload);
                    break;
                case "game_start":
                    handlers.onGameStart();
                    break;
                case "deal_cards":
                    handlers.onDealCards(data.payload.cards);
                    break;
                case "game_state":
                    handlers.onGameState(data.payload);
                    break;
            }
        };
    };

    const playCards = (cards: string[]) => {
        wsRef.current?.send(JSON.stringify(playCardsMessage(cards)));
    };

    return { connect, playCards };
}