export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  inventory: number;
  sku: string;
  status: 'activo' | 'inactivo';
  image?: string;
}