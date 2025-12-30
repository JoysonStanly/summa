import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import type { Monaco, OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

interface CodeEditorProps {
  problemId: string
  language: string
  defaultCode: string
  onChange?: (value: string | undefined) => void
  readOnly?: boolean
}

const CodeEditor = ({
  problemId,
  language,
  defaultCode,
  onChange,
  readOnly = false
}: CodeEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

  const [code, setCode] = useState(defaultCode)

  // Simulated Zustand logic
  const updateEditorContent = (id: string, content: string) => {
    console.log(`Updating content for problem ${id}:`, content)
  }

  useEffect(() => {
    updateEditorContent(problemId, code)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId])

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    updateEditorContent(problemId, newCode)
    if (onChange) onChange(value)
  }

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Ctrl+S to save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log('Save triggered')
    })

    // Alt+F to format
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })
  }

  return (
    <div className="flex flex-col w-full h-full min-h-0 bg-[#0e0e0e] border-t border-[#1f1f1f]">
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={defaultCode}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          folding: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          readOnly,
          padding: { top: 10 },
          renderLineHighlight: 'gutter',
          smoothScrolling: true,
        }}
      />
    </div>
  )
}

export default CodeEditor
