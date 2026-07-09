import { motion } from 'framer-motion';
import { HiBeaker } from 'react-icons/hi2';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube 
} from 'react-icons/fa';

const Footer = () => {
  const footerLinks = {
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Our Team', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press & Media', href: '#' },
    ],
    services: [
      { label: 'Milk Collection', href: '#' },
      { label: 'Quality Testing', href: '#' },
      { label: 'Veterinary Care', href: '#' },
      { label: 'Financial Services', href: '#' },
    ],
    resources: [
      { label: 'Blog', href: '#' },
      { label: 'Farmer Guide', href: '#' },
      { label: 'Training Videos', href: '#' },
      { label: 'FAQs', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Compliance', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: FaFacebook, href: '#', color: 'hover:text-blue-500' },
    { icon: FaTwitter, href: '#', color: 'hover:text-sky-500' },
    { icon: FaInstagram, href: '#', color: 'hover:text-pink-500' },
    { icon: FaLinkedin, href: '#', color: 'hover:text-blue-600' },
    { icon: FaYoutube, href: '#', color: 'hover:text-red-500' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <HiBeaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">DairyCoop</h3>
                <p className="text-xs text-slate-400">Management Suite</p>
              </div>
            </motion.div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Empowering dairy farmers through technology, transparency, and sustainable growth. Join thousands of farmers building better livelihoods.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -2 }}
                    className={`w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center transition-colors ${social.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-bold mb-4 capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-slate-800 pt-8 mb-8"
        >
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-white font-bold mb-2">Subscribe to Our Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">
              Get the latest updates, news, and farming tips delivered to your inbox
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <button className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg transition-all hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} DairyCoop Management Suite. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-primary-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
