import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitOfMeasure: '',
    stockLevel: 0,
    description: '',
    imageUrl: 'https://static.wixstatic.com/media/2f504b_bd6c997ec4204cd29e6075f499e80efb~mv2.png?originWidth=384&originHeight=384'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const data = await BaseCrudService.getById<Products>('products', id!);
      if (data) {
        setFormData({
          name: data.name || '',
          sku: data.sku || '',
          category: data.category || '',
          unitOfMeasure: data.unitOfMeasure || '',
          stockLevel: data.stockLevel || 0,
          description: data.description || '',
          imageUrl: data.imageUrl || 'https://static.wixstatic.com/media/2f504b_4d4c5e0caf59481c98bd33ceef09b511~mv2.png?originWidth=384&originHeight=384'
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEdit) {
        await BaseCrudService.update<Products>('products', {
          _id: id!,
          ...formData
        });
      } else {
        await BaseCrudService.create('products', {
          _id: crypto.randomUUID(),
          ...formData
        });
      }
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stockLevel' ? Number(value) : value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full max-w-[120rem] mx-auto px-8 py-16">
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
              to="/products"
              className="flex items-center space-x-2 text-muted-gray-foreground hover:text-primary transition-colors font-paragraph text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </Link>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="Enter product name"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  SKU / Code *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="Enter SKU"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="e.g., Electronics, Raw Materials"
                />
              </div>

              {/* Unit of Measure */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Unit of Measure *
                </label>
                <input
                  type="text"
                  name="unitOfMeasure"
                  value={formData.unitOfMeasure}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="e.g., kg, units, liters"
                />
              </div>

              {/* Stock Level */}
              <div>
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Initial Stock Level
                </label>
                <input
                  type="number"
                  name="stockLevel"
                  value={formData.stockLevel}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="0"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block font-paragraph text-sm text-muted-gray-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors resize-none"
                  placeholder="Enter product description"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-primary/20">
              <Link
                to="/products"
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEdit ? 'Update Product' : 'Create Product'}</span>
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
