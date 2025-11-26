import { Menu, Share2, MoreHorizontal, Clock } from 'lucide-react';

interface ToolbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Toolbar({ onToggleSidebar, sidebarOpen }: ToolbarProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          <span>Last edited 2 minutes ago</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
