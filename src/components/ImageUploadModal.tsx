import React, { useState, useRef } from 'react';
import { X, Upload, Link2, Camera, MapPin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, ImageItem } from '../types';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (newImage: ImageItem) => void;
  darkMode: boolean;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onAddImage,
  darkMode,
}) => {
  const [useUrl, setUseUrl] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'All' | 'Favorites'>>('Nature');
  const [imageUrl, setImageUrl] = useState('');
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localFilePreview, setLocalFilePreview] = useState<string | null>(null);
  const [photographer, setPhotographer] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [camera, setCamera] = useState('');
  
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setCategory('Nature');
    setImageUrl('');
    setLocalFile(null);
    setLocalFilePreview(null);
    setPhotographer('');
    setDescription('');
    setLocation('');
    setCamera('');
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    setError(null);
    setLocalFile(file);
    const objectUrl = URL.createObjectURL(file);
    setLocalFilePreview(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    
    let finalUrl = '';
    if (useUrl) {
      if (!imageUrl.trim()) {
        setError('Image URL is required.');
        return;
      }
      finalUrl = imageUrl.trim();
    } else {
      if (!localFilePreview) {
        setError('Please drop or select an image file to upload.');
        return;
      }
      finalUrl = localFilePreview;
    }

    const newImage: ImageItem = {
      id: `usr-${Date.now()}`,
      title: title.trim(),
      category,
      url: finalUrl,
      photographer: photographer.trim() || 'Anonymous Artist',
      photographerUrl: 'https://unsplash.com',
      description: description.trim() || 'A beautiful contribution from our galleries.',
      location: location.trim() || undefined,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      camera: camera.trim() || undefined,
      aperture: 'f/4.0',
      shutter: '1/125s',
      iso: 'ISO 200',
      likes: 0,
      isUserAdded: true,
    };

    onAddImage(newImage);
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="upload-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop blur */}
          <motion.div
            id="upload-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/65 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            id="upload-modal-content"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`relative border shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-10 transition-colors ${
              darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between border-b p-5 ${
              darkMode ? 'border-neutral-800' : 'border-neutral-100'
            }`}>
              <div>
                <h3 className={`text-xl font-display font-semibold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                  Submit a Masterpiece
                </h3>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Expand the community collection with your own visual assets
                </p>
              </div>
              <button
                id="btn-close-upload-modal"
                onClick={onClose}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-neutral-800 text-neutral-450 hover:text-white' : 'hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {error && (
                <div id="upload-form-error" className={`border rounded-lg p-3 text-xs font-mono ${
                  darkMode ? 'bg-red-950/30 border-red-900 text-red-400' : 'bg-red-50 border-red-105 text-red-600'
                }`}>
                  {error}
                </div>
              )}

              {/* Source tabs */}
              <div className={`flex p-1 rounded-lg ${darkMode ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
                <button
                  type="button"
                  id="tab-source-file"
                  onClick={() => { setUseUrl(false); setError(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    !useUrl 
                      ? (darkMode ? 'bg-neutral-800 text-white shadow-xs' : 'bg-white text-neutral-900 shadow-xs') 
                      : (darkMode ? 'text-neutral-450 hover:text-white' : 'text-neutral-500 hover:text-neutral-850')
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Image File</span>
                </button>
                <button
                  type="button"
                  id="tab-source-url"
                  onClick={() => { setUseUrl(true); setError(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    useUrl 
                      ? (darkMode ? 'bg-neutral-800 text-white shadow-xs' : 'bg-white text-neutral-900 shadow-xs') 
                      : (darkMode ? 'text-neutral-450 hover:text-white' : 'text-neutral-500 hover:text-neutral-850')
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>External Image Link</span>
                </button>
              </div>

              {/* Image Input Zone */}
              {!useUrl ? (
                <div>
                  <label className={`block text-xs font-mono mb-1.5 uppercase tracking-wider ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Image File</label>
                  <div
                    id="dropzone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                      isDragging
                        ? 'border-neutral-500 bg-neutral-950 scale-[1.01]'
                        : localFilePreview
                        ? (darkMode ? 'border-neutral-700 bg-neutral-950' : 'border-neutral-200 bg-neutral-50')
                        : (darkMode ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/50' : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/55')
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="upload-file-input"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {localFilePreview ? (
                      <div className={`relative group w-full max-w-[200px] h-[120px] rounded-lg overflow-hidden border ${
                        darkMode ? 'border-neutral-800' : 'border-neutral-200'
                      }`}>
                        <img
                          src={localFilePreview}
                          alt="Local preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-neutral-955/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-[10px] text-white font-mono bg-neutral-950/70 px-2 py-1 rounded">Replace Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className={`p-3 rounded-full inline-block shadow-sm border ${
                          darkMode ? 'bg-neutral-800/80 border-neutral-700 text-neutral-300' : 'bg-white border-neutral-100 text-neutral-400'
                        }`}>
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-neutral-200' : 'text-neutral-700'}`}>
                            Drag & drop your photo file here
                          </p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-400'}`}>
                            or click to browse your local folders
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div id="url-source-input-block">
                  <label htmlFor="url-input" className={`block text-xs font-mono mb-1.5 uppercase tracking-wider ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>Image URL</label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="url"
                      id="url-input"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:ring-1 ${
                        darkMode 
                          ? 'bg-neutral-950 border-neutral-800 text-white focus:border-white focus:ring-white' 
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900 focus:ring-neutral-900'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-405 mt-1.5 leading-normal opacity-80">
                    Enter any valid high-resolution image link directly. Ensure host supports public cross-origin image loads.
                  </p>
                </div>
              )}

              {/* Standard Attributes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title-input" className={`block text-xs font-mono mb-1.5 uppercase tracking-wider ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>Title *</label>
                  <input
                    type="text"
                    id="title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={40}
                    placeholder="Enter image title"
                    className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1 ${
                      darkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white focus:border-white focus:ring-white' 
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900 focus:ring-neutral-900'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="category-select" className={`block text-xs font-mono mb-1.5 uppercase tracking-wider ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>Category</label>
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Exclude<Category, 'All' | 'Favorites'>)}
                    className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none pr-3 cursor-pointer ${
                      darkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white focus:border-white' 
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900'
                    }`}
                  >
                    <option value="Nature">Nature</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Animals">Animals</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Portraits">Portraits</option>
                  </select>
                </div>
              </div>

              {/* Photographer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="photographer-input" className={`block text-xs font-mono mb-1.5 uppercase tracking-wider ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>Photographer / Creator</label>
                  <input
                    type="text"
                    id="photographer-input"
                    value={photographer}
                    onChange={(e) => setPhotographer(e.target.value)}
                    placeholder="E.g., Walter Chang"
                    className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1 ${
                      darkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white focus:border-white focus:ring-white' 
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900 focus:ring-neutral-900'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="camera-input" className={`block text-xs font-mono mb-1.5 uppercase tracking-wider flex items-center gap-1 ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>
                    <Camera className="w-3.5 h-3.5" />
                    <span>Camera Gear (Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="camera-input"
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                    placeholder="E.g., Sony α7 IV, 35mm f/1.4"
                    className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1 ${
                      darkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white focus:border-white focus:ring-white' 
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900 focus:ring-neutral-900'
                    }`}
                  />
                </div>
              </div>

              {/* Secondary Details */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="location-input" className={`block text-xs font-mono mb-1.5 uppercase tracking-wider flex items-center gap-1 ${darkMode ? 'text-neutral-450' : 'text-neutral-500'}`}>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location (Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="location-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="E.g., Kyoto, Japan"
                    className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-1 ${
                      darkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white focus:border-white focus:ring-white' 
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900 focus:ring-neutral-900'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="description-input" className={`block text-xs font-mono mb-1.5 uppercase tracking-wider ${darkMode ? 'text-neutral-455' : 'text-neutral-500'}`}>Description</label>
                  <textarea
                    id="description-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2.5}
                    placeholder="Describe the context or story behind the image..."
                    className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none resize-none focus:ring-1 ${
                      darkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white focus:border-white focus:ring-white' 
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-900 focus:ring-neutral-900'
                    }`}
                  />
                </div>
              </div>

            </form>

            {/* Footer */}
            <div className={`border-t px-6 py-4 flex items-center justify-end gap-3 ${
              darkMode ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-100 bg-neutral-50'
            }`}>
              <button
                type="button"
                id="btn-cancel-upload"
                onClick={onClose}
                className={`px-4 py-2 text-xs font-medium cursor-pointer transition-colors ${
                  darkMode ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-submit-upload"
                onClick={handleSubmit}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                  darkMode 
                    ? 'bg-white hover:bg-neutral-100 text-neutral-950 font-semibold' 
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Photograph</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
