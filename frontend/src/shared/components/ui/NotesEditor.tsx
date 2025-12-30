import { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Quote, 
  FileCode, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Image as ImageIcon, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';

const Notes = () => {
  const [noteContent, setNoteContent] = useState('');
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setNoteContent(content);
    setIsSaveDisabled(content.trim() === '');
  };
  
  const handleSave = () => {
    console.log('Saving notes:', noteContent);
    // Here you would typically save to a backend or local storage
    alert('Notes saved successfully!');
  };
  
  return (
    <div className="w-full">
      {/* Warning Banner */}
      <div className="bg-[#1A1006] border border-[#FF6D00] rounded-md p-3 mb-6 flex items-center">
        <AlertCircle size={20} className="text-[#FF6D00] mr-2" />
        <span className="text-[#FF6D00] font-medium">Click 'Save' — changes aren't auto-saved</span>
      </div>
      
      {/* Rich Text Editor */}
      <div className="bg-[#0D0D0D] border border-[#2a2a2a] rounded-md overflow-hidden mb-4">
        {/* Editor Toolbar */}
        <div className="border-b border-[#2a2a2a] p-1 flex items-center flex-wrap">
          {/* Text Style Dropdown */}
          <div className="relative inline-block ml-1 mr-1">
            <select className="px-3 py-1 bg-[#0D0D0D] text-gray-400 border border-[#2a2a2a] rounded appearance-none pr-6 text-sm focus:outline-none">
              <option>Normal</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
              <option>Code Block</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>
          
          {/* Formatting Buttons */}
          <button className="p-2 text-gray-400 hover:text-white">
            <Bold size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <Italic size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <Underline size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <Quote size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <FileCode size={16} />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white">
            <ListOrdered size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <List size={16} />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white">
            <span className="font-bold text-sm">A</span>
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white">
            <AlignLeft size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <AlignCenter size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <AlignRight size={16} />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white">
            <ImageIcon size={16} />
          </button>
        </div>
        
        {/* Text Area */}
        <div className="relative">
          <textarea
            placeholder="Write your notes here..."
            className="w-full bg-transparent border-0 text-gray-300 p-4 min-h-[320px] focus:outline-none resize-none"
            value={noteContent}
            onChange={handleContentChange}
          />
          
          {/* Dot indicator */}
          {!isSaveDisabled && (
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-purple-500"></div>
          )}
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          disabled={isSaveDisabled}
          className={`px-8 py-2 rounded-md font-medium transition-colors ${
            isSaveDisabled
            ? 'bg-[#4e392c] text-gray-500 cursor-not-allowed'
            : 'bg-[#FF6D00] text-white hover:bg-[#e86400]'
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Notes;
