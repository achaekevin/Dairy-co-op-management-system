import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=800',
      title: 'Dairy Farm',
      category: 'Farms',
    },
    {
      url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800',
      title: 'Cattle Grazing',
      category: 'Animals',
    },
    {
      url: 'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?q=80&w=800',
      title: 'Milk Collection',
      category: 'Collection',
    },
    {
      url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=800',
      title: 'Quality Testing',
      category: 'Testing',
    },
    {
      url: 'https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b?q=80&w=800',
      title: 'Processing Plant',
      category: 'Processing',
    },
    {
      url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=800',
      title: 'Fresh Milk',
      category: 'Products',
    },
    {
      url: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=800',
      title: 'Veterinary Care',
      category: 'Services',
    },
    {
      url: 'https://images.unsplash.com/photo-1530540734855-0606330ea235?q=80&w=800',
      title: 'Farmer Training',
      category: 'Training',
    },
    {
      url: 'https://images.unsplash.com/photo-1585908843320-bdd5ec30ec7b?q=80&w=800',
      title: 'Collection Vehicle',
      category: 'Fleet',
    },
  ];

  return (
    <>
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Our Gallery
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A glimpse into our daily operations and the farmers we serve
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => setSelectedImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-xs font-semibold text-primary-300 mb-1">
                      {image.category}
                    </div>
                    <h3 className="text-white font-bold text-lg">
                      {image.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <HiXMark className="w-6 h-6 text-white" />
          </button>
          
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-full object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </>
  );
};

export default GallerySection;
