"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = getAllCategories;
exports.getAvailableCategories = getAvailableCategories;
exports.getCategoryById = getCategoryById;
exports.insertCategory = insertCategory;
exports.updateCategory = updateCategory;
exports.setCategoryUnavailable = setCategoryUnavailable;
const db_service_1 = require("./db.service");
const logger_service_1 = require("./logger.service");
function getAllCategories() {
    try {
        logger_service_1.LoggerService.info("Fetching all categories from database");
        const stmt = db_service_1.DB.prepare("SELECT * FROM categories");
        const categories = stmt.all();
        logger_service_1.LoggerService.info(`Successfully fetched ${categories.length} categories`);
        return categories;
    }
    catch (error) {
        logger_service_1.LoggerService.error("Error fetching all categories: " + error);
        throw new Error("Failed to fetch categories");
    }
}
function getAvailableCategories() {
    try {
        logger_service_1.LoggerService.info("Fetching available categories from database");
        const stmt = db_service_1.DB.prepare("SELECT * FROM categories WHERE status = 'AVAILABLE'");
        const categories = stmt.all();
        logger_service_1.LoggerService.info(`Successfully fetched ${categories.length} available categories`);
        return categories;
    }
    catch (error) {
        logger_service_1.LoggerService.error("Error fetching available categories: " + error);
        throw new Error("Failed to fetch available categories");
    }
}
function getCategoryById(id) {
    try {
        logger_service_1.LoggerService.info(`Fetching category with id ${id} from database`);
        const stmt = db_service_1.DB.prepare("SELECT * FROM categories WHERE id = ?");
        const category = stmt.get(id);
        if (!category) {
            logger_service_1.LoggerService.error(`Category with id ${id} not found`);
            return null;
        }
        logger_service_1.LoggerService.info(`Successfully fetched category with id ${id}`);
        return category;
    }
    catch (error) {
        logger_service_1.LoggerService.error(`Error fetching category with id ${id}: ` + error);
        throw new Error("Failed to fetch category");
    }
}
function insertCategory(category) {
    if (!category.name) {
        logger_service_1.LoggerService.error("Missing required fields for category creation");
        throw new Error("Name is required");
    }
    try {
        logger_service_1.LoggerService.info("Inserting new category into database");
        const stmt = db_service_1.DB.prepare(`
      INSERT INTO categories (name, description, status) 
      VALUES (?, ?, ?)
    `);
        const info = stmt.run(category.name, category.description || '', category.status || 'AVAILABLE');
        const newId = Number(info.lastInsertRowid);
        logger_service_1.LoggerService.info(`Successfully created category with id ${newId}`);
        return { id: newId, ...category };
    }
    catch (error) {
        logger_service_1.LoggerService.error("Error inserting category: " + error);
        throw new Error("Failed to create category");
    }
}
function updateCategory(category) {
    if (!category.id || !category.name) {
        logger_service_1.LoggerService.error("Missing required fields for category update");
        throw new Error("ID and name are required");
    }
    try {
        logger_service_1.LoggerService.info(`Updating category with id ${category.id}`);
        const stmt = db_service_1.DB.prepare(`
      UPDATE categories 
      SET name = ?, description = ?, status = ?
      WHERE id = ?
    `);
        const info = stmt.run(category.name, category.description, category.status, category.id);
        if (info.changes === 0) {
            logger_service_1.LoggerService.error(`Category with id ${category.id} not found for update`);
            throw new Error(`Category with id ${category.id} not found`);
        }
        logger_service_1.LoggerService.info(`Successfully updated category with id ${category.id}`);
        return category;
    }
    catch (error) {
        logger_service_1.LoggerService.error(`Error updating category with id ${category.id}: ` + error);
        throw new Error("Failed to update category");
    }
}
function setCategoryUnavailable(id) {
    try {
        logger_service_1.LoggerService.info(`Setting category with id ${id} as unavailable`);
        const stmt = db_service_1.DB.prepare(`
      UPDATE categories 
      SET status = 'UNAVAILABLE' 
      WHERE id = ?
    `);
        const info = stmt.run(id);
        if (info.changes === 0) {
            logger_service_1.LoggerService.error(`Category with id ${id} not found for status update`);
            throw new Error(`Category with id ${id} not found`);
        }
        logger_service_1.LoggerService.info(`Successfully set category with id ${id} as unavailable`);
        return info.changes > 0;
    }
    catch (error) {
        logger_service_1.LoggerService.error(`Error setting category with id ${id} as unavailable: ` + error);
        throw new Error("Failed to set category as unavailable");
    }
}
