/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: deliveryorders
 * Interface for DeliveryOrders
 */
export interface DeliveryOrders {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  orderNumber?: string;
  /** @wixFieldType text */
  customerName?: string;
  /** @wixFieldType date */
  deliveryDate?: Date | string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType number */
  totalItems?: number;
  /** @wixFieldType number */
  totalQuantity?: number;
  /** @wixFieldType text */
  shippingAddress?: string;
}


/**
 * Collection ID: internaltransfers
 * Interface for InternalTransfers
 */
export interface InternalTransfers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  transferReference?: string;
  /** @wixFieldType text */
  sourceLocation?: string;
  /** @wixFieldType text */
  destinationLocation?: string;
  /** @wixFieldType text */
  productSKU?: string;
  /** @wixFieldType number */
  quantityTransferred?: number;
  /** @wixFieldType datetime */
  transferDate?: Date | string;
  /** @wixFieldType text */
  status?: string;
}


/**
 * Collection ID: products
 * Interface for Products
 */
export interface Products {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  sku?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  unitOfMeasure?: string;
  /** @wixFieldType number */
  stockLevel?: number;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  imageUrl?: string;
}


/**
 * Collection ID: receipts
 * Interface for Receipts
 */
export interface Receipts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  receiptNumber?: string;
  /** @wixFieldType text */
  supplierName?: string;
  /** @wixFieldType datetime */
  receiptDate?: Date | string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType number */
  totalQuantityReceived?: number;
  /** @wixFieldType text */
  notes?: string;
}


/**
 * Collection ID: stockadjustments
 * Interface for StockAdjustments
 */
export interface StockAdjustments {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  productName?: string;
  /** @wixFieldType text */
  locationName?: string;
  /** @wixFieldType number */
  countedQuantity?: number;
  /** @wixFieldType text */
  reason?: string;
  /** @wixFieldType datetime */
  adjustmentDate?: Date | string;
}


/**
 * Collection ID: warehouses
 * Interface for Warehouses
 */
export interface Warehouses {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  locationDetails?: string;
  /** @wixFieldType text */
  address?: string;
  /** @wixFieldType number */
  capacity?: number;
  /** @wixFieldType text */
  contactPerson?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
}
