import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WarehouseFormPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    locationDetails: '',
    address: '',
    capacity: 0,
    contactPerson: '',
    phoneNumber: '',
    isActive: true
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await BaseCrudService.create('warehouses', {
        _id: crypto.randomUUID(),
        ...formData
      });
      navigate('/warehouses');
    } catch (error) {
      console.error('Error creating warehouse:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? Number(value) 
        : name === 'isActive' 
        ? value === 'true' 
        : value
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
              to="/warehouses"
              className="flex items-center space-x-2 text-muted-gray-foreground hover:text-primary transition-colors font-paragraph text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Warehouses</span>
            </Link>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8">
            Add New Warehouse
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Warehouse Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="e.g., Main Warehouse"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="Enter full address"
                />
              </div>

              {/* Location Details */}
              <div className="md:col-span-2">
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Location Details
                </label>
                <textarea
                  name="locationDetails"
                  value={formData.locationDetails}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors resize-none"
                  placeholder="Additional location information"
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="0"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Status *
                </label>
                <select
                  name="isActive"
                  value={formData.isActive.toString()}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Contact Person */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="Enter contact name"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-primary/20">
              <Link
                to="/warehouses"
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
                    <span>Add Warehouse</span>
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
