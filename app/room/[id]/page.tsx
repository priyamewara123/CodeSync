"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Editor from "../../component/Editor";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;

  const [code, setCode] = useState("// Start coding here...");

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">
        Room ID: <span className="text-blue-400">{roomId}</span>
      </h1>

      {/* CodeMirror Editor */}
      <Editor code={code} setCode={setCode} />

      <button
        className="mt-4 px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600"
        onClick={() => alert(`Code in Room ${roomId}:\n\n${code}`)}
      >
        Save Code
      </button>
    </div>
  );
}
