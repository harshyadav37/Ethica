import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Users,
  MessageCircle,
  Video,
  MessageSquare,
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import Feed from './Feed';
import Communities from './Communities';
import Messages from './Messages';
import VideoCalls from './VideoCalls';
import Forums from './Forums';
import PrivacyDashboard from './PrivacyDashboard';
import Profile from './Profile';

interface LayoutProps {
  onLogout: () => void;
}

type Page = 'feed' | 'communities' | 'messages' | 'videocalls' | 'forums' | 'privacy' | 'profile';

export default function Layout({ onLogout }: LayoutProps) {
  const [currentPage, setCurrentPage] = useState<Page>('feed');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'feed' as Page, label: 'Feed', icon: Home },
    { id: 'communities' as Page, label: 'Communities', icon: Users },
    { id: 'messages' as Page, label: 'Messages', icon: MessageCircle },
    { id: 'videocalls' as Page, label: 'Video Calls', icon: Video },
    { id: 'forums' as Page, label: 'Forums', icon: MessageSquare },
    { id: 'privacy' as Page, label: 'Privacy Dashboard', icon: Shield },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'feed':
        return <Feed />;
      case 'communities':
        return <Communities />;
      case 'messages':
        return <Messages />;
      case 'videocalls':
        return <VideoCalls />;
      case 'forums':
        return <Forums />;
      case 'privacy':
        return <PrivacyDashboard />;
      case 'profile':
        return <Profile />;
      default:
        return <Feed />;
    }
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? '80px' : '280px',
        }}
        className="hidden lg:flex fixed left-0 top-0 h-full bg-white/5 backdrop-blur-xl border-r border-white/10 flex-col z-40"
      >
        {/* Logo & Collapse Button */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg">Ethica</span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hover:bg-white/5"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-white border border-violet-500/30'
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-violet-500/30"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-violet-400' : ''}`} />
                {!sidebarCollapsed && (
                  <span className="relative z-10">{item.label}</span>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {item.label}
                  </div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div
            onClick={() => handleNavigate('profile')}
            className={`flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer group transition-all ${
              sidebarCollapsed ? 'justify-center' : ''
            } ${currentPage === 'profile' ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30' : ''}`}
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                JD
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate">Jane Doe</p>
                <p className="text-xs text-gray-400 truncate">@janedoe</p>
              </div>
            )}
          </div>

          <div className={`flex gap-2 mt-2 ${sidebarCollapsed ? 'flex-col' : ''}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className={`hover:bg-red-500/10 hover:text-red-400 ${
                sidebarCollapsed ? 'w-full' : 'flex-1'
              }`}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg">Ethica</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="hover:bg-white/5"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-white/10 z-50 flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-lg">Menu</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-white border border-violet-500/30'
                          : 'hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">Jane Doe</p>
                    <p className="text-xs text-gray-400 truncate">@janedoe</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="flex-1 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`min-h-screen lg:pl-[280px] pt-16 lg:pt-0 transition-all ${
          sidebarCollapsed ? 'lg:pl-[80px]' : ''
        }`}
      >
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="flex justify-around items-center py-2">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="flex flex-col items-center gap-1 px-3 py-2"
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-violet-400' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs ${
                    isActive ? 'text-violet-400' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}