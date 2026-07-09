import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi2';

const ProductsSection = () => {
  const products = [
    {
      name: 'Fresh Milk',
      description: 'Pure, fresh milk collected daily from our farmers',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=800',
      benefits: 'Rich in Calcium & Protein',
    },
    {
      name: 'Yogurt',
      description: 'Creamy probiotic yogurt for healthy digestion',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800',
      benefits: 'Probiotics & Vitamins',
    },
    {
      name: 'Cheese',
      description: 'Artisan cheese made from premium milk',
      image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=800',
      benefits: 'High Protein Content',
    },
    {
      name: 'Butter',
      description: 'Pure butter churned from fresh cream',
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800',
      benefits: 'Natural & Wholesome',
    },
    {
      name: 'Ghee',
      description: 'Traditional clarified butter for cooking',
      image: 'https://images.unsplash.com/photo-1630409346559-2c87a16a9e4c?q=80&w=800',
      benefits: 'Rich in Healthy Fats',
    },
    {
      name: 'Cream',
      description: 'Fresh cream for cooking and desserts',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=800',
      benefits: 'Smooth & Creamy',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4">
            <HiSparkles className="w-5 h-5 text-primary-600" />
            <span className="text-primary-700 font-semibold">Our Products</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Premium Dairy Products
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From farm to table, our products maintain the highest quality standards
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Benefits Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-semibold text-primary-700">
                    {product.benefits}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/20 transition-all duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-500 transition-all duration-300"
                initial={false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
