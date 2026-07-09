import { motion } from 'framer-motion';
import {
  HiShieldCheck,
  HiCurrencyDollar,
  HiClock,
  HiChartBar,
  HiUserGroup,
  HiBeaker,
  HiTruck,
  HiAcademicCap,
  HiPhone,
  HiGlobeAlt,
  HiHeart,
  HiSparkles,
} from 'react-icons/hi2';

const WhyChooseUsSection = () => {
  const reasons = [
    {
      icon: HiCurrencyDollar,
      title: 'Fair Milk Prices',
      description: 'Competitive rates based on quality, ensuring maximum returns for your hard work',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: HiClock,
      title: 'Fast Payments',
      description: 'Weekly payments directly to your account with complete transparency',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: HiBeaker,
      title: 'Quality Assurance',
      description: 'Advanced testing equipment and strict quality standards at collection points',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: HiHeart,
      title: 'Veterinary Support',
      description: '24/7 access to qualified veterinarians and animal health services',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: HiChartBar,
      title: 'Affordable Loans',
      description: 'Low-interest loans for farm expansion and cattle purchase',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: HiTruck,
      title: 'Feed Supply',
      description: 'Quality animal feed and supplements at subsidized cooperative rates',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: HiGlobeAlt,
      title: 'Digital Records',
      description: 'Track your deliveries, payments, and performance through our mobile app',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: HiShieldCheck,
      title: 'Transparent Management',
      description: 'Democratic governance with full visibility into cooperative operations',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: HiAcademicCap,
      title: 'Training Programs',
      description: 'Regular workshops on modern farming practices and animal husbandry',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      icon: HiUserGroup,
      title: 'Community Support',
      description: 'Join a network of thousands of farmers sharing knowledge and experience',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      icon: HiPhone,
      title: '24/7 Customer Care',
      description: 'Round-the-clock support for any issues or questions',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      icon: HiSparkles,
      title: 'Bonus & Incentives',
      description: 'Quarterly bonuses based on milk quality and volume delivered',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-slate-50 to-primary-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Why Choose Our Cooperative
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive support and services that make us the preferred choice for dairy farmers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100"
              >
                <div className={`w-12 h-12 ${reason.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${reason.color}`} />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {reason.title}
                </h3>
                
                <p className="text-sm text-slate-600 leading-relaxed">
                  {reason.description}
                </p>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105">
              Join Our Cooperative
            </button>
            <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl shadow-md border-2 border-slate-200 transition-all hover:scale-105">
              Schedule a Visit
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
