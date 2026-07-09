import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi2';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'James Kimani',
      role: 'Dairy Farmer',
      location: 'Kiambu County',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      quote: 'Since joining this cooperative, my experience has been excellent. The transparent payment system and fair prices are already making a difference.',
      rating: 5,
      increase: '+15%',
    },
    {
      name: 'Mary Wanjiku',
      role: 'Smallholder Farmer',
      location: 'Nakuru County',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      quote: 'The veterinary services and training programs are helpful. The digital system makes tracking my milk deliveries so much easier.',
      rating: 5,
      increase: '+10%',
    },
    {
      name: 'Peter Ochieng',
      role: 'Commercial Farmer',
      location: 'Eldoret Region',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      quote: 'The digital platform is user-friendly. I can track my deliveries and payments online. Looking forward to more growth with this cooperative.',
      rating: 5,
      increase: '+12%',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Farmer Success Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real stories from real farmers who transformed their lives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-slate-50 to-primary-50/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-100"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                  <p className="text-xs text-slate-500">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <HiStar key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>

              <p className="text-slate-700 italic mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full">
                <span className="text-green-700 font-bold">{testimonial.increase}</span>
                <span className="text-green-600 text-sm ml-2">Income Growth</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
