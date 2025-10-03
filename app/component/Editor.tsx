"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

type EditorProps = {
  code: string;
  setCode: (value: string) => void;
};

export default function Editor({ code, setCode }: EditorProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <CodeMirror
        value={code}
        height="500px"
        extensions={[javascript({ jsx: true })]} // enable JS/JSX highlighting
        theme="dark"
        onChange={(value) => setCode(value)} // updates state when typing
      />
    </div>
  );
}
