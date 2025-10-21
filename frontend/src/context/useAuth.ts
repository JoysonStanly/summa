import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Separate file for the hook to avoid fast refresh issues
export const useAuth = () => useContext(AuthContext);