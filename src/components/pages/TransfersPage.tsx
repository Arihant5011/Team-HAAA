import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { InternalTransfers } from '@/entities';
import { Plus, ArrowRightLeft, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<InternalTransfers[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<InternalTransfers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadTransfers();
  }, []);

  useEffect(() => {
    filterTransfers();
  }, [statusFilter, transfers]);

  const loadTransfers = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<InternalTransfers>('internaltransfers');
      setTransfers(result.items);
    } catch (error) {
      console.error('Error loading transfers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransfers = () => {
    if (statusFilter === 'all') {
      setFilteredTransfers(transfers);
    } else {
      setFilteredTransfers(transfers.filter(t => t.status === statusFilter));
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
              Internal Transfers
            </h1>
            <p className="font-paragraph text-muted-gray-foreground">
              Stock movements between locations
            </p>
          </div>
          <Link
            to="/transfers/new"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-paragraph text-sm font-semibold hover:opacity-90 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Create Transfer</span>
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

        {/* Transfers List */}
        <div className="min-h-[400px]">
          {isLoading ? null : filteredTransfers.length > 0 ? (
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-primary/20">
                    <tr>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Reference</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">From</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">To</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Product SKU</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Quantity</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Date</th>
                      <th className="font-paragraph text-sm text-muted-gray-foreground text-left px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransfers.map((transfer, index) => (
                      <motion.tr
                        key={transfer._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                      >
                        <td className="font-paragraph text-foreground px-6 py-4 font-semibold">
                          {transfer.transferReference || 'N/A'}
                        </td>
                        <td className="font-paragraph text-foreground px-6 py-4">
                          {transfer.sourceLocation || 'N/A'}
                        </td>
                        <td className="font-paragraph text-foreground px-6 py-4">
                          {transfer.destinationLocation || 'N/A'}
                        </td>
                        <td className="font-paragraph text-muted-gray-foreground px-6 py-4">
                          {transfer.productSKU || 'N/A'}
                        </td>
                        <td className="font-paragraph text-foreground px-6 py-4">
                          {transfer.quantityTransferred || 0}
                        </td>
                        <td className="font-paragraph text-muted-gray-foreground px-6 py-4">
                          {transfer.transferDate
                            ? new Date(transfer.transferDate).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-paragraph font-semibold ${getStatusColor(transfer.status)}`}>
                            {transfer.status || 'N/A'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-12 text-center">
              <ArrowRightLeft className="w-16 h-16 text-muted-gray mx-auto mb-4" />
              <p className="font-paragraph text-muted-gray-foreground">
                {statusFilter !== 'all'
                  ? 'No transfers found with this status'
                  : 'No internal transfers yet. Create your first transfer to move stock between locations.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
