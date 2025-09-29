"use client";
import { use } from "react";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

// load @monaco-editor/react only on client (no SSR)
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<any | null>(null);
  const bindingRef = useRef<any | null>(null);

  useEffect(() => {
    // create a Y.Doc and provider when component mounts
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    const wsUrl = process.env.NEXT_PUBLIC_Y_WS_URL ?? "ws://localhost:1234";
    const provider = new WebsocketProvider(wsUrl, id, ydoc);
    providerRef.current = provider;
  
    // set a tiny local presence (name + color) for demo
    provider.awareness.setLocalStateField("user", {
      name: "User-" + Math.floor(Math.random() * 10000),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });

    return () => {
      // cleanup on unmount
      try {
        bindingRef.current?.destroy?.();
      } catch (e) {}
      provider.destroy();
      ydoc.destroy();
    };
  }, [id]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={`// Welcome to Code Sync!\n// Open this URL in another tab to test.`}
        onMount={async(editor, monaco) => {
          const { MonacoBinding } = await import("y-monaco");
          // when Monaco is ready, wire it to Yjs
          const ydoc = ydocRef.current;
          const provider = providerRef.current;
          if (!ydoc || !provider) return;

          const yText = ydoc.getText("codemirror"); // shared text
             const model = editor.getModel();
          if (!model) return;
          const binding = new MonacoBinding(
            yText,
            model,
            new Set([editor]),
            provider.awareness
          );
          bindingRef.current = binding;
        }}
      />
    </div>
  );
}
