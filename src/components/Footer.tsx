import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-primary/20 bg-[rgba(26,26,46,0.9)] backdrop-blur-md">
      <div className="max-w-[120rem] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="font-heading text-xl font-bold text-primary-foreground">I</span>
              </div>
              <span className="font-heading text-xl font-bold text-foreground">
                Inventory Nexus
              </span>
            </div>
            <p className="font-paragraph text-sm text-muted-gray-foreground max-w-xs">
              Precision inventory management for the modern enterprise. Real-time control, streamlined operations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Operations
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/products"
                  className="font-paragraph text-sm text-muted-gray-foreground hover:text-primary transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/receipts"
                  className="font-paragraph text-sm text-muted-gray-foreground hover:text-primary transition-colors"
                >
                  Receipts
                </Link>
              </li>
              <li>
                <Link
                  to="/deliveries"
                  className="font-paragraph text-sm text-muted-gray-foreground hover:text-primary transition-colors"
                >
                  Deliveries
                </Link>
              </li>
              <li>
                <Link
                  to="/transfers"
                  className="font-paragraph text-sm text-muted-gray-foreground hover:text-primary transition-colors"
                >
                  Transfers
                </Link>
              </li>
            </ul>
          </div>

          {/* System */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              System
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="font-paragraph text-sm text-muted-gray-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/warehouses"
                  className="font-paragraph text-sm text-muted-gray-foreground hover:text-primary transition-colors"
                >
                  Warehouses
                </Link>
              </li>
              <li>
                <Link
                  to="/adjustments"
                  className="font-paragraph text-sm text-muted-gray-foreground hover:text-primary transition-colors"
                >
                  Adjustments
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="font-paragraph text-sm text-muted-gray-foreground hover:text-primary transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="font-paragraph text-sm text-muted-gray-foreground">
              © {currentYear} Inventory Nexus. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="font-paragraph text-xs text-muted-gray-foreground">
                Powered by Digital Nexus Technology
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
