"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
// import { bracketMatching } from "@codemirror/matchbrackets";

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
        theme="dark"
        extensions={[
          javascript({ jsx: true }), // syntax highlighting for JS/JSX
          EditorView.lineWrapping,   // line wrapping
          autocompletion(),          // auto-complete support
          // bracketMatching(),         // highlight matching brackets
        ]}
        onChange={(value) => setCode(value)}
      />
    </div>
  );
}
