import { useState } from "react";
import { Bold, Italic, Code, List, Save, FileText } from "lucide-react";

interface NotesEditorProps {
  topicId: string;
  initialNotes?: string;
}

const NotesEditor = ({ topicId, initialNotes = "" }: NotesEditorProps) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 500));
    setLastSaved(new Date());
    setIsSaving(false);
    
    // In a real app, you'd save to localStorage or send to backend
    localStorage.setItem(`notes-${topicId}`, notes);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  const insertFormat = (format: string) => {
    const textarea = document.getElementById('notes-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = notes.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText || 'code'}\``;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'list item'}`;
        break;
      default:
        return;
    }

    const newNotes = notes.substring(0, start) + formattedText + notes.substring(end);
    setNotes(newNotes);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Notes</h3>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-gray-400">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-800 rounded-lg">
        <button
          onClick={() => insertFormat('bold')}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormat('italic')}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormat('code')}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertFormat('list')}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="List"
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Notes Textarea */}
      <div className="space-y-2">
        <textarea
          id="notes-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Take notes about this topic... (Ctrl+S to save)"
          className="w-full h-64 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-orange-500"
        />
        <p className="text-xs text-gray-400">
          Press Ctrl+S to save your notes. Use **bold**, *italic*, `code`, or - lists for formatting.
        </p>
      </div>
    </div>
  );
};

export default NotesEditor;
