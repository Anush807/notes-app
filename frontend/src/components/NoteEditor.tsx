import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../../config";

// Toolbar imports remain the same
import { Bold, Italic, Underline, List, ListOrdered, Quote, Code, Heading1, Heading2, Heading3 } from 'lucide-react';

interface EditorProps {
  initialTitle?: string;
  initialContent?: string;
}

const TextEditor: React.FC<EditorProps> = ({
  initialTitle = '',
  initialContent = '',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [suggestion, setSuggestion] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const autocompleteTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Adjust textarea height
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [title]);

  // Auto-save notes
  useEffect(() => {
    if (!title && !content) return;
    setSavingStatus('saving');

    const timeout = setTimeout(async () => {
      const token = localStorage.getItem('token');
      try {
        if (!noteId) {
          const res = await axios.post(`${BACKEND_URL}/api/v1/notes/createnotes`, { title, content },{
            headers:{ Authorization: `Bearer ${token}` }
          });
          setNoteId(res.data.note.id);
        } else {
          await axios.put(`${BACKEND_URL}/api/v1/notes/editnote/${noteId}`, { title, content },{
            headers:{ Authorization: `Bearer ${token}` }
          });
        }
        setSavingStatus('saved');
        setTimeout(() => setSavingStatus('idle'), 1000);
      } catch (err) {
        console.error("Error saving note", err);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, content]);

  // --- GPT-J Autocomplete ---
  const handleContentInput = (e: React.FormEvent<HTMLDivElement>) => {
    const currentContent = e.currentTarget.innerText;
    setContent(currentContent);

    if (autocompleteTimeout.current) clearTimeout(autocompleteTimeout.current);

    autocompleteTimeout.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token'); // if required for your backend
        const res = await axios.post(`${BACKEND_URL}/ai/autocomplete`, { prompt: currentContent }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuggestion(res.data.completion || '');
      } catch (err) {
        console.error("Autocomplete error", err);
      }
    }, 500); // debounce 500ms
  };

  // Apply suggested text on pressing Tab
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setContent(prev => prev + suggestion.replace(content, ''));
      if (contentRef.current) contentRef.current.innerText = content + suggestion.replace(content, '');
      setSuggestion('');
    }
  };

  // --- Formatting toolbar ---
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const toolbarButtons = [
    { icon: Heading1, command: 'formatBlock', value: '<h1>', label: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: '<h2>', label: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: '<h3>', label: 'Heading 3' },
    { icon: Bold, command: 'bold', label: 'Bold' },
    { icon: Italic, command: 'italic', label: 'Italic' },
    { icon: Underline, command: 'underline', label: 'Underline' },
    { icon: List, command: 'insertUnorderedList', label: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: '<blockquote>', label: 'Quote' },
    { icon: Code, command: 'formatBlock', value: '<pre>', label: 'Code' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Title */}
        <textarea
          ref={titleRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full bg-transparent text-5xl font-bold text-white placeholder-gray-600 border-none outline-none resize-none overflow-hidden"
          rows={1}
          style={{ lineHeight: '1.2' }}
        />

        {/* Toolbar */}
        <div className={`flex items-center gap-1 py-2 border-b border-gray-800 transition-opacity duration-200 ${showToolbar ? 'opacity-100' : 'opacity-0'}`}>
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => applyFormat(button.command, button.value)}
              className="p-2 rounded hover:bg-gray-900 transition-colors text-gray-400 hover:text-white"
              title={button.label}
              type="button"
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Content Editor */}
        <div
          ref={contentRef}
          contentEditable
          onInput={handleContentInput}
          onFocus={() => setShowToolbar(true)}
          onBlur={() => setShowToolbar(false)}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[400px] bg-transparent text-lg text-gray-300 outline-none prose prose-invert max-w-none"
          data-placeholder="Start writing..."
          suppressContentEditableWarning
        />
        {/* Autocomplete suggestion */}
        {suggestion && <div className="text-gray-500 mt-1">Suggestion: {suggestion}</div>}
      </div>
    </div>
  );
};

export default TextEditor;
