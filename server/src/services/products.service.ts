import { DB } from './db.service';
import { LoggerService } from './logger.service';
import { Product } from '../models/product.model';


export function getAllProducts(): Product[] {
  try {
    LoggerService.info("Fetching all products from database");
    const stmt = DB.prepare("SELECT * FROM products");
    const products = stmt.all() as Product[];
    LoggerService.info(`Successfully fetched ${products.length} products`);
    return products;
  } catch (error) {
    LoggerService.error("Error fetching all products: " + error);
    throw new Error("Failed to fetch products");
  }
}

export function getAvailableProducts(): Product[] {
  try {
    LoggerService.info("Fetching available products from database");
    const stmt = DB.prepare("SELECT * FROM products WHERE status = 'AVAILABLE'");
    const products = stmt.all() as Product[];
    LoggerService.info(`Successfully fetched ${products.length} available products`);
    return products;
  } catch (error) {
    LoggerService.error("Error fetching available products: " + error);
    throw new Error("Failed to fetch available products");
  }
}

export function getProductById(id: number): Product | null {
  try {
    LoggerService.info(`Fetching product with id ${id} from database`);
    const stmt = DB.prepare("SELECT * FROM products WHERE id = ?");
    const product = stmt.get(id) as Product | undefined;
    
    if (!product) {
      LoggerService.error(`Product with id ${id} not found`);
      return null;
    }
    
    LoggerService.info(`Successfully fetched product with id ${id}`);
    return product;
  } catch (error) {
    LoggerService.error(`Error fetching product with id ${id}: ` + error);
    throw new Error("Failed to fetch product");
  }
}

export function insertProduct(product: Omit<Product, 'id'>): Product {
  if (!product.name || !product.price || !product.categoryId) {
    LoggerService.error("Missing required fields for product creation");
    throw new Error("Name, price and categoryId are required");
  }

  try {
    LoggerService.info("Inserting new product into database");
    const stmt = DB.prepare(`
      INSERT INTO products (name, description, price, categoryId, status) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      product.name,
      product.description,
      product.price,
      product.categoryId,
      product.status || 'AVAILABLE'
    );
    const newId = Number(info.lastInsertRowid);
    LoggerService.info(`Successfully created product with id ${newId}`);
    return { id: newId, ...product };
  } catch (error) {
    LoggerService.error("Error inserting product: " + error);
    throw new Error("Failed to create product");
  }
}

export function updateProduct(product: Product): Product {
  if (!product.id || !product.name || !product.price || !product.categoryId) {
    LoggerService.error("Missing required fields for product update");
    throw new Error("ID, name, price and categoryId are required");
  }

  try {
    LoggerService.info(`Updating product with id ${product.id}`);
    const stmt = DB.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, categoryId = ?, status = ?
      WHERE id = ?
    `);
    const info = stmt.run(
      product.name,
      product.description,
      product.price,
      product.categoryId,
      product.status,
      product.id
    );
    
    if (info.changes === 0) {
      LoggerService.error(`Product with id ${product.id} not found for update`);
      throw new Error(`Product with id ${product.id} not found`);
    }
    
    LoggerService.info(`Successfully updated product with id ${product.id}`);
    return product;
  } catch (error) {
    LoggerService.error(`Error updating product with id ${product.id}: ` + error);
    throw new Error("Failed to update product");
  }
}

export function setProductUnavailable(id: number): boolean {
  try {
    LoggerService.info(`Setting product with id ${id} as unavailable`);
    const stmt = DB.prepare(`
      UPDATE products 
      SET status = 'UNAVAILABLE' 
      WHERE id = ?
    `);
    const info = stmt.run(id);
    
    if (info.changes === 0) {
      LoggerService.error(`Product with id ${id} not found for status update`);
      throw new Error(`Product with id ${id} not found`);
    }
    
    LoggerService.info(`Successfully set product with id ${id} as unavailable`);
    return info.changes > 0;
  } catch (error) {
    LoggerService.error(`Error setting product with id ${id} as unavailable: ` + error);
    throw new Error("Failed to set product as unavailable");
  }
}

export function setProductsUnavailableByCategory(categoryId: number): void {
    try {
      const stmt = DB.prepare(`
        UPDATE products 
        SET status = 'UNAVAILABLE' 
        WHERE categoryId = ?
      `);
      stmt.run(categoryId);
    } catch (error) {
      LoggerService.error(`Error setting products unavailable for category ${categoryId}: ` + error);
      throw new Error("Failed to update products status");
    }
  }