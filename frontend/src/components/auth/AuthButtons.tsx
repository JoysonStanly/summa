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
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          {/* No authentication required - user can access the app directly */}
          <span className="text-gray-400 text-sm">Welcome to StudyIO</span>
        </div>
      )}
    </div>
  );
};