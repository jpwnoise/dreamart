export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  featured:boolean,
  price: number;
  inventory: number;
  sku: string;
  image?: string;
  active:boolean
}