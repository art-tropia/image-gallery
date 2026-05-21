import React, { useState } from 'react';
import { Heart, Maximize2, Share2, MapPin, Camera, ClipboardCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageItem, ViewLayout } from '../types';

interface ImageCardProps {
  image: ImageItem;
  layout: ViewLayout;
  isLiked: boolean;
  onLikeToggle: (id: string, e: React.MouseEvent) => void;
  onImageClick: (image: ImageItem) => void;
  darkMode: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  layout,
  isLiked,
  onLikeToggle,
  onImageClick,
  darkMode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(image.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isList = layout === 'list';

  if (isList) {
    return (
      <motion.div
        id={`card-${image.id}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`flex flex-col sm:flex-row border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all ${
          darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-100 text-neutral-900'
        }`}
      >
        {/* Left Side: Thumbnail */}
        <div 
          onClick={() => onImageClick(image)}
          className="relative w-full sm:w-72 h-48 bg-neutral-900 cursor-zoom-in overflow-hidden group shrink-0"
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 bg-neutral-900/60 backdrop-blur-xs text-[10px] font-mono text-neutral-100 tracking-wider px-2 py-1 rounded uppercase">
            {image.category}
          </div>
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <div className={`p-2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center scale-90 group-hover:scale-100 transition-transform ${
              darkMode ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-900'
            }`}>
              <Maximize2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Right Side: Information */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 
                  onClick={() => onImageClick(image)}
                  className={`font-display font-bold text-lg transition-colors cursor-pointer ${
                    darkMode ? 'text-white hover:text-neutral-300' : 'text-neutral-900 hover:text-neutral-600'
                  }`}
                >
                  {image.title}
                </h4>
                <p className={`text-xs mt-1 flex items-center gap-1 font-mono ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>
                  By <a href={image.photographerUrl} target="_blank" rel="noreferrer" className={`underline ${darkMode ? 'hover:text-white' : 'hover:text-neutral-900'}`}>{image.photographer}</a>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id={`btn-like-${image.id}`}
                  onClick={(e) => onLikeToggle(image.id, e)}
                  className={`p-2 rounded-full border transition-colors cursor-pointer ${
                    isLiked 
                      ? 'bg-red-500 border-red-500 text-white' 
                      : (darkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500' : 'bg-white border-neutral-200 text-neutral-400 hover:text-neutral-900')
                  }`}
                  title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  id={`btn-share-${image.id}`}
                  onClick={handleShare}
                  className={`p-2 rounded-full border transition-colors cursor-pointer relative ${
                    darkMode 
                      ? 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-500' 
                      : 'border-neutral-200 bg-white text-neutral-400 hover:text-neutral-900'
                  }`}
                  title="Copy Direct URL"
                >
                  {copied ? (
                    <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  {copied && (
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-neutral-950 text-[9px] text-white font-mono px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                      Copied!
                    </div>
                  )}
                </button>
              </div>
            </div>

            <p className={`text-sm line-clamp-2 mt-2 leading-relaxed ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
              {image.description}
            </p>
          </div>

          {/* Technical Metadata highlights (EXIF) */}
          <div className={`flex flex-wrap items-center gap-y-2 gap-x-4 pt-4 border-t mt-4 text-[11px] font-mono ${
            darkMode ? 'border-neutral-800 text-neutral-400' : 'border-neutral-100 text-neutral-500'
          }`}>
            {image.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 opacity-70" />
                <span>{image.location}</span>
              </span>
            )}
            {image.camera && (
              <span className="flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 opacity-70" />
                <span>{image.camera}</span>
              </span>
            )}
            <span className={`ml-auto shrink-0 font-medium px-2 py-0.5 rounded-full ${
              darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
            }`}>
              {image.likes + (isLiked ? 1 : 0)} Likes
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid/Masonry card layout
  return (
    <motion.div
      id={`card-${image.id}`}
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      onClick={() => onImageClick(image)}
      className={`group relative border rounded-2xl overflow-hidden transition-all cursor-zoom-in ${
        darkMode ? 'bg-neutral-900 border-neutral-800/80 hover:border-neutral-700 hover:shadow-neutral-950/40 hover:shadow-xl' : 'bg-white border-neutral-100 hover:shadow-xl'
      }`}
    >
      {/* Visual Content container */}
      <div className={`relative aspect-[4/3] w-full overflow-hidden ${darkMode ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Categories tag top overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="bg-neutral-950/70 backdrop-blur-md text-[9px] font-mono font-medium tracking-wide text-neutral-100 px-2 py-1 rounded uppercase">
            {image.category}
          </span>
          {image.isUserAdded && (
            <span className="bg-amber-650/90 backdrop-blur-md text-[9px] font-mono font-medium tracking-wide text-white px-2 py-1 rounded uppercase">
              User Added
            </span>
          )}
        </div>

        {/* Hover Controls (Heart, Fullscreen) with nice backdrop filter */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            id={`btn-like-grid-${image.id}`}
            onClick={(e) => onLikeToggle(image.id, e)}
            className={`p-2 rounded-full border shadow-xs transition-colors cursor-pointer ${
              isLiked 
                ? 'bg-red-550 border-red-400 text-white' 
                : (darkMode ? 'bg-neutral-850/90 backdrop-blur-xs border-neutral-750 text-neutral-300 hover:text-white hover:bg-neutral-800' : 'bg-white/90 backdrop-blur-xs border-neutral-200/50 text-neutral-600 hover:text-neutral-900')
            }`}
            title={isLiked ? 'Remove favorite' : 'Add favorite'}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            id={`btn-share-grid-${image.id}`}
            onClick={handleShare}
            className={`p-2 rounded-full border shadow-xs transition-colors cursor-pointer relative ${
              darkMode 
                ? 'bg-neutral-850/90 backdrop-blur-xs border-neutral-750 text-neutral-300 hover:text-white hover:bg-neutral-800' 
                : 'bg-white/90 backdrop-blur-xs border-neutral-200/50 text-neutral-600 hover:text-neutral-900_white'
            }`}
            title="Copy URL"
          >
            {copied ? (
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            {copied && (
              <div className="absolute bottom-full mb-1 right-0 bg-neutral-950 text-[8px] text-white font-mono px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                Copied URL!
              </div>
            )}
          </button>
        </div>

        {/* Gradient Bottom overlay inside image container with beautiful details */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent pt-12 pb-4 px-4 flex flex-col justify-end text-neutral-100 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          {image.location && (
            <p className="text-[10px] font-mono flex items-center gap-1 text-neutral-305">
              <MapPin className="w-3" />
              <span>{image.location}</span>
            </p>
          )}
          <h5 className="font-display font-semibold text-sm leading-tight text-white mt-1">
            {image.title}
          </h5>
        </div>
      </div>

      {/* Card Details (Always visible below image on grid/masonry) */}
      <div className={`p-4 border-t flex items-center justify-between transition-colors ${
        darkMode ? 'border-neutral-800/60 bg-neutral-900/50' : 'border-neutral-100/50'
      }`}>
        <div>
          <h4 className={`font-display font-bold text-sm leading-tight transition-colors line-clamp-1 ${
            darkMode ? 'text-white group-hover:text-neutral-200' : 'text-neutral-900 group-hover:text-black'
          }`}>
            {image.title}
          </h4>
          <p className={`text-[10px] mt-1 font-mono ${darkMode ? 'text-neutral-450' : 'text-neutral-400'}`}>
            By <span className={darkMode ? 'text-neutral-300 font-medium' : 'text-neutral-500 font-medium'}>{image.photographer}</span>
          </p>
        </div>
        <span className={`text-[9px] font-mono px-2 py-1 rounded-md flex shrink-0 items-center gap-1 font-medium select-none ${
          darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
        }`}>
          <Heart className={`w-2.5 h-2.5 ${isLiked ? 'fill-red-500 text-red-500' : (darkMode ? 'text-neutral-500' : 'text-neutral-400')}`} />
          {image.likes + (isLiked ? 1 : 0)}
        </span>
      </div>
    </motion.div>
  );
};
