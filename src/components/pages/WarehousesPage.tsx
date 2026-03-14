import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Warehouses } from '@/entities';
import { Plus, Warehouse, MapPin, Phone, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouses[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Warehouses>('warehouses');
      setWarehouses(result.items);
    } catch (error) {
      console.error('Error loading warehouses:', error);
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
              Warehouses
            </h1>
            <p className="font-paragraph text-muted-gray-foreground">
              Manage storage locations and facilities
            </p>
          </div>
          <Link
            to="/warehouses/new"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-paragraph text-sm font-semibold hover:opacity-90 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Warehouse</span>
          </Link>
        </div>

        {/* Warehouses Grid */}
        <div className="min-h-[400px]">
          {isLoading ? null : warehouses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warehouses.map((warehouse, index) => (
                <motion.div
                  key={warehouse._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Warehouse className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-semibold text-foreground">
                          {warehouse.name || 'Unnamed Warehouse'}
                        </h3>
                        {warehouse.isActive !== undefined && (
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-paragraph font-semibold ${
                            warehouse.isActive
                              ? 'bg-accent-teal/10 text-accent-teal'
                              : 'bg-muted-gray/10 text-muted-gray-foreground'
                          }`}>
                            {warehouse.isActive ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    {warehouse.address && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-muted-gray mt-1 flex-shrink-0" />
                        <p className="font-paragraph text-sm text-muted-gray-foreground">
                          {warehouse.address}
                        </p>
                      </div>
                    )}

                    {warehouse.locationDetails && (
                      <p className="font-paragraph text-sm text-muted-gray-foreground">
                        {warehouse.locationDetails}
                      </p>
                    )}

                    {warehouse.capacity !== undefined && (
                      <div className="pt-3 border-t border-primary/20">
                        <p className="font-paragraph text-xs text-muted-gray-foreground mb-1">
                          Capacity
                        </p>
                        <p className="font-heading text-2xl font-bold text-foreground">
                          {warehouse.capacity}
                        </p>
                      </div>
                    )}

                    {(warehouse.contactPerson || warehouse.phoneNumber) && (
                      <div className="pt-3 border-t border-primary/20 space-y-2">
                        {warehouse.contactPerson && (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-gray" />
                            <p className="font-paragraph text-sm text-foreground">
                              {warehouse.contactPerson}
                            </p>
                          </div>
                        )}
                        {warehouse.phoneNumber && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-gray" />
                            <p className="font-paragraph text-sm text-foreground">
                              {warehouse.phoneNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-primary/20 rounded-2xl p-12 text-center">
              <Warehouse className="w-16 h-16 text-muted-gray mx-auto mb-4" />
              <p className="font-paragraph text-muted-gray-foreground">
                No warehouses yet. Add your first warehouse to manage storage locations.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
