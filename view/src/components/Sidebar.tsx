import { FileText, Plus, Search, Settings, Trash2, Home, Star, Clock } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageSelect: (page: string) => void;
}

export default function Sidebar({ isOpen, currentPage, onPageSelect }: SidebarProps) {
  const [pages] = useState([
    { id: 1, title: 'Getting Started', icon: Home },
    { id: 2, title: 'Personal Notes', icon: FileText },
    { id: 3, title: 'Work Projects', icon: Star },
    { id: 4, title: 'Meeting Notes', icon: Clock },
  ]);

  if (!isOpen) return null;

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            FlowSpace
          </h1>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => onPageSelect(page.title)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                  currentPage === page.title
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium flex-1 text-left">{page.title}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-3 h-3 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-500 mt-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Page</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors">
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">Trash</span>
        </button>
      </div>
    </aside>
  );
}
