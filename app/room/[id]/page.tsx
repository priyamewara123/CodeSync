"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Editor from "../../component/Editor";
export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;

  const [code, setCode] = useState("// Start coding here...");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketClient = io("http://localhost:4000");
    setSocket(socketClient);

    socketClient.on("connect", () => {
      console.log("Connected to Socket.IO server:", socketClient.id);
      socketClient.emit("joinRoom", roomId);
    });

    // Listen for code updates from other clients
    socketClient.on("receiveCode", (newCode: string) => {
      setCode(newCode);
    });

    return () => {
      socketClient.disconnect();
    };
  }, [roomId]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (socket) {
      socket.emit("codeChange", { roomId, code: value });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">
        Room ID: <span className="text-blue-400">{roomId}</span>
      </h1>

      <Editor code={code} setCode={handleCodeChange} />
    </div>


  );
}


