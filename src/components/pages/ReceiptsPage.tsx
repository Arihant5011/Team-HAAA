import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Receipts } from '@/entities';
import { Plus, TrendingUp, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipts[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadReceipts();
  }, []);

  useEffect(() => {
    filterReceipts();
  }, [statusFilter, receipts]);

  const loadReceipts = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Receipts>('receipts');
      setReceipts(result.items);
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReceipts = () => {
    if (statusFilter === 'all') {
      setFilteredReceipts(receipts);
    } else {
      setFilteredReceipts(receipts.filter(r => r.status === statusFilter));
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Done':
        return 'bg-accent-teal/10 text-accent-teal';
      case 'Waiting':
      case 'Ready':
        return 'bg-secondary/10 text-secondary';
      case 'Draft':
        return 'bg-muted-gray/10 text-muted-gray-foreground';
      case 'Canceled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-primary/10 text-primary';
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
              Receipts
            </h1>
            <p className="font-paragraph text-muted-gray-foreground">
              Incoming stock from suppliers
            </p>
          </div>
          <Link
            to="/receipts/new"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-paragraph text-sm font-semibold hover:opacity-90 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create Receipt</span>
          </Link>
        </div>

        {/* Filter */}
        <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-muted-gray" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Waiting">Waiting</option>
              <option value="Ready">Ready</option>
              <option value="Done">Done</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        </div>

        {/* Receipts List */}
        <div className="min-h-[400px]">
          {isLoading ? null : filteredReceipts.length > 0 ? (
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-primary/20">
                    <tr>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Receipt #</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Supplier</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Date</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Quantity</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Status</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReceipts.map((receipt, index) => (
                      <motion.tr
                        key={receipt._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                      >
                        <td className="font-paragraph text-foreground px-6 py-4 font-semibold">
                          {receipt.receiptNumber || 'N/A'}
                        </td>
                        <td className="font-paragraph text-foreground px-6 py-4">
                          {receipt.supplierName || 'N/A'}
                        </td>
                        <td className="font-paragraph text-muted-gray-foreground px-6 py-4">
                          {receipt.receiptDate
                            ? new Date(receipt.receiptDate).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="font-paragraph text-foreground px-6 py-4">
                          {receipt.totalQuantityReceived || 0}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-paragraph font-semibold ${getStatusColor(receipt.status)}`}>
                            {receipt.status || 'N/A'}
                          </span>
                        </td>
                        <td className="font-paragraph text-muted-gray-foreground px-6 py-4 max-w-xs truncate">
                          {receipt.notes || '-'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-12 text-center">
              <TrendingUp className="w-16 h-16 text-muted-gray mx-auto mb-4" />
              <p className="font-paragraph text-muted-gray-foreground">
                {statusFilter !== 'all'
                  ? 'No receipts found with this status'
                  : 'No receipts yet. Create your first receipt to track incoming stock.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
