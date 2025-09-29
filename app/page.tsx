// app/page.tsx  (server component)
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Code Sync — Demo</h1>
      <p>
        Open a test room: <Link href="/room/test">/room/test</Link>
      </p>
      <p>Open that link in two tabs to test real-time sync.</p>
    </main>
  );
}
