import { DB } from './db.service';
import { LoggerService } from './logger.service';
import { Category } from '../models/category.model';

export function getAllCategories(): Category[] {
  try {
    LoggerService.info("Fetching all categories from database");
    const stmt = DB.prepare("SELECT * FROM categories");
    const categories = stmt.all() as Category[];
    LoggerService.info(`Successfully fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    LoggerService.error("Error fetching all categories: " + error);
    throw new Error("Failed to fetch categories");
  }
}

export function getAvailableCategories(): Category[] {
  try {
    LoggerService.info("Fetching available categories from database");
    const stmt = DB.prepare("SELECT * FROM categories WHERE status = 'AVAILABLE'");
    const categories = stmt.all() as Category[];
    LoggerService.info(`Successfully fetched ${categories.length} available categories`);
    return categories;
  } catch (error) {
    LoggerService.error("Error fetching available categories: " + error);
    throw new Error("Failed to fetch available categories");
  }
}

export function getCategoryById(id: number): Category | null {
  try {
    LoggerService.info(`Fetching category with id ${id} from database`);
    const stmt = DB.prepare("SELECT * FROM categories WHERE id = ?");
    const category = stmt.get(id) as Category | undefined;
    
    if (!category) {
      LoggerService.error(`Category with id ${id} not found`);
      return null;
    }
    
    LoggerService.info(`Successfully fetched category with id ${id}`);
    return category;
  } catch (error) {
    LoggerService.error(`Error fetching category with id ${id}: ` + error);
    throw new Error("Failed to fetch category");
  }
}

export function insertCategory(category: Omit<Category, 'id'>): Category {
  if (!category.name) {
    LoggerService.error("Missing required fields for category creation");
    throw new Error("Name is required");
  }

  try {
    LoggerService.info("Inserting new category into database");
    const stmt = DB.prepare(`
      INSERT INTO categories (name, description, status) 
      VALUES (?, ?, ?)
    `);
    const info = stmt.run(
      category.name,
      category.description || '',
      category.status || 'AVAILABLE'
    );
    const newId = Number(info.lastInsertRowid);
    LoggerService.info(`Successfully created category with id ${newId}`);
    return { id: newId, ...category };
  } catch (error) {
    LoggerService.error("Error inserting category: " + error);
    throw new Error("Failed to create category");
  }
}

export function updateCategory(category: Category): Category {
  if (!category.id || !category.name) {
    LoggerService.error("Missing required fields for category update");
    throw new Error("ID and name are required");
  }

  try {
    LoggerService.info(`Updating category with id ${category.id}`);
    const stmt = DB.prepare(`
      UPDATE categories 
      SET name = ?, description = ?, status = ?
      WHERE id = ?
    `);
    const info = stmt.run(
      category.name,
      category.description,
      category.status,
      category.id
    );
    
    if (info.changes === 0) {
      LoggerService.error(`Category with id ${category.id} not found for update`);
      throw new Error(`Category with id ${category.id} not found`);
    }
    
    LoggerService.info(`Successfully updated category with id ${category.id}`);
    return category;
  } catch (error) {
    LoggerService.error(`Error updating category with id ${category.id}: ` + error);
    throw new Error("Failed to update category");
  }
}

export function setCategoryUnavailable(id: number): boolean {
  try {
    LoggerService.info(`Setting category with id ${id} as unavailable`);
    const stmt = DB.prepare(`
      UPDATE categories 
      SET status = 'UNAVAILABLE' 
      WHERE id = ?
    `);
    const info = stmt.run(id);
    
    if (info.changes === 0) {
      LoggerService.error(`Category with id ${id} not found for status update`);
      throw new Error(`Category with id ${id} not found`);
    }
    
    LoggerService.info(`Successfully set category with id ${id} as unavailable`);
    return info.changes > 0;
  } catch (error) {
    LoggerService.error(`Error setting category with id ${id} as unavailable: ` + error);
    throw new Error("Failed to set category as unavailable");
  }
}