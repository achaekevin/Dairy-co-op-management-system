import { motion } from 'framer-motion';
import { HiCheckCircle, HiArrowTrendingUp, HiUsers, HiGlobeAlt } from 'react-icons/hi2';

const AboutSection = () => {
  const features = [
    {
      icon: HiCheckCircle,
      title: 'Quality Assurance',
      description: 'Rigorous testing at every stage',
    },
    {
      icon: HiArrowTrendingUp,
      title: 'Fair Pricing',
      description: 'Competitive rates for farmers',
    },
    {
      icon: HiUsers,
      title: 'Community First',
      description: 'Supporting local farmers',
    },
    {
      icon: HiGlobeAlt,
      title: 'Sustainable',
      description: 'Environmentally responsible',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              About Our Cooperative
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Founded with a vision to empower dairy farmers, our cooperative is a growing platform 
              that combines traditional cooperative values with modern technology to deliver exceptional 
              service to our members. We're building a community where every farmer matters.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Through transparent operations, fair pricing, and comprehensive support services, 
              we're helping farmers build sustainable livelihoods while delivering 
              premium dairy products to consumers. Join us as we grow together.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800"
                alt="Dairy Farm"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary-600">1</div>
                      <div className="text-sm text-slate-600 font-medium">Year</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary-600">10+</div>
                      <div className="text-sm text-slate-600 font-medium">Farmers</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary-600">50K+</div>
                      <div className="text-sm text-slate-600 font-medium">Liters</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl shadow-2xl flex items-center justify-center"
            >
              <div className="text-center text-white">
                <div className="text-2xl font-bold">92%</div>
                <div className="text-xs font-medium">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
