import { GripVertical } from 'lucide-react';

interface BlockProps {
  block: {
    id: number;
    type: string;
    content: string;
  };
}

export default function Block({ block }: BlockProps) {
  const renderBlock = () => {
    switch (block.type) {
      case 'heading1':
        return (
          <input
            type="text"
            defaultValue={block.content}
            className="text-3xl font-bold text-slate-800 bg-transparent border-none outline-none w-full focus:outline-none"
            placeholder="Heading 1"
          />
        );
      case 'heading2':
        return (
          <input
            type="text"
            defaultValue={block.content}
            className="text-2xl font-semibold text-slate-800 bg-transparent border-none outline-none w-full focus:outline-none"
            placeholder="Heading 2"
          />
        );
      case 'text':
      default:
        return (
          <textarea
            defaultValue={block.content}
            className="text-base text-slate-700 bg-transparent border-none outline-none w-full focus:outline-none resize-none"
            placeholder="Type something..."
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        );
    }
  };

  return (
    <div className="group flex items-start gap-2 py-1 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors">
      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 mt-1">
        <GripVertical className="w-4 h-4 text-slate-400" />
      </button>
      <div className="flex-1">
        {renderBlock()}
      </div>
    </div>
  );
}
