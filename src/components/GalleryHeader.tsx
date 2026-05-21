import React from 'react';
import { Search, Grid, List, Layers, Plus, Heart, SlidersHorizontal, Sun, Moon } from 'lucide-react';
import { ViewLayout, FilterOptions } from '../types';

interface GalleryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  layout: ViewLayout;
  onLayoutChange: (layout: ViewLayout) => void;
  sortBy: FilterOptions['sortBy'];
  onSortChange: (sort: FilterOptions['sortBy']) => void;
  onOpenUpload: () => void;
  totalCount: number;
  favoriteCount: number;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  layout,
  onLayoutChange,
  sortBy,
  onSortChange,
  onOpenUpload,
  totalCount,
  favoriteCount,
  darkMode,
  onToggleTheme,
}) => {
  return (
    <header 
      className={`border-b sticky top-0 z-40 px-6 py-4 transition-colors duration-300 backdrop-blur-md ${
        darkMode ? 'border-neutral-800 bg-neutral-900/80 text-white' : 'border-neutral-200/80 bg-white/70 text-neutral-900'
      }`} 
      id="gallery-header"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Title area */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight flex items-center gap-2">
              <span className={darkMode ? 'text-white' : 'text-neutral-900'}>PRISM</span>
              <span className="text-neutral-400 font-light text-2xl">|</span>
              <span className={`text-sm tracking-widest uppercase font-mono px-2 py-1 rounded-md ${darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-500'}`}>Gallery</span>
            </h1>
            <p className={`text-xs mt-1 font-mono ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Displaying {totalCount} curated photographs
            </p>
          </div>
          
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Mode Toggle */}
            <button
              id="btn-toggle-theme-mobile"
              onClick={onToggleTheme}
              className={`p-2.5 rounded-full border transition-all active:scale-95 ${
                darkMode 
                  ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200' 
                  : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" /> : <Moon className="w-4 h-4 text-slate-800" />}
            </button>

            {/* Quick Upload for mobile */}
            <button
              id="btn-upload-mobile"
              onClick={onOpenUpload}
              className={`flex items-center justify-center p-2.5 rounded-full transition-all active:scale-95 ${
                darkMode ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-950' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
              title="Upload Photo"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search title, details, artist..."
              className={`w-full pl-10 pr-12 py-2 text-sm rounded-lg border focus:outline-none transition-all duration-200 ${
                darkMode 
                  ? 'bg-neutral-850 border-neutral-750 text-white placeholder-neutral-500 focus:bg-neutral-900 focus:border-neutral-100' 
                  : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-neutral-900'
              }`}
            />
            {searchQuery && (
              <button
                id="btn-clear-search"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 sm:py-0">
            {/* Sort Dropdown */}
            <div className={`relative flex items-center border rounded-lg px-2.5 py-1.5 transition-colors ${
              darkMode ? 'bg-neutral-850 border-neutral-750' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 mr-2" />
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as FilterOptions['sortBy'])}
                className={`bg-transparent text-xs font-medium focus:outline-none pr-1 cursor-pointer ${
                  darkMode ? 'text-neutral-200 bg-neutral-850' : 'text-neutral-700 bg-neutral-50'
                }`}
              >
                <option value="default">Default Sort</option>
                <option value="title-asc">Title: A to Z</option>
                <option value="title-desc">Title: Z to A</option>
                <option value="likes-desc">Popular: Most Liked</option>
              </select>
            </div>

            {/* Layout Toggles */}
            <div className={`flex items-center p-1 rounded-lg ${darkMode ? 'bg-neutral-850' : 'bg-neutral-100'}`}>
              <button
                id="btn-layout-grid"
                onClick={() => onLayoutChange('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  layout === 'grid'
                    ? (darkMode ? 'bg-neutral-700 text-white shadow-sm' : 'bg-white text-neutral-900 shadow-sm')
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
                title="Grid layout"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="btn-layout-masonry"
                onClick={() => onLayoutChange('masonry')}
                className={`p-1.5 rounded-md transition-colors ${
                  layout === 'masonry'
                    ? (darkMode ? 'bg-neutral-700 text-white shadow-sm' : 'bg-white text-neutral-900 shadow-sm')
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
                title="Masonry layout"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                id="btn-layout-list"
                onClick={() => onLayoutChange('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  layout === 'list'
                    ? (darkMode ? 'bg-neutral-700 text-white shadow-sm' : 'bg-white text-neutral-900 shadow-sm')
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
                title="List layout"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Favorites tag and Count details */}
            {favoriteCount > 0 && (
              <div 
                id="fav-status-pill"
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono font-medium ${
                  darkMode 
                    ? 'bg-red-950/40 text-red-400 border border-red-900/50' 
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{favoriteCount}</span>
              </div>
            )}

            {/* Desktop Theme Toggle */}
            <button
              id="btn-toggle-theme"
              onClick={onToggleTheme}
              className={`hidden md:flex items-center justify-center p-2 rounded-lg border transition-all cursor-pointer active:scale-95 ${
                darkMode 
                  ? 'bg-neutral-850 hover:bg-neutral-755 border-neutral-700 text-amber-400 hover:text-amber-300' 
                  : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 fill-amber-400/10" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Upload Button */}
            <button
              id="btn-upload-desktop"
              onClick={onOpenUpload}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                darkMode 
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-950 font-semibold' 
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Submit Photo</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
