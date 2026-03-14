import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DeliveryFormPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    status: 'Draft',
    totalItems: 0,
    totalQuantity: 0,
    shippingAddress: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await BaseCrudService.create('deliveryorders', {
        _id: crypto.randomUUID(),
        ...formData,
        deliveryDate: new Date(formData.deliveryDate).toISOString()
      });
      navigate('/deliveries');
    } catch (error) {
      console.error('Error creating delivery:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalItems' || name === 'totalQuantity' ? Number(value) : value
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
              to="/deliveries"
              className="flex items-center space-x-2 text-muted-gray-foreground hover:text-primary transition-colors font-paragraph text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Deliveries</span>
            </Link>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8">
            Create Delivery Order
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Number */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Order Number *
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="e.g., DO-001"
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="Enter customer name"
                />
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
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

              {/* Total Items */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Total Items *
                </label>
                <input
                  type="number"
                  name="totalItems"
                  value={formData.totalItems}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="0"
                />
              </div>

              {/* Total Quantity */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Total Quantity *
                </label>
                <input
                  type="number"
                  name="totalQuantity"
                  value={formData.totalQuantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="0"
                />
              </div>

              {/* Shipping Address */}
              <div className="md:col-span-2">
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Shipping Address *
                </label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors resize-none"
                  placeholder="Enter complete shipping address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-primary/20">
              <Link
                to="/deliveries"
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
                    <span>Create Delivery</span>
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
