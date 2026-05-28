import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './store';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/Toast';
import ProductDetailModal from './components/ProductDetailModal';
import AddListingModal from './components/AddListingModal';
import CheckoutModal from './components/CheckoutModal';
import CommunityPostModal from './components/CommunityPostModal';
import DashboardSection from './sections/DashboardSection';
import ProductsSection from './sections/ProductsSection';
import OrdersSection from './sections/OrdersSection';
import AuctionsSection from './sections/AuctionsSection';
import MessagesSection from './sections/MessagesSection';
import QualitySection from './sections/QualitySection';
import CommunitySection from './sections/CommunitySection';
import ProfileSection from './sections/ProfileSection';

function AppContent() {
  const { state } = useApp();
  const { currentSection, ui } = state;

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard': return <DashboardSection />;
      case 'products': return <ProductsSection />;
      case 'orders': return <OrdersSection />;
      case 'auctions': return <AuctionsSection />;
      case 'messages': return <MessagesSection />;
      case 'quality': return <QualitySection />;
      case 'community': return <CommunitySection />;
      case 'profile': return <ProfileSection />;
      default: return <DashboardSection />;
    }
  };

  const renderModal = () => {
    if (!ui.activeModal) return null;
    switch (ui.activeModal) {
      case 'productDetail': return <ProductDetailModal />;
      case 'addListing': return <AddListingModal />;
      case 'checkout': return <CheckoutModal />;
      case 'communityPost': return <CommunityPostModal />;
      default: return null;
    }
  };

  return (
    <div className="app-root min-h-screen">
      <Header />
      <Sidebar />
      <main className="pt-16 lg:pl-72 min-h-screen">
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${state.currentRole}-${currentSection}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <CartDrawer />
      <ToastContainer />
      {renderModal()}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
