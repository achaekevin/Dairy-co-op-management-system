import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import api from '../../services/api';

const StatisticsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [farmerCount, setFarmerCount] = useState(10);

  useEffect(() => {
    const fetchFarmerCount = async () => {
      try {
        const response = await api.get('/farmers/statistics');
        if (response.data.success && response.data.data) {
          setFarmerCount(response.data.data.totalFarmers || 10);
        }
      } catch (error) {
        console.error('Failed to fetch farmer statistics');
      }
    };

    fetchFarmerCount();
  }, []);

  const stats = [
    { value: farmerCount, label: 'Registered Farmers', suffix: '', duration: 2 },
    { value: 50000, label: 'Liters Collected', suffix: '', duration: 2.5 },
    { value: 10, label: 'Collection Centers', suffix: '', duration: 2 },
    { value: 25, label: 'Monthly Veterinary Visits', suffix: '+', duration: 2.2 },
  ];

  const Counter = ({ value, duration }: { value: number; duration: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;

      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.floor(value * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [isInView, value, duration]);

    return <span>{count.toLocaleString()}</span>;
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Growing together, achieving more every day
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                <Counter value={stat.value} duration={stat.duration} />
                {stat.suffix}
              </div>
              <div className="text-lg text-primary-100 font-semibold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
