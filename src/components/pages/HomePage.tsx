// HPI 1.7-G
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Products, DeliveryOrders, Receipts, InternalTransfers } from '@/entities';
import { Package, AlertTriangle, TrendingUp, TrendingDown, ArrowRightLeft, Activity, Database, Zap, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Types ---
type OperationType = 'Receipt' | 'Delivery' | 'Transfer';

interface OperationRecord {
  _id: string;
  type: OperationType;
  status?: string;
  _createdDate?: Date | string;
  receiptNumber?: string;
  orderNumber?: string;
  transferReference?: string;
}

export default function HomePage() {
  // --- Canonical Data Sources & State ---
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    scheduledTransfers: 0
  });
  const [recentOperations, setRecentOperations] = useState<OperationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Refs for Scroll Animations (Crash Prevention: Always in DOM) ---
  const heroRef = useRef<HTMLDivElement>(null);
  const kpiRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  // --- Data Fetching Logic (Preserved) ---
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, receiptsRes, deliveriesRes, transfersRes] = await Promise.all([
        BaseCrudService.getAll<Products>('products'),
        BaseCrudService.getAll<Receipts>('receipts'),
        BaseCrudService.getAll<DeliveryOrders>('deliveryorders'),
        BaseCrudService.getAll<InternalTransfers>('internaltransfers')
      ]);

      const lowStock = productsRes.items.filter(p => (p.stockLevel || 0) < 10).length;
      const pendingReceipts = receiptsRes.items.filter(r => r.status !== 'Done' && r.status !== 'Canceled').length;
      const pendingDeliveries = deliveriesRes.items.filter(d => d.status !== 'Done' && d.status !== 'Canceled').length;
      const scheduledTransfers = transfersRes.items.filter(t => t.status === 'Waiting' || t.status === 'Ready').length;

      setStats({
        totalProducts: productsRes.totalCount,
        lowStockItems: lowStock,
        pendingReceipts,
        pendingDeliveries,
        scheduledTransfers
      });

      const operations: OperationRecord[] = [
        ...receiptsRes.items.slice(0, 3).map(r => ({ ...r, type: 'Receipt' as OperationType })),
        ...deliveriesRes.items.slice(0, 3).map(d => ({ ...d, type: 'Delivery' as OperationType })),
        ...transfersRes.items.slice(0, 3).map(t => ({ ...t, type: 'Transfer' as OperationType }))
      ].sort((a, b) => {
        const dateA = new Date(a._createdDate || 0).getTime();
        const dateB = new Date(b._createdDate || 0).getTime();
        return dateB - dateA;
      }).slice(0, 6); // Increased to 6 for better table layout

      setRecentOperations(operations);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Configuration ---
  const kpiCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Database,
      color: 'primary',
      link: '/products',
      colSpan: 'md:col-span-2 lg:col-span-2',
      description: 'Active SKUs in system'
    },
    {
      title: 'Low Stock Alert',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: 'destructive',
      link: '/products',
      colSpan: 'md:col-span-1 lg:col-span-1',
      description: 'Requires attention'
    },
    {
      title: 'Pending Receipts',
      value: stats.pendingReceipts,
      icon: TrendingUp,
      color: 'accent-teal',
      link: '/receipts',
      colSpan: 'md:col-span-1 lg:col-span-1',
      description: 'Incoming shipments'
    },
    {
      title: 'Pending Deliveries',
      value: stats.pendingDeliveries,
      icon: TrendingDown,
      color: 'secondary',
      link: '/deliveries',
      colSpan: 'md:col-span-1 lg:col-span-1',
      description: 'Outgoing orders'
    },
    {
      title: 'Scheduled Transfers',
      value: stats.scheduledTransfers,
      icon: ArrowRightLeft,
      color: 'accent-purple',
      link: '/transfers',
      colSpan: 'md:col-span-2 lg:col-span-2',
      description: 'Internal movements'
    }
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Done': return 'text-accent-teal border-accent-teal/30 bg-accent-teal/10';
      case 'Waiting':
      case 'Ready': return 'text-secondary border-secondary/30 bg-secondary/10';
      case 'Draft': return 'text-muted-gray-foreground border-muted-gray/30 bg-muted-gray/10';
      case 'Canceled': return 'text-destructive border-destructive/30 bg-destructive/10';
      default: return 'text-foreground border-primary/30 bg-primary/10';
    }
  };

  const getTypeIcon = (type: OperationType) => {
    switch (type) {
      case 'Receipt': return <TrendingUp className="w-4 h-4 mr-2 text-accent-teal" />;
      case 'Delivery': return <TrendingDown className="w-4 h-4 mr-2 text-secondary" />;
      case 'Transfer': return <ArrowRightLeft className="w-4 h-4 mr-2 text-accent-purple" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary overflow-clip font-paragraph">
      <style>{`
        .nexus-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
          mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }
        .scanline {
          width: 100%;
          height: 100px;
          background: linear-gradient(0deg, rgba(0,255,255,0) 0%, rgba(0,255,255,0.1) 50%, rgba(0,255,255,0) 100%);
          opacity: 0.1;
          position: absolute;
          bottom: 100%;
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
        }
        .glass-panel {
          background: rgba(26, 26, 46, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 255, 255, 0.1);
        }
        .text-glow-primary { text-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
        .text-glow-secondary { text-shadow: 0 0 20px rgba(255, 0, 255, 0.5); }
      `}</style>

      <Header />

      <main className="w-full relative z-10">
        
        {/* --- HERO SECTION: The Digital Nexus --- */}
        <section 
          ref={heroRef}
          className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden pt-20"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 nexus-grid z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_60%)] z-0" />
          <div className="scanline z-0" />

          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 w-full max-w-[120rem] mx-auto px-6 md:px-12 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8"
            >
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs tracking-[0.2em] text-primary uppercase font-heading">System Online // Nexus Core Active</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold text-foreground tracking-tighter leading-none mb-6"
            >
              INVENTORY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-teal to-secondary text-glow-primary">
                COMMAND
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="font-paragraph text-lg md:text-xl text-muted-gray-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Real-time telemetry and spatial tracking for all stock operations. 
              Monitor, route, and optimize your physical assets with absolute precision.
            </motion.p>

            {/* Decorative Tech Elements */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden lg:flex flex-col gap-4 opacity-30">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-8 bg-primary" />
              ))}
            </div>
            <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:flex flex-col gap-4 opacity-30 items-end">
              <div className="text-xs font-paragraph text-primary tracking-widest rotate-90 origin-right translate-x-full">
                SYS.MONITOR.V1
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- KPI DASHBOARD: Telemetry Readout --- */}
        <section 
          ref={kpiRef}
          className="relative w-full max-w-[120rem] mx-auto px-6 md:px-12 py-24 z-20"
        >
          <div className="flex items-center justify-between mb-12 border-b border-primary/20 pb-6">
            <h2 className="font-heading text-3xl md:text-4xl font-bold flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
              Live Telemetry
            </h2>
            <div className="text-xs font-paragraph text-primary/60 tracking-widest uppercase hidden md:block">
              Data Stream: Active
            </div>
          </div>

          {/* Loading Overlay / Content Container */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <span className="text-primary font-paragraph text-sm tracking-widest animate-pulse">SYNCING DATA...</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, staggerChildren: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {kpiCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={card.colSpan}
                    >
                      <Link to={card.link} className="block h-full group">
                        <div className="glass-panel h-full rounded-2xl p-8 relative overflow-hidden transition-all duration-500 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                          {/* Hover Gradient Reveal */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-start justify-between mb-8">
                              <div>
                                <h3 className="font-paragraph text-sm text-muted-gray-foreground tracking-wider uppercase mb-1">
                                  {card.title}
                                </h3>
                                <p className="text-xs text-primary/60 font-paragraph">{card.description}</p>
                              </div>
                              <div className={`p-3 rounded-xl bg-${card.color}/10 border border-${card.color}/20`}>
                                <card.icon className={`w-6 h-6 text-${card.color}`} />
                              </div>
                            </div>
                            
                            <div className="flex items-end justify-between">
                              <div className="font-heading text-5xl md:text-6xl font-bold text-foreground tracking-tighter">
                                {card.value.toString().padStart(2, '0')}
                              </div>
                              <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                                <Zap className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* --- RECENT OPERATIONS: The Ledger --- */}
        <section 
          ref={tableRef}
          className="relative w-full max-w-[120rem] mx-auto px-6 md:px-12 pb-32 z-20"
        >
          <div className="flex items-center justify-between mb-12 border-b border-primary/20 pb-6">
            <h2 className="font-heading text-3xl md:text-4xl font-bold flex items-center gap-4">
              <Database className="w-8 h-8 text-secondary" />
              Operation Ledger
            </h2>
            <Link 
              to="/operations" 
              className="text-sm font-paragraph text-primary hover:text-secondary transition-colors flex items-center gap-2"
            >
              VIEW ALL LOGS <ArrowRightLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden relative">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50" />

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/20 bg-background/50">
                    <th className="font-paragraph text-xs text-primary/70 tracking-widest uppercase px-8 py-6 font-medium">Operation Type</th>
                    <th className="font-paragraph text-xs text-primary/70 tracking-widest uppercase px-8 py-6 font-medium">Reference ID</th>
                    <th className="font-paragraph text-xs text-primary/70 tracking-widest uppercase px-8 py-6 font-medium">Status</th>
                    <th className="font-paragraph text-xs text-primary/70 tracking-widest uppercase px-8 py-6 font-medium text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  {!isLoading && recentOperations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center text-muted-gray-foreground font-paragraph">
                        No recent operations detected in the system.
                      </td>
                    </tr>
                  ) : (
                    recentOperations.map((op, index) => (
                      <motion.tr
                        key={op._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="border-b border-primary/10 hover:bg-primary/5 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center font-paragraph text-sm text-foreground">
                            {getTypeIcon(op.type)}
                            {op.type}
                          </div>
                        </td>
                        <td className="px-8 py-6 font-paragraph text-sm text-muted-gray-foreground group-hover:text-primary transition-colors">
                          {op.receiptNumber || op.orderNumber || op.transferReference || `SYS-GEN-${op._id.substring(0,6)}`}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-paragraph border ${getStatusColor(op.status)}`}>
                            {op.status || 'Processing'}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-paragraph text-sm text-muted-gray-foreground text-right">
                          {op._createdDate ? new Date(op._createdDate).toLocaleString('en-US', { 
                            month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' 
                          }) : 'N/A'}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}