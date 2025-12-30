import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = ({ items, className = '' }: BreadcrumbsProps) => {
  return (
    <nav className={`flex items-center text-sm space-x-1 overflow-x-auto whitespace-nowrap py-2 ${className}`}>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight size={16} className="mx-1 text-gray-500" />}
          {index === items.length - 1 ? (
            <span className="text-gray-400">{item.label}</span>
          ) : (
            <Link 
              to={item.href} 
              className="text-gray-500 hover:text-orange-500 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;