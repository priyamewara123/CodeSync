// app/page.tsx  (server component)
// import Link from "next/link";

// export default function Home() {
//   return (
//     <main style={{ padding: 24 }}>
//       <h1>Code Sync — Demo</h1>
//       <p>
//         Open a test room: <Link href="/room/test">/room/test</Link>
//       </p>
//       <p>Open that link in two tabs to test real-time sync.</p>
//     </main>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  // Function to join/create a room
  const handleJoin = () => {
    if (roomId.trim()) {
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Code Sync 🚀</h1>

      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="px-4 py-2 rounded-lg text-black"
      />

      <button
        onClick={handleJoin}
        className="mt-4 px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Join Room
      </button>
    </div>
  );
}

