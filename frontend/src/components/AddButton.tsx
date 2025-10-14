import { Plus } from 'react-feather';
import { useNavigate } from 'react-router-dom';

function AddButton() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/note-editor'); // Navigate to the dashboard page
    }
  return (
    <div>
       return (
    <button 
    onClick={handleClick}
      className={`
        inline-flex items-center justify-center
        h-12 w-12
        bg-white
        rounded-full
        shadow-md hover:shadow-lg
        transition-all duration-200
        hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
        active:scale-95
        
      `}
    >
      <Plus 
        size={24} 
        className="text-black"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </button>
  );

    </div>
  )
}

export default AddButton
