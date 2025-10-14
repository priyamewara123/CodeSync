"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";

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
          javascript({ jsx: true }), 
          EditorView.lineWrapping,  
          autocompletion(),                
        ]}
        onChange={(value) => setCode(value)}
      />
    </div>
  );
}
