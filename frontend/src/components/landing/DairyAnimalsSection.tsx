import { motion } from 'framer-motion';

const DairyAnimalsSection = () => {
  const animals = [
    {
      name: 'Holstein Friesian',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800',
      production: '20-25 liters/day',
      characteristics: 'High milk yield, black and white coat',
      climate: 'Temperate, cool climates',
    },
    {
      name: 'Ayrshire',
      image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=800',
      production: '15-20 liters/day',
      characteristics: 'Hardy, reddish-brown markings',
      climate: 'Adaptable to various climates',
    },
    {
      name: 'Jersey',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=800',
      production: '12-18 liters/day',
      characteristics: 'High butterfat content, light brown',
      climate: 'Warm climates',
    },
    {
      name: 'Guernsey',
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=800',
      production: '15-20 liters/day',
      characteristics: 'Golden colored milk, fawn coat',
      climate: 'Moderate climates',
    },
    {
      name: 'Brown Swiss',
      image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=800',
      production: '18-24 liters/day',
      characteristics: 'Large size, brown color',
      climate: 'Mountainous regions',
    },
    {
      name: 'Local Breeds',
      image: 'https://images.unsplash.com/photo-1530540734855-0606330ea235?q=80&w=800',
      production: '8-12 liters/day',
      characteristics: 'Disease resistant, adapted locally',
      climate: 'All tropical climates',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Dairy Cattle Breeds
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We support farmers with various cattle breeds, each with unique characteristics and advantages
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animals.map((animal, index) => (
            <motion.div
              key={animal.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={animal.image}
                  alt={animal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {animal.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-primary-500 rounded-full">
                      <span className="text-white text-sm font-semibold">
                        {animal.production}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2" />
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Characteristics
                    </div>
                    <p className="text-slate-700 font-medium">
                      {animal.characteristics}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Suitable Climate
                    </div>
                    <p className="text-slate-700 font-medium">
                      {animal.climate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-500 transition-all duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-primary-50 rounded-2xl p-8">
            <div className="text-left">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Need Advice on Cattle Breeds?
              </h3>
              <p className="text-slate-600">
                Our experts can help you choose the right breed for your farm
              </p>
            </div>
            <button className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105">
              Consult Expert
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DairyAnimalsSection;
