import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi2';

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I join the cooperative?',
      answer: 'Joining is simple! Visit any of our collection centers with your ID, farm details, and a passport photo. Our team will guide you through the registration process, which typically takes less than 30 minutes.',
    },
    {
      question: 'When and how are payments made?',
      answer: 'Payments are processed twice monthly - on the 15th and end of month. You can receive payment through bank transfer, mobile money, or direct deposit. All payment details are available in real-time through our mobile app.',
    },
    {
      question: 'What are the milk quality standards?',
      answer: 'We test for fat content (minimum 3.5%), SNF (minimum 8.5%), temperature, acidity, and adulteration. Our labs conduct daily testing to ensure premium quality standards are maintained.',
    },
    {
      question: 'Can I access loans and financial services?',
      answer: 'Yes! Members can access low-interest loans, shares, and financial advisory services. Loan applications are processed within 48 hours, and you can apply directly through our digital platform.',
    },
    {
      question: 'What veterinary services are available?',
      answer: 'We provide regular health checkups, emergency care, artificial insemination, vaccination programs, and free consultations. Our veterinary team visits all regions weekly.',
    },
    {
      question: 'How does the quality bonus system work?',
      answer: 'Farmers delivering milk with higher fat and SNF content receive bonus payments. Premium quality milk (4%+ fat, 9%+ SNF) earns up to 20% bonus on the base price.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to know about our cooperative
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:border-primary-300 transition-colors"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-lg font-bold text-slate-900 pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiChevronDown className="w-6 h-6 text-slate-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
