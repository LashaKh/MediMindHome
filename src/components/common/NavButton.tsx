import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface NavButtonProps {
  to: string;
  icon: LucideIcon;
  label: string;
  variant?: 'default' | 'primary';
}

export const NavButton: React.FC<NavButtonProps> = ({
  to,
  icon: Icon,
  label,
  variant = 'default'
}) => {
  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium',
        variant === 'primary' 
          ? 'bg-primary text-white hover:bg-primary/90' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};