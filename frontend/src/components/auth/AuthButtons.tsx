import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const AuthButtons = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex items-center">
      {user ? (
        <div className="flex items-center space-x-4">
          <Link 
            to="/profile" 
            className="text-blue-400 hover:text-blue-300"
          >
            {user.name}
          </Link>
          
          <button
            onClick={logout}
            className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          {/* No authentication required - user can access the app directly */}
          <span className="text-sm text-gray-400">Welcome to StudyIO</span>
        </div>
      )}
    </div>
  );
};