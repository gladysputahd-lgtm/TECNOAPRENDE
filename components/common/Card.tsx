import React from 'react';

// FIX: Update CardProps to extend React.HTMLAttributes<HTMLDivElement> and pass props to the underlying div.
// This allows event handlers like `onClick` to be passed to the Card component.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 w-full transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
