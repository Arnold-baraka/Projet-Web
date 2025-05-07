"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = getAllProducts;
exports.getAvailableProducts = getAvailableProducts;
exports.getProductById = getProductById;
exports.insertProduct = insertProduct;
exports.updateProduct = updateProduct;
exports.setProductUnavailable = setProductUnavailable;
exports.setProductsUnavailableByCategory = setProductsUnavailableByCategory;
const db_service_1 = require("./db.service");
const logger_service_1 = require("./logger.service");
function getAllProducts() {
    try {
        logger_service_1.LoggerService.info("Fetching all products from database");
        const stmt = db_service_1.DB.prepare("SELECT * FROM products");
        const products = stmt.all();
        logger_service_1.LoggerService.info(`Successfully fetched ${products.length} products`);
        return products;
    }
    catch (error) {
        logger_service_1.LoggerService.error("Error fetching all products: " + error);
        throw new Error("Failed to fetch products");
    }
}
function getAvailableProducts() {
    try {
        logger_service_1.LoggerService.info("Fetching available products from database");
        const stmt = db_service_1.DB.prepare("SELECT * FROM products WHERE status = 'AVAILABLE'");
        const products = stmt.all();
        logger_service_1.LoggerService.info(`Successfully fetched ${products.length} available products`);
        return products;
    }
    catch (error) {
        logger_service_1.LoggerService.error("Error fetching available products: " + error);
        throw new Error("Failed to fetch available products");
    }
}
function getProductById(id) {
    try {
        logger_service_1.LoggerService.info(`Fetching product with id ${id} from database`);
        const stmt = db_service_1.DB.prepare("SELECT * FROM products WHERE id = ?");
        const product = stmt.get(id);
        if (!product) {
            logger_service_1.LoggerService.error(`Product with id ${id} not found`);
            return null;
        }
        logger_service_1.LoggerService.info(`Successfully fetched product with id ${id}`);
        return product;
    }
    catch (error) {
        logger_service_1.LoggerService.error(`Error fetching product with id ${id}: ` + error);
        throw new Error("Failed to fetch product");
    }
}
function insertProduct(product) {
    if (!product.name || !product.price || !product.categoryId) {
        logger_service_1.LoggerService.error("Missing required fields for product creation");
        throw new Error("Name, price and categoryId are required");
    }
    try {
        logger_service_1.LoggerService.info("Inserting new product into database");
        const stmt = db_service_1.DB.prepare(`
      INSERT INTO products (name, description, price, categoryId, status) 
      VALUES (?, ?, ?, ?, ?)
    `);
        const info = stmt.run(product.name, product.description, product.price, product.categoryId, product.status || 'AVAILABLE');
        const newId = Number(info.lastInsertRowid);
        logger_service_1.LoggerService.info(`Successfully created product with id ${newId}`);
        return { id: newId, ...product };
    }
    catch (error) {
        logger_service_1.LoggerService.error("Error inserting product: " + error);
        throw new Error("Failed to create product");
    }
}
function updateProduct(product) {
    if (!product.id || !product.name || !product.price || !product.categoryId) {
        logger_service_1.LoggerService.error("Missing required fields for product update");
        throw new Error("ID, name, price and categoryId are required");
    }
    try {
        logger_service_1.LoggerService.info(`Updating product with id ${product.id}`);
        const stmt = db_service_1.DB.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, categoryId = ?, status = ?
      WHERE id = ?
    `);
        const info = stmt.run(product.name, product.description, product.price, product.categoryId, product.status, product.id);
        if (info.changes === 0) {
            logger_service_1.LoggerService.error(`Product with id ${product.id} not found for update`);
            throw new Error(`Product with id ${product.id} not found`);
        }
        logger_service_1.LoggerService.info(`Successfully updated product with id ${product.id}`);
        return product;
    }
    catch (error) {
        logger_service_1.LoggerService.error(`Error updating product with id ${product.id}: ` + error);
        throw new Error("Failed to update product");
    }
}
function setProductUnavailable(id) {
    try {
        logger_service_1.LoggerService.info(`Setting product with id ${id} as unavailable`);
        const stmt = db_service_1.DB.prepare(`
      UPDATE products 
      SET status = 'UNAVAILABLE' 
      WHERE id = ?
    `);
        const info = stmt.run(id);
        if (info.changes === 0) {
            logger_service_1.LoggerService.error(`Product with id ${id} not found for status update`);
            throw new Error(`Product with id ${id} not found`);
        }
        logger_service_1.LoggerService.info(`Successfully set product with id ${id} as unavailable`);
        return info.changes > 0;
    }
    catch (error) {
        logger_service_1.LoggerService.error(`Error setting product with id ${id} as unavailable: ` + error);
        throw new Error("Failed to set product as unavailable");
    }
}
function setProductsUnavailableByCategory(categoryId) {
    try {
        const stmt = db_service_1.DB.prepare(`
        UPDATE products 
        SET status = 'UNAVAILABLE' 
        WHERE categoryId = ?
      `);
        stmt.run(categoryId);
    }
    catch (error) {
        logger_service_1.LoggerService.error(`Error setting products unavailable for category ${categoryId}: ` + error);
        throw new Error("Failed to update products status");
    }
}
