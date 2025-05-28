
import React from 'react';
import { AppTheme } from '../types';
import { APP_TITLE } from '../constants';
import Button from './ui/Button';

interface HeaderProps {
  theme: AppTheme;
  onThemeToggle: () => void;
  onShowHistoryToggle: () => void;
  historyItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onShowHistoryToggle, historyItemCount }) => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-sky-600 dark:text-sky-400">{APP_TITLE}</h1>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={onShowHistoryToggle}
            title="View Prompt History"
            aria-label="View Prompt History"
          >
            <i className="fas fa-history"></i>
            {historyItemCount > 0 && (
              <span className="ml-1.5 bg-sky-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                {historyItemCount}
              </span>
            )}
          </Button>
          <Button 
            variant="ghost"
            onClick={onThemeToggle}
            title={theme === AppTheme.LIGHT ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label={theme === AppTheme.LIGHT ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === AppTheme.LIGHT ? <i className="fas fa-moon text-xl"></i> : <i className="fas fa-sun text-xl"></i>}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
