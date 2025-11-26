import { useState } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import Block from './Block';

interface EditorProps {
  currentPage: string;
}

export default function Editor({ currentPage }: EditorProps) {
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blocks] = useState([
    { id: 1, type: 'heading1', content: 'Welcome to FlowSpace' },
    { id: 2, type: 'text', content: 'A beautiful and intuitive space for your thoughts, ideas, and projects.' },
    { id: 3, type: 'heading2', content: 'Getting Started' },
    { id: 4, type: 'text', content: 'Click anywhere to start editing, or use the + button to add new blocks.' },
  ]);

  const blockTypes = [
    { icon: Type, label: 'Text', type: 'text' },
    { icon: Heading1, label: 'Heading 1', type: 'heading1' },
    { icon: Heading2, label: 'Heading 2', type: 'heading2' },
    { icon: List, label: 'Bullet List', type: 'bullet' },
    { icon: ListOrdered, label: 'Numbered List', type: 'numbered' },
    { icon: CheckSquare, label: 'Todo List', type: 'todo' },
    { icon: Quote, label: 'Quote', type: 'quote' },
    { icon: Code, label: 'Code', type: 'code' },
    { icon: ImageIcon, label: 'Image', type: 'image' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="mb-8">
        <input
          type="text"
          defaultValue={currentPage}
          className="text-4xl font-bold text-slate-800 bg-transparent border-none outline-none w-full placeholder-slate-300 mb-2"
          placeholder="Untitled"
        />
        <p className="text-slate-500 text-sm">Start writing or press '/' for commands</p>
      </div>

      <div className="space-y-2">
        {blocks.map((block) => (
          <Block key={block.id} block={block} />
        ))}
      </div>

      <div className="relative mt-4">
        <button
          onClick={() => setShowBlockMenu(!showBlockMenu)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors group"
        >
          <div className="p-1 rounded group-hover:bg-slate-100 transition-colors">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-sm">Click to add a block</span>
        </button>

        {showBlockMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 w-72 z-20">
            <div className="grid grid-cols-1 gap-1">
              {blockTypes.map((blockType) => {
                const Icon = blockType.icon;
                return (
                  <button
                    key={blockType.type}
                    onClick={() => setShowBlockMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{blockType.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
