import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';

export default function ProductsPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, products]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Products>('products');
      setProducts(result.items);
      
      const uniqueCategories = Array.from(
        new Set(result.items.map(p => p.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        p =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const getStockStatus = (stockLevel?: number) => {
    if (!stockLevel || stockLevel === 0) {
      return { label: 'Out of Stock', color: 'text-destructive' };
    }
    if (stockLevel < 10) {
      return { label: 'Low Stock', color: 'text-secondary' };
    }
    return { label: 'In Stock', color: 'text-accent-teal' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[120rem] mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
              Products
            </h1>
            <p className="font-paragraph text-muted-gray-foreground">
              Manage your inventory catalog
            </p>
          </div>
          <Link
            to="/products/new"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-paragraph text-sm font-semibold hover:opacity-90 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-gray" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground font-paragraph text-sm focus:outline-none focus:border-primary/40 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="min-h-[400px]">
          {isLoading ? null : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.stockLevel);
                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/products/${product._id}`}>
                      <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 h-full">
                        {/* Image */}
                        <div className="aspect-square bg-background/50 relative overflow-hidden">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-16 h-16 text-muted-gray" />
                            </div>
                          )}
                          {/* Stock Badge */}
                          <div className="absolute top-3 right-3">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-background/90 backdrop-blur-sm ${stockStatus.color} text-xs font-paragraph font-semibold`}>
                              {(product.stockLevel || 0) < 10 && <AlertTriangle className="w-3 h-3" />}
                              <span>{stockStatus.label}</span>
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-1">
                            {product.name || 'Unnamed Product'}
                          </h3>
                          <p className="font-paragraph text-sm text-muted-gray-foreground mb-3">
                            SKU: {product.sku || 'N/A'}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-paragraph text-xs text-muted-gray-foreground mb-1">
                                Stock Level
                              </p>
                              <p className="font-heading text-2xl font-bold text-foreground">
                                {product.stockLevel || 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-paragraph text-xs text-muted-gray-foreground mb-1">
                                Category
                              </p>
                              <p className="font-paragraph text-sm text-primary">
                                {product.category || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-12 text-center">
              <Package className="w-16 h-16 text-muted-gray mx-auto mb-4" />
              <p className="font-paragraph text-muted-gray-foreground">
                {searchTerm || categoryFilter !== 'all'
                  ? 'No products found matching your filters'
                  : 'No products yet. Add your first product to get started.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
