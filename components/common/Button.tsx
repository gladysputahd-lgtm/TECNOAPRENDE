
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'normal' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'normal',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-bold rounded-lg transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-brand-primary hover:bg-brand-secondary text-white focus:ring-brand-secondary',
    secondary: 'bg-brand-accent hover:opacity-90 text-white focus:ring-brand-accent',
    ghost: 'bg-transparent shadow-none hover:bg-brand-primary/10 dark:hover:bg-brand-secondary/20 text-brand-dark dark:text-gray-200 focus:ring-brand-primary/50',
  };

  const sizeClasses = {
    normal: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
