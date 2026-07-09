import { motion } from 'framer-motion';
import {
  HiTruck,
  HiUserPlus,
  HiBeaker,
  HiHeart,
  HiShieldCheck,
  HiCurrencyDollar,
  HiChartBar,
  HiAcademicCap,
} from 'react-icons/hi2';

const ServicesSection = () => {
  const services = [
    {
      icon: HiTruck,
      title: 'Milk Collection',
      description: 'Daily doorstep collection with real-time tracking and quality testing',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: HiUserPlus,
      title: 'Farmer Registration',
      description: 'Easy onboarding process with digital documentation and verification',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: HiBeaker,
      title: 'Quality Testing',
      description: 'Advanced lab testing for fat, SNF, and purity standards',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: HiHeart,
      title: 'Veterinary Care',
      description: 'Regular health checkups and emergency veterinary services',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: HiShieldCheck,
      title: 'Insurance Coverage',
      description: 'Comprehensive cattle insurance and farmer protection plans',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: HiCurrencyDollar,
      title: 'Financial Services',
      description: 'Instant payments, loans, and share management facilities',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: HiChartBar,
      title: 'Market Access',
      description: 'Direct market linkages and fair pricing for your milk',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: HiAcademicCap,
      title: 'Training Programs',
      description: 'Regular training on best practices and modern farming techniques',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Comprehensive Services
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to thrive as a dairy farmer under one cooperative
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 ${service.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300`}
                  >
                    <Icon className={`w-7 h-7 bg-gradient-to-br ${service.color} bg-clip-text text-transparent`} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${service.color.includes('blue') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'}, transparent 70%)`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105">
            Explore All Services
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
