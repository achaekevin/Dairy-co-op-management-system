import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../../components/navigation/Sidebar';
import Header from '../../components/navigation/Header';
import Footer from '../../components/navigation/Footer';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import { useSidebarStore } from '../../store/sidebarStore';

const DashboardLayout = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-primary-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Header />
        <motion.main
          initial={false}
          animate={{
            marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (isCollapsed ? 80 : 280) : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 pt-14 sm:pt-16"
        >
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[2000px] mx-auto">
            <Breadcrumb />
            <Outlet />
          </div>
        </motion.main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
