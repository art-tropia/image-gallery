import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, ZoomIn, ZoomOut, Maximize, 
  MapPin, Camera, Calendar, Heart, Share2, Info, ChevronRightSquare, Sidebar 
} from 'lucide-react';
import { ImageItem } from '../types';

interface LightboxModalProps {
  image: ImageItem | null;
  imagesList: ImageItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isLiked: boolean;
  onLikeToggle: (id: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  image,
  imagesList,
  onClose,
  onNext,
  onPrev,
  isLiked,
  onLikeToggle,
}) => {
  if (!image) return null;

  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          handleNextSlide();
          break;
        case 'ArrowLeft':
          handlePrevSlide();
          break;
        case 'Escape':
          onClose();
          break;
        case ' ': // Space bar
          e.preventDefault();
          toggleSlideshow();
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopSlideshow();
    };
  }, [image, isPlaying, zoomScale]);

  // Handle slide transitions, resetting local zooms
  const handleNextSlide = () => {
    setZoomScale(1);
    onNext();
  };

  const handlePrevSlide = () => {
    setZoomScale(1);
    onPrev();
  };

  // Zoom Controls
  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - 0.25, 1));
  };

  const resetZoom = () => {
    setZoomScale(1);
  };

  // Autoplay Slideshow
  useEffect(() => {
    if (isPlaying) {
      slideshowTimerRef.current = setInterval(() => {
        handleNextSlide();
      }, 4000); // 4 seconds transition
    } else {
      stopSlideshow();
    }

    return () => stopSlideshow();
  }, [isPlaying, image]);

  const toggleSlideshow = () => {
    setIsPlaying((prev) => !prev);
  };

  const stopSlideshow = () => {
    if (slideshowTimerRef.current) {
      clearInterval(slideshowTimerRef.current);
      slideshowTimerRef.current = null;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(image.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div 
        id="lightbox-container" 
        className="fixed inset-0 z-50 bg-neutral-950/98 backdrop-blur-md flex flex-col md:flex-row overflow-hidden select-none"
      >
        {/* Playback continuous Progress Bar at root top */}
        {isPlaying && (
          <motion.div
            key={`progress-${image.id}`}
            id="lightbox-progress-bar"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4, ease: 'linear' }}
            className="absolute top-0 left-0 h-1 bg-neutral-100 z-55"
          />
        )}

        {/* Primary Screen Area: Image and Floating control grids */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-4 min-h-0 bg-neutral-950">
          
          {/* Main Overlay controls header */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-30">
            {/* Left: Quick Badge */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase bg-neutral-900 px-2.5 py-1.5 rounded-md border border-neutral-800">
                {image.category}
              </span>
              {isPlaying && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 rounded-md animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Slideshow Playing</span>
                </span>
              )}
            </div>

            {/* Center zoom stats if enlarged */}
            {zoomScale > 1 && (
              <span className="absolute left-1/2 -translate-x-1/2 text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-md">
                Zoom Factor: {zoomScale}x
              </span>
            )}

            {/* Right: Close controls & toggle options */}
            <div className="flex items-center gap-2">
              <button
                id="lightbox-btn-zoom-out"
                onClick={handleZoomOut}
                disabled={zoomScale === 1}
                className="p-2 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                id="lightbox-btn-zoom-in"
                onClick={handleZoomIn}
                disabled={zoomScale === 3}
                className="p-2 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-neutral-800 mx-1" />

              <button
                id="lightbox-btn-slideshow"
                onClick={toggleSlideshow}
                className={`p-2 border rounded-lg transition-colors cursor-pointer ${
                  isPlaying 
                    ? 'bg-neutral-100 border-neutral-100 text-neutral-950' 
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title={isPlaying ? 'Pause Slideshow' : 'Start Autoplay Slideshow'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                id="lightbox-btn-sidebar"
                onClick={() => setShowSidebar(!showSidebar)}
                className={`p-2 border rounded-lg transition-colors cursor-pointer ${
                  showSidebar 
                    ? 'bg-neutral-900/40 border-neutral-800 text-neutral-200' 
                    : 'bg-neutral-900/10 border-neutral-800 text-neutral-500 hover:text-white'
                }`}
                title="Toggle Media Sidebar"
              >
                <Sidebar className="w-4 h-4" />
              </button>
              <button
                id="lightbox-btn-close"
                onClick={onClose}
                className="p-2 bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 text-red-400 hover:text-red-200 rounded-lg transition-colors cursor-pointer"
                title="Exit Lightbox (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Left Arrow */}
          <button
            id="lightbox-btn-prev"
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-neutral-900/45 hover:bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white rounded-full transition-all cursor-pointer z-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image canvas with dynamic motion zoom and touch controls */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-6 max-h-[80vh]">
            <motion.div
              className="relative max-w-full max-h-full flex items-center justify-center"
              style={{
                scale: zoomScale,
                transition: 'transform 0.25s ease-out'
              }}
            >
              <motion.img
                key={image.id}
                src={image.url}
                alt={image.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl origin-center"
                referrerPolicy="no-referrer"
                onClick={zoomScale > 1 ? resetZoom : handleZoomIn}
              />
            </motion.div>
          </div>

          {/* Right Arrow */}
          <button
            id="lightbox-btn-next"
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-neutral-900/45 hover:bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white rounded-full transition-all cursor-pointer z-30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Floating Mobile details toggle bar */}
          <div className="absolute bottom-4 left-4 z-30 text-xs text-neutral-400 font-mono flex items-center gap-2">
            <span>Use Left/Right Arrows for slides</span>
            <span className="text-neutral-700">•</span>
            <span>Space to Play/Pause</span>
          </div>

        </div>

        {/* Right Split Panel: Technical Details, Photographer notes */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              id="lightbox-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'clamp(320px, 24vw, 380px)', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-neutral-900 border-l border-neutral-800 flex flex-col justify-between h-full text-neutral-200 overflow-hidden shrink-0 z-40 text-left"
            >
              {/* Sidebar top */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* Visual Title and category tags */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 bg-neutral-800 rounded">
                      {image.category}
                    </span>
                    {image.isUserAdded && (
                      <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 bg-amber-950/40 border border-amber-900/40 rounded">
                        User Contributed
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-extrabold text-2xl text-white tracking-tight leading-snug">
                    {image.title}
                  </h4>
                </div>

                {/* Photographer Details Card */}
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">CREATIVE MASTERMIND</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-neutral-100">{image.photographer}</p>
                      <a 
                        href={image.photographerUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-neutral-400 hover:text-white underline font-mono inline-block mt-0.5"
                      >
                        Unsplash Portfolio
                      </a>
                    </div>
                  </div>
                </div>

                {/* Narrative Description */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">BACKGROUND & STORY</span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {image.description || "No story has been populated for this capture yet."}
                  </p>
                </div>

                {/* Geographic & Capture Metadata */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">METADATA DETAILS</span>
                  <div className="grid grid-cols-1 gap-2.5 text-xs text-neutral-300">
                    {image.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{image.location}</span>
                      </div>
                    )}
                    {image.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{image.date}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* EXIF Camera settings grid - highlights professional photographers look */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>EXIF CAPTURE SPECS</span>
                  </span>
                  
                  {image.camera ? (
                    <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 space-y-3">
                      <p className="text-xs font-medium text-neutral-200 font-mono">{image.camera}</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                        <div className="bg-neutral-900 py-2 px-1.5 rounded border border-neutral-800/80">
                          <p className="text-neutral-500 mb-0.5 font-sans">Aperture</p>
                          <p className="text-neutral-200 font-semibold">{image.aperture || 'f/4.0'}</p>
                        </div>
                        <div className="bg-neutral-900 py-2 px-1.5 rounded border border-neutral-800/80">
                          <p className="text-neutral-500 mb-0.5 font-sans">Shutter</p>
                          <p className="text-neutral-200 font-semibold">{image.shutter || '1/125s'}</p>
                        </div>
                        <div className="bg-neutral-900 py-2 px-1.5 rounded border border-neutral-800/80">
                          <p className="text-neutral-500 mb-0.5 font-sans">ISO</p>
                          <p className="text-neutral-200 font-semibold">{image.iso || 'ISO 200'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-500 font-mono italic">
                      Camera metadata is not populated for this user photograph.
                    </p>
                  )}
                </div>

              </div>

              {/* Sidebar bottom with dynamic likes & quick controls */}
              <div className="p-6 bg-neutral-950 border-t border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">
                    {image.likes + (isLiked ? 1 : 0)} Appreciation likes
                  </span>
                  <button
                    id="lightbox-sidebar-btn-like"
                    onClick={() => onLikeToggle(image.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                      isLiked 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                        : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-400' : ''}`} />
                    <span>{isLiked ? 'Favored' : 'Favorite'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="lightbox-sidebar-btn-share"
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-xs font-mono border border-neutral-800 text-neutral-300 rounded-lg hover:text-white transition-colors cursor-pointer relative"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied URL!' : 'Share Asset'}</span>
                  </button>

                  <a
                    id="lightbox-sidebar-btn-download"
                    href={image.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-neutral-100 text-xs font-mono font-semibold text-neutral-950 rounded-lg transition-colors text-center"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                    <span>Inspect Raw</span>
                  </a>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AnimatePresence>
  );
};
