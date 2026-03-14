import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { StockAdjustments } from '@/entities';
import { Plus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<StockAdjustments[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdjustments();
  }, []);

  const loadAdjustments = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<StockAdjustments>('stockadjustments');
      setAdjustments(result.items);
    } catch (error) {
      console.error('Error loading adjustments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[120rem] mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
              Stock Adjustments
            </h1>
            <p className="font-paragraph text-muted-gray-foreground">
              Inventory corrections and physical count updates
            </p>
          </div>
          <Link
            to="/adjustments/new"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-paragraph text-sm font-semibold hover:opacity-90 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create Adjustment</span>
          </Link>
        </div>

        {/* Adjustments List */}
        <div className="min-h-[400px]">
          {isLoading ? null : adjustments.length > 0 ? (
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-primary/20">
                    <tr>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Product</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Location</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Counted Qty</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Reason</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adjustments.map((adjustment, index) => (
                      <motion.tr
                        key={adjustment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                      >
                        <td className="font-paragraph text-foreground px-6 py-4 font-semibold">
                          {adjustment.productName || 'N/A'}
                        </td>
                        <td className="font-paragraph text-foreground px-6 py-4">
                          {adjustment.locationName || 'N/A'}
                        </td>
                        <td className="font-paragraph text-foreground px-6 py-4">
                          {adjustment.countedQuantity || 0}
                        </td>
                        <td className="font-paragraph text-muted-gray-foreground px-6 py-4 max-w-xs truncate">
                          {adjustment.reason || '-'}
                        </td>
                        <td className="font-paragraph text-muted-gray-foreground px-6 py-4">
                          {adjustment.adjustmentDate
                            ? new Date(adjustment.adjustmentDate).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-12 text-center">
              <AlertCircle className="w-16 h-16 text-muted-gray mx-auto mb-4" />
              <p className="font-paragraph text-muted-gray-foreground">
                No stock adjustments yet. Create your first adjustment to fix inventory discrepancies.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
