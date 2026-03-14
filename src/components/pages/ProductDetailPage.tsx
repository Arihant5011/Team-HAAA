import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities';
import { ArrowLeft, Package, Edit, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Products | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const data = await BaseCrudService.getById<Products>('products', id!);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (stockLevel?: number) => {
    if (!stockLevel || stockLevel === 0) {
      return { label: 'Out of Stock', color: 'text-destructive', bgColor: 'bg-destructive/10' };
    }
    if (stockLevel < 10) {
      return { label: 'Low Stock', color: 'text-secondary', bgColor: 'bg-secondary/10' };
    }
    return { label: 'In Stock', color: 'text-accent-teal', bgColor: 'bg-accent-teal/10' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full max-w-[120rem] mx-auto px-8 py-16">
        <div className="min-h-[600px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <LoadingSpinner />
            </div>
          ) : !product ? (
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-12 text-center">
              <Package className="w-16 h-16 text-muted-gray mx-auto mb-4" />
              <p className="font-paragraph text-muted-gray-foreground mb-6">Product not found</p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-paragraph text-sm font-semibold hover:opacity-90 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Products</span>
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                <Link
                  to={`/products/${id}/edit`}
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-all duration-300 font-paragraph text-sm font-semibold"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Product</span>
                </Link>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-background/50 relative">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-24 h-24 text-muted-gray" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                      {product.name || 'Unnamed Product'}
                    </h1>
                    {product.description && (
                      <p className="font-paragraph text-muted-gray-foreground">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-paragraph text-sm text-muted-gray-foreground">
                        Stock Status
                      </span>
                      {(() => {
                        const status = getStockStatus(product.stockLevel);
                        return (
                          <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${status.bgColor} ${status.color} text-sm font-paragraph font-semibold`}>
                            {(product.stockLevel || 0) < 10 && <AlertTriangle className="w-4 h-4" />}
                            <span>{status.label}</span>
                          </span>
                        );
                      })()}
                    </div>
                    <div className="font-heading text-5xl font-bold text-foreground">
                      {product.stockLevel || 0}
                      <span className="text-2xl text-muted-gray-foreground ml-2">
                        {product.unitOfMeasure || 'units'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-paragraph text-sm text-muted-gray-foreground mb-1">
                          SKU
                        </p>
                        <p className="font-paragraph text-base text-foreground">
                          {product.sku || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-muted-gray-foreground mb-1">
                          Category
                        </p>
                        <p className="font-paragraph text-base text-primary">
                          {product.category || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-muted-gray-foreground mb-1">
                          Unit of Measure
                        </p>
                        <p className="font-paragraph text-base text-foreground">
                          {product.unitOfMeasure || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-muted-gray-foreground mb-1">
                          Created
                        </p>
                        <p className="font-paragraph text-base text-foreground">
                          {product._createdDate
                            ? new Date(product._createdDate).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
