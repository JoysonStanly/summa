import { useContext } from 'react';
import { AuthContext } from '@/features/auth/stores/AuthContext';

// Separate file for the hook to avoid fast refresh issues
export const useAuth = () => useContext(AuthContext);