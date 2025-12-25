import React from 'react';

type Role = 'student' | 'instructor' | 'admin';

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const getBadgeColors = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'instructor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student':
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <span 
      className={`px-2 py-1 text-xs font-semibold rounded-full border ${getBadgeColors(role)} ${className}`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};