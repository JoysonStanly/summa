import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from "@/features/auth/stores/AuthContext";

const UnauthorizedPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <div>
          <h2 className="text-3xl font-bold text-red-500">Access Denied</h2>
          <div className="mt-6 text-xl text-white">
            You don't have permission to access this resource.
          </div>
          
          {user && (
            <div className="mt-4 text-gray-300">
              <p>You are logged in as: <span className="font-medium">{user.name}</span></p>
              <p>Role: <span className="font-medium">{user.role}</span></p>
            </div>
          )}
          
          <div className="mt-8 space-y-4">
            <Link 
              to="/" 
              className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Home Page
            </Link>
            
            <Link 
              to={`/profile/${user?.name || 'User'}`}
              className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;