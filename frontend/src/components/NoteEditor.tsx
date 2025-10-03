import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Code, Heading1, Heading2, Heading3 } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from "../../config"

interface EditorProps {
  initialTitle?: string;
  initialContent?: string;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
}

const TextEditor: React.FC<EditorProps> = ({
  initialTitle = '',
  initialContent = '',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [showToolbar, setShowToolbar] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [title]);

  useEffect(() => {
    if (!title && !content) return;

    setSavingStatus('saving');
    const timeout = setTimeout(async () => {
      const token = localStorage.getItem('token');
      try {
        if (!noteId) {
          const res = await axios.post(`${BACKEND_URL}/api/v1/notes/createnotes`, { title, content },{
            headers:{
              Authorization: `Bearer ${token}`
            }
          });
          console.log(res.data)
          const noteId = res.data.note.id;
          setNoteId(noteId); // API should return created note id
        } else {
          // Update note
          await axios.put(`${BACKEND_URL}/ap/v1/notes/editnote/${noteId}`, { title, content },{
            headers:{
              Authorization: `Bearer ${token}`
            }
          });
        }
        setSavingStatus('saved');
        setTimeout(() => setSavingStatus('idle'))
      } catch (err) {
        console.error("Error saving note", err);
      }
    }, 1000)
    return () => clearTimeout(timeout);
  }, [title, content])

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTitle(e.target.value)
  };

  const handleContentInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML);
  };

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
        <div className="space-y-6">
          {/* Title */}
          <textarea
            ref={titleRef}
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full bg-transparent text-5xl font-bold text-white placeholder-gray-600 border-none outline-none resize-none overflow-hidden"
            rows={1}
            style={{ lineHeight: '1.2' }}
          />

          {/* Toolbar */}
          <div
            className={`flex items-center gap-1 py-2 border-b border-gray-800 transition-opacity duration-200 ${showToolbar ? 'opacity-100' : 'opacity-0'
              }`}
          >
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
            className="w-full min-h-[400px] bg-transparent text-lg text-gray-300 outline-none prose prose-invert max-w-none
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-4
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2
              [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:my-3
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-3 [&_ul]:text-gray-300
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-3 [&_ol]:text-gray-300
              [&_li]:my-1 [&_li]:text-gray-300
              [&_blockquote]:border-l-4 [&_blockquote]:border-gray-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-400 [&_blockquote]:my-4
              [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:rounded [&_pre]:my-4 [&_pre]:text-sm [&_pre]:font-mono [&_pre]:text-gray-300
              [&_code]:bg-gray-900 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-gray-300
              empty:before:content-[attr(data-placeholder)] empty:before:text-gray-600"
            data-placeholder="Start writing..."
            suppressContentEditableWarning
          />
        </div>
      </div>
    </div>
  );
};
export default function Editor() {
  return (
    <TextEditor
      initialTitle=""
      initialContent=""
      onTitleChange={(title) => console.log('Title:', title)}
      onContentChange={(content) => console.log('Content:', content)}
    />
  );
}

