import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import Editor from '@monaco-editor/react'
import type { Monaco, OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useProblemStore } from '@features/problems/stores/problemStore'

interface CodeEditorProps {
  problemId: string
  language: string
  defaultCode: string
  onChange?: (value: string | undefined) => void
  readOnly?: boolean
}

export interface CodeEditorHandle {
  formatCode: () => void;
}

const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(({
  problemId,
  language,
  defaultCode,
  onChange,
  readOnly = false
}: CodeEditorProps, ref) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

  const [code, setCode] = useState(defaultCode)
  const { editorConfig } = useProblemStore()

  // Custom formatter for proper indentation
  const formatCode = (code: string, lang: string): string => {
    const lines = code.split('\n');
    const formatted: string[] = [];
    let indentLevel = 0;
    const indentSize = 2; // 2 spaces per indent

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      if (!line) {
        formatted.push('');
        continue;
      }

      // Decrease indent for closing braces/brackets
      if (line.startsWith('}') || line.startsWith(']') || line.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add proper indentation
      const indent = ' '.repeat(indentLevel * indentSize);
      formatted.push(indent + line);

      // Increase indent after opening braces/brackets
      if (line.endsWith('{') || line.endsWith('[') || line.endsWith('(')) {
        indentLevel++;
      }

      // Handle lines that both close and open (e.g., "} else {")
      const openCount = (line.match(/[{[(]/g) || []).length;
      const closeCount = (line.match(/[}\])]/g) || []).length;
      indentLevel = Math.max(0, indentLevel + openCount - closeCount);
    }

    return formatted.join('\n');
  };

  // Expose format method to parent
  useImperativeHandle(ref, () => ({
    formatCode: () => {
      console.log('Format button clicked');
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          const currentCode = model.getValue();
          const formattedCode = formatCode(currentCode, language);
          
          // Apply the formatted code
          model.setValue(formattedCode);
          
          // Update the state
          setCode(formattedCode);
          updateEditorContent(problemId, formattedCode);
          if (onChange) onChange(formattedCode);
        }
      }
    }
  }));

  // Simulated Zustand logic
  const updateEditorContent = (id: string, content: string) => {
    console.log(`Updating content for problem ${id}:`, content)
  }

  useEffect(() => {
    updateEditorContent(problemId, code)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId])
  
  // Update editor font size when config changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: editorConfig.fontSize });
    }
  }, [editorConfig.fontSize]);

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
          fontSize: editorConfig.fontSize,
          lineNumbers: 'on',
          folding: true,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: true,
          formatOnPaste: true,
          formatOnType: false,
          autoIndent: 'full',
          readOnly,
          padding: { top: 10 },
          renderLineHighlight: 'gutter',
          smoothScrolling: true,
        }}
      />
    </div>
  )
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor
