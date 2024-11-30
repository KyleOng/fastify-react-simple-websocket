import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function App() {
  const [messageHistory, setMessageHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    isConnected ? "ws://127.0.0.1:3000/web-socket" : null, // Dynamically toggle connection
    {
      shouldReconnect: (closeEvent) => false, // Prevent automatic reconnection
    }
  );

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const toggleConnection = () => {
    setIsConnected((prev) => !prev);
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <span>The WebSocket is currently {connectionStatus} </span>
      <br/>
      <button onClick={toggleConnection}>
        {isConnected ? "Close Connection" : "Reopen Connection"}
      </button>
      <br />
      <span>Last message: {lastMessage ? lastMessage.data : null}</span>
      <ul>
        {messageHistory.map((message, idx) => (
          <li key={idx}>{message ? message.data : null}</li>
        ))}
      </ul>
    </div>
  );
}
