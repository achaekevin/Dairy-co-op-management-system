import { motion } from 'framer-motion';
import { HiPhone, HiEnvelope, HiMapPin, HiClock } from 'react-icons/hi2';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: HiPhone,
      title: 'Phone',
      details: ['+254 700 123 456', '+254 733 987 654'],
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: HiEnvelope,
      title: 'Email',
      details: ['info@dairycoop.co.ke', 'support@dairycoop.co.ke'],
      color: 'from-green-500 to-green-600',
    },
    {
      icon: HiMapPin,
      title: 'Head Office',
      details: ['Dairy Plaza, Nairobi Road', 'P.O. Box 12345, Nairobi'],
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: HiClock,
      title: 'Working Hours',
      details: ['Mon - Fri: 7:00 AM - 6:00 PM', 'Sat: 8:00 AM - 2:00 PM'],
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-slate-300">
            We're here to help and answer any questions you might have
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold mb-3">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-slate-300 text-sm">
                    {detail}
                  </p>
                ))}
              </motion.div>
            );
          })}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
            />
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
