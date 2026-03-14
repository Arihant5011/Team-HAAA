import { Link, useLocation } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/receipts', label: 'Receipts' },
    { path: '/deliveries', label: 'Deliveries' },
    { path: '/transfers', label: 'Transfers' },
    { path: '/adjustments', label: 'Adjustments' },
    { path: '/warehouses', label: 'Warehouses' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full border-b border-primary/20 bg-[rgba(26,26,46,0.9)] backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-heading text-xl font-bold text-primary-foreground">I</span>
            </div>
            <span className="font-heading text-xl font-bold text-foreground hidden sm:inline">
              Inventory Nexus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-gray-foreground hover:text-foreground hover:bg-primary/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span className="font-paragraph text-sm">
                    {member?.profile?.nickname || member?.contact?.firstName || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={actions.logout}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-paragraph text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={actions.login}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-paragraph text-sm font-semibold hover:opacity-90 transition-all duration-300"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <nav className="flex flex-col space-y-2 py-4 border-t border-primary/20 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-sm px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(link.path)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-gray-foreground hover:text-foreground hover:bg-primary/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {isAuthenticated && (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="sm:hidden font-paragraph text-sm px-4 py-3 rounded-lg text-muted-gray-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        actions.logout();
                      }}
                      className="sm:hidden font-paragraph text-sm px-4 py-3 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
