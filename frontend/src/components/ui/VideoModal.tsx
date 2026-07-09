import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiPlay } from 'react-icons/hi2';

interface Video {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnail: string;
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dairyVideos: Video[] = [
  {
    id: '1',
    title: 'Modern Dairy Farming & Milk Collection',
    description: 'Discover modern dairy farming practices, milk collection processes, and cooperative management systems.',
    embedUrl: 'https://www.youtube.com/embed/Vr031wKl8eU',
    thumbnail: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400',
  },
  {
    id: '2',
    title: 'Dairy Cooperative Management',
    description: 'Learn about successful dairy cooperative models and how they empower farmers through collective management.',
    embedUrl: 'https://www.youtube.com/embed/xPW0AMXKeCc',
    thumbnail: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400',
  },
  {
    id: '3',
    title: 'Smart Dairy Farm Technology',
    description: 'Explore cutting-edge technology in dairy farming including automated systems and digital management tools.',
    embedUrl: 'https://www.youtube.com/embed/qNVktzGtrW8',
    thumbnail: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400',
  },
];

const VideoModal = ({ isOpen, onClose }: VideoModalProps) => {
  const [selectedVideo, setSelectedVideo] = useState<Video>(dairyVideos[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setIsPlaying(false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-colors"
                aria-label="Close video modal"
              >
                <HiXMark className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-0">
              <div className="lg:col-span-2 bg-black">
                <div className="relative aspect-video">
                  {isPlaying ? (
                    <iframe
                      src={`${selectedVideo.embedUrl}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={selectedVideo.thumbnail}
                        alt={selectedVideo.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                        >
                          <HiPlay className="w-10 h-10 text-primary-600 ml-1 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-slate-900 text-white">
                  <h3 className="text-2xl font-bold mb-2">{selectedVideo.title}</h3>
                  <p className="text-slate-300">{selectedVideo.description}</p>
                </div>
              </div>

              <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-800 overflow-y-auto max-h-[90vh] lg:max-h-none">
                <div className="p-6">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    More Videos
                  </h4>
                  <div className="space-y-4">
                    {dairyVideos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => handleVideoSelect(video)}
                        className={`w-full text-left rounded-xl overflow-hidden transition-all hover:scale-[1.02] ${
                          selectedVideo.id === video.id
                            ? 'ring-2 ring-primary-500 shadow-lg'
                            : 'hover:ring-2 hover:ring-slate-300'
                        }`}
                      >
                        <div className="relative aspect-video">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          {selectedVideo.id !== video.id && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                <HiPlay className="w-6 h-6 text-primary-600 ml-0.5" />
                              </div>
                            </div>
                          )}
                          {selectedVideo.id === video.id && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-primary-600 text-white text-xs font-bold rounded">
                              Now Playing
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-700">
                          <h5 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
                            {video.title}
                          </h5>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default VideoModal;
