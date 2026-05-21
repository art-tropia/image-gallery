import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ImageOff, FolderOpen, Heart, SlidersHorizontal, Sparkles } from 'lucide-react';

import { ImageItem, Category, ViewLayout, FilterOptions } from './types';
import { INITIAL_IMAGES } from './data';

import { GalleryHeader } from './components/GalleryHeader';
import { CategoryFilters } from './components/CategoryFilters';
import { ImageCard } from './components/ImageCard';
import { LightboxModal } from './components/LightboxModal';
import { ImageUploadModal } from './components/ImageUploadModal';

export default function App() {
  // --- STATE ---
  const [images, setImages] = useState<ImageItem[]>([]);
  const [likedImageIds, setLikedImageIds] = useState<string[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('default');
  const [layout, setLayout] = useState<ViewLayout>('grid');
  
  const [lightboxImage, setLightboxImage] = useState<ImageItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Sync dark mode setting - default to light, persist in localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('prism_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('prism_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('prism_theme', 'light');
    }
  }, [darkMode]);

  const handleToggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // --- LOCAL PERSISTENCE LOADS ---
  useEffect(() => {
    // 1. Load user uploads
    const storedUserImages = localStorage.getItem('prism_user_uploads');
    let loadedImages = [...INITIAL_IMAGES];
    if (storedUserImages) {
      try {
        const parsed = JSON.parse(storedUserImages) as ImageItem[];
        // Add user uploads to the beginning
        loadedImages = [...parsed, ...INITIAL_IMAGES];
      } catch (e) {
        console.error('Error loading stored user images:', e);
      }
    }
    setImages(loadedImages);

    // 2. Load likes
    const storedLikes = localStorage.getItem('prism_user_likes');
    if (storedLikes) {
      try {
        setLikedImageIds(JSON.parse(storedLikes) as string[]);
      } catch (e) {
        console.error('Error loading stored likes:', e);
      }
    }
  }, []);

  // --- MUTATIONS ---
  const handleLikeToggle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Avoid triggering lightbox close/click
    
    let updatedLikes: string[];
    setLikedImageIds((prev) => {
      if (prev.includes(id)) {
        updatedLikes = prev.filter((item) => item !== id);
      } else {
        updatedLikes = [...prev, id];
      }
      localStorage.setItem('prism_user_likes', JSON.stringify(updatedLikes));
      return updatedLikes;
    });
  };

  const handleAddImage = (newImage: ImageItem) => {
    // Save to beginning of state
    const updated = [newImage, ...images];
    setImages(updated);

    // Persist user-added records in localStorage
    const onlyUserUploaded = updated.filter((img) => img.isUserAdded === true);
    localStorage.setItem('prism_user_uploads', JSON.stringify(onlyUserUploaded));
  };

  // --- FILTRATION & SORTING ---
  const filteredAndSortedImages = (() => {
    let result = [...images];

    // A. Category Tab filtering
    if (selectedCategory === 'Favorites') {
      result = result.filter((img) => likedImageIds.includes(img.id));
    } else if (selectedCategory !== 'All') {
      result = result.filter((img) => img.category === selectedCategory);
    }

    // B. Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (img) =>
          img.title.toLowerCase().includes(query) ||
          img.photographer.toLowerCase().includes(query) ||
          img.description.toLowerCase().includes(query) ||
          (img.location && img.location.toLowerCase().includes(query)) ||
          img.category.toLowerCase().includes(query)
      );
    }

    // C. Sorting
    if (sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'likes-desc') {
      result.sort((a, b) => {
        const likesA = a.likes + (likedImageIds.includes(a.id) ? 1 : 0);
        const likesB = b.likes + (likedImageIds.includes(b.id) ? 1 : 0);
        return likesB - likesA;
      });
    }

    return result;
  })();

  // --- LIGHTBOX CAROUSEL STATE NAVIGATION ---
  const handleNextImage = () => {
    if (!lightboxImage || filteredAndSortedImages.length <= 1) return;
    const currentIndex = filteredAndSortedImages.findIndex((img) => img.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % filteredAndSortedImages.length;
    setLightboxImage(filteredAndSortedImages[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!lightboxImage || filteredAndSortedImages.length <= 1) return;
    const currentIndex = filteredAndSortedImages.findIndex((img) => img.id === lightboxImage.id);
    const prevIndex = (currentIndex - 1 + filteredAndSortedImages.length) % filteredAndSortedImages.length;
    setLightboxImage(filteredAndSortedImages[prevIndex]);
  };

  const isSelectedLiked = lightboxImage ? likedImageIds.includes(lightboxImage.id) : false;

  return (
    <div 
      className={`min-h-screen flex flex-col transition-colors duration-350 ${
        darkMode 
          ? 'bg-neutral-950 text-neutral-100 selection:bg-white selection:text-neutral-950' 
          : 'bg-neutral-50/50 text-neutral-900 selection:bg-neutral-900 selection:text-white'
      }`} 
      id="prism-app-root"
    >
      
      {/* HEADER SECTION */}
      <GalleryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        layout={layout}
        onLayoutChange={setLayout}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onOpenUpload={() => setIsUploadOpen(true)}
        totalCount={filteredAndSortedImages.length}
        favoriteCount={likedImageIds.length}
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* FILTER BUTTONS ROW */}
      <CategoryFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        images={images}
        favoriteCount={likedImageIds.length}
        darkMode={darkMode}
      />

      {/* DYNAMIC CONTENT GALLERY CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8" id="gallery-main">
        
        <AnimatePresence mode="popLayout">
          {filteredAndSortedImages.length > 0 ? (
            <motion.div
              key={`layout-${layout}-${selectedCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {layout === 'grid' && (
                <div 
                  id="layout-grid-canvas"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {filteredAndSortedImages.map((img) => (
                    <ImageCard
                      key={img.id}
                      image={img}
                      layout="grid"
                      isLiked={likedImageIds.includes(img.id)}
                      onLikeToggle={handleLikeToggle}
                      onImageClick={setLightboxImage}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              )}

              {layout === 'masonry' && (
                <div 
                  id="layout-masonry-canvas"
                  className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
                >
                  {filteredAndSortedImages.map((img) => (
                    <div key={img.id} className="break-inside-avoid">
                      <ImageCard
                        image={img}
                        layout="masonry"
                        isLiked={likedImageIds.includes(img.id)}
                        onLikeToggle={handleLikeToggle}
                        onImageClick={setLightboxImage}
                        darkMode={darkMode}
                      />
                    </div>
                  ))}
                </div>
              )}

              {layout === 'list' && (
                <div 
                  id="layout-list-canvas"
                  className="flex flex-col gap-6 max-w-3xl mx-auto"
                >
                  {filteredAndSortedImages.map((img) => (
                    <ImageCard
                      key={img.id}
                      image={img}
                      layout="list"
                      isLiked={likedImageIds.includes(img.id)}
                      onLikeToggle={handleLikeToggle}
                      onImageClick={setLightboxImage}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* EMPTY STATE VISUALS */
            <motion.div
              id="gallery-empty-state"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto text-center py-20 px-4 space-y-4"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border ${
                darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-500' : 'bg-neutral-100 border-neutral-200 text-neutral-400'
              }`}>
                {selectedCategory === 'Favorites' ? (
                  <Heart className={`w-6 h-6 ${darkMode ? 'text-neutral-700' : 'text-neutral-300'}`} />
                ) : (
                  <ImageOff className={`w-6 h-6 ${darkMode ? 'text-neutral-700' : 'text-neutral-300'}`} />
                )}
              </div>
              <div className="space-y-1">
                <h4 className={`font-display font-semibold text-lg ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                  {selectedCategory === 'Favorites' 
                    ? 'No Liked Photographs Yet' 
                    : 'No Matching Photos Found'}
                </h4>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {selectedCategory === 'Favorites'
                    ? 'Explore the collection and click the heart icon on your favorite shots to archive them in this dedicated vault.'
                    : 'We could not locate any images matching your current query parameters. Try widening your keywords or clearing filters.'}
                </p>
              </div>
              
              <div className="pt-2">
                {searchQuery !== '' ? (
                  <button
                    id="btn-empty-clear-search"
                    onClick={() => setSearchQuery('')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                      darkMode ? 'bg-white hover:bg-neutral-200 text-neutral-950 font-bold' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    Clear Filter Search
                  </button>
                ) : selectedCategory === 'Favorites' ? (
                  <button
                    id="btn-empty-view-all"
                    onClick={() => setSelectedCategory('All')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                      darkMode ? 'bg-white hover:bg-neutral-200 text-neutral-950 font-bold' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    Browse Collections
                  </button>
                ) : (
                  <button
                    id="btn-empty-upload-first"
                    onClick={() => setIsUploadOpen(true)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                      darkMode ? 'bg-white hover:bg-neutral-200 text-neutral-950 font-bold' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    Upload Your First Image
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER AREA */}
      <footer className={`border-t py-8 text-center text-xs font-mono mt-auto transition-colors duration-300 ${
        darkMode ? 'border-neutral-900 bg-neutral-950/40 text-neutral-550' : 'border-neutral-100 bg-white/50 text-neutral-400'
      }`} id="prism-footer">
        <p>© 2026 PRISM IMAGE GRID CORP. ALL RIGHTS RESERVED.</p>
        <p className="mt-1 text-neutral-300 uppercase tracking-widest text-[9px] flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
          <span className={darkMode ? 'text-neutral-500' : 'text-neutral-400'}>Crafted in high definition layout design</span>
        </p>
      </footer>

      {/* OVERLAY POPUPS & LIGHTBOX */}
      
      {/* Lightbox Modal */}
      <LightboxModal
        image={lightboxImage}
        imagesList={filteredAndSortedImages}
        onClose={() => setLightboxImage(null)}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
        isLiked={lightboxImage ? likedImageIds.includes(lightboxImage.id) : false}
        onLikeToggle={(id) => handleLikeToggle(id)}
      />

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddImage={handleAddImage}
        darkMode={darkMode}
      />

    </div>
  );
}
