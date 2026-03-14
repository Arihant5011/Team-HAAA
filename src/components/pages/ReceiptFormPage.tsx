import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReceiptFormPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    receiptNumber: '',
    supplierName: '',
    receiptDate: new Date().toISOString().split('T')[0],
    status: 'Draft',
    totalQuantityReceived: 0,
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await BaseCrudService.create('receipts', {
        _id: crypto.randomUUID(),
        ...formData,
        receiptDate: new Date(formData.receiptDate).toISOString()
      });
      navigate('/receipts');
    } catch (error) {
      console.error('Error creating receipt:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalQuantityReceived' ? Number(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[120rem] mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/receipts"
              className="flex items-center space-x-2 text-muted-gray-foreground hover:text-primary transition-colors font-paragraph text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Receipts</span>
            </Link>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8">
            Create Receipt
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Receipt Number */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Receipt Number *
                </label>
                <input
                  type="text"
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="e.g., RCP-001"
                />
              </div>

              {/* Supplier Name */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="Enter supplier name"
                />
              </div>

              {/* Receipt Date */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Receipt Date *
                </label>
                <input
                  type="date"
                  name="receiptDate"
                  value={formData.receiptDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                >
                  <option value="Draft">Draft</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Ready">Ready</option>
                  <option value="Done">Done</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>

              {/* Total Quantity */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Total Quantity Received *
                </label>
                <input
                  type="number"
                  name="totalQuantityReceived"
                  value={formData.totalQuantityReceived}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="0"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors resize-none"
                  placeholder="Additional notes or comments"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-primary/20">
              <Link
                to="/receipts"
                className="px-6 py-3 rounded-lg border border-muted-gray text-muted-gray-foreground hover:bg-muted-gray/10 transition-all duration-300 font-paragraph text-sm font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-paragraph text-sm font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create Receipt</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
