// In guards.ts
import { Product } from "../models/product.model";
import { Category } from "../models/category.model";

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isProduct(product: any): product is Product {
  return (
    product &&
    typeof product.id === 'number' &&
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.price === 'number' &&
    typeof product.categoryId === 'number' &&
    (product.status === 'AVAILABLE' || product.status === 'UNAVAILABLE')
  );
}

export function isCategory(category: any): category is Category {
  return (
    category &&
    typeof category.id === 'number' &&
    typeof category.name === 'string' &&
    typeof category.description === 'string' &&
    (category.status === 'AVAILABLE' || category.status === 'UNAVAILABLE')
  );
}




