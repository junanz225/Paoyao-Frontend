import React from "react";

export default function WaitingRoom({ players }) {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Waiting Room</h1>

      {/*<p>You joined as: <strong>{selfName}</strong></p>*/}
      <p>Waiting for 4 players to join...</p>

      <h2 style={{ marginTop: 30 }}>Players:</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {players.map((p) => (
          <li key={p.playerId} style={{ margin: 8, fontSize: "20px" }}>
            {p.playerName}
          </li>
        ))}
      </ul>
    </div>
  );
}