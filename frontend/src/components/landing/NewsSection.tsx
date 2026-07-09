import { motion } from 'framer-motion';
import { HiClock, HiArrowRight } from 'react-icons/hi2';

const NewsSection = () => {
  const articles = [
    {
      title: 'New Milk Processing Plant Opens in Nakuru',
      category: 'Infrastructure',
      date: '2 days ago',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600',
      excerpt: 'Our new state-of-the-art processing facility will increase capacity by 40% and create 200 jobs.',
    },
    {
      title: 'Digital Payment System Launches Nationwide',
      category: 'Technology',
      date: '5 days ago',
      readTime: '3 min read',
      image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=600',
      excerpt: 'Farmers can now receive payments instantly through mobile money integration.',
    },
    {
      title: 'Free Veterinary Camp for Member Farmers',
      category: 'Health',
      date: '1 week ago',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=600',
      excerpt: 'Join our monthly veterinary camp offering free health checkups for all dairy cattle.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-primary-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Latest News & Updates
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Stay informed about cooperative developments and industry trends
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                  {article.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <span>{article.date}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <HiClock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {article.title}
                </h3>

                <p className="text-slate-600 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>

                <button className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-4 transition-all">
                  Read More
                  <HiArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
