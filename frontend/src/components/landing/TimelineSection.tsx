import { motion } from 'framer-motion';
import {
  HiUserPlus,
  HiTruck,
  HiBeaker,
  HiCog,
  HiCurrencyDollar,
  HiShoppingCart,
  HiCheckCircle,
} from 'react-icons/hi2';

const TimelineSection = () => {
  const steps = [
    {
      icon: HiUserPlus,
      title: 'Farmer Registration',
      description: 'Farmers join the cooperative and get registered with digital documentation',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: HiTruck,
      title: 'Milk Collection',
      description: 'Daily doorstep milk collection from registered farmers using modern vehicles',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: HiBeaker,
      title: 'Quality Testing',
      description: 'Advanced lab testing for fat content, SNF, purity, and other quality parameters',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: HiCog,
      title: 'Processing',
      description: 'Milk is processed into various products in our state-of-the-art facility',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: HiCurrencyDollar,
      title: 'Farmer Payment',
      description: 'Weekly transparent payments based on quality and quantity delivered',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: HiShoppingCart,
      title: 'Distribution',
      description: 'Premium products distributed to retailers and consumers across the region',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: HiCheckCircle,
      title: 'Customer Satisfaction',
      description: 'Fresh, quality dairy products delivered to happy customers',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
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
            Our Journey
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From farm to table: Follow the complete journey of quality dairy production
          </p>
        </motion.div>

        <div className="relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`relative flex items-center gap-8 mb-12 ${
                  isEven ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="inline-block bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 max-w-md border border-slate-100"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`flex-shrink-0 w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center shadow-xl z-10 relative`}
                >
                  <Icon className={`w-8 h-8 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} />
                </motion.div>

                <div className="flex-1" />

                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-16 w-0.5 h-24 bg-gradient-to-b from-slate-200 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-full">
            <span className="text-primary-700 font-bold">End-to-end quality assurance at every step</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;
