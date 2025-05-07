"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = void 0;
/**
 * This file contains all the logic for the products controller
 */
const express_1 = require("express");
const guards_1 = require("../utils/guards");
const logger_service_1 = require("../services/logger.service");
const products_service_1 = require("../services/products.service");
exports.productsController = (0, express_1.Router)();
// Get all available products (for any user)
exports.productsController.get("/", (req, res) => {
    logger_service_1.LoggerService.info("[GET] /products/");
    try {
        const products = (0, products_service_1.getAvailableProducts)();
        const productDTOs = products.map(p => ({
            id: p.id, // Non-null assertion since we know products from DB have ids
            name: p.name,
            price: p.price
        }));
        res.status(200).json(productDTOs);
    }
    catch (error) {
        logger_service_1.LoggerService.error("Database error: " + error);
        res.status(500).json({ error: 'Error while fetching available products.' });
    }
});
// Get basic product info (for any user)
exports.productsController.get("/basic/:id", (req, res) => {
    const id = parseInt(req.params.id);
    logger_service_1.LoggerService.info(`[GET] /products/basic/${id}`);
    if (!(0, guards_1.isNumber)(id)) {
        logger_service_1.LoggerService.error("ID must be a number");
        return res.status(400).send("ID must be a number");
    }
    try {
        const product = (0, products_service_1.getProductById)(id);
        if (!product || product.status !== 'AVAILABLE') {
            return res.status(404).json({ error: "Product not found or unavailable" });
        }
        const productDTO = {
            id: product.id, // Non-null assertion since we know existing products have ids
            name: product.name,
            price: product.price
        };
        res.status(200).json(productDTO);
    }
    catch (error) {
        logger_service_1.LoggerService.error("Database error: " + error);
        res.status(500).json({ error: "Error while fetching product." });
    }
});
// Get detailed product info (for any user)
exports.productsController.get("/detail/:id", (req, res) => {
    const id = parseInt(req.params.id);
    logger_service_1.LoggerService.info(`[GET] /products/detail/${id}`);
    if (!(0, guards_1.isNumber)(id)) {
        logger_service_1.LoggerService.error("ID must be a number");
        return res.status(400).send("ID must be a number");
    }
    try {
        const product = (0, products_service_1.getProductById)(id);
        if (!product || product.status !== 'AVAILABLE') {
            return res.status(404).json({ error: "Product not found or unavailable" });
        }
        const fullProductDTO = {
            id: product.id, // Non-null assertion since we know existing products have ids
            name: product.name,
            price: product.price,
            description: product.description,
            categoryId: product.categoryId,
            status: product.status
        };
        res.status(200).json(fullProductDTO);
    }
    catch (error) {
        logger_service_1.LoggerService.error("Database error: " + error);
        res.status(500).json({ error: "Error while fetching product details." });
    }
});
// ADMIN ROUTES
// Get all products (including unavailable - admin only)
exports.productsController.get("/admin", (req, res) => {
    logger_service_1.LoggerService.info("[GET] /products/admin");
    try {
        const products = (0, products_service_1.getAllProducts)();
        res.status(200).json(products);
    }
    catch (error) {
        logger_service_1.LoggerService.error("Database error: " + error);
        res.status(500).json({ error: 'Error while fetching all products.' });
    }
});
// Add new product (admin only)
exports.productsController.post("/admin", (req, res) => {
    logger_service_1.LoggerService.info("[POST] /products/admin");
    try {
        const newProduct = req.body;
        if (!newProduct || Object.keys(newProduct).length === 0) {
            logger_service_1.LoggerService.error("Invalid product data");
            return res.status(400).send("Product data is required");
        }
        if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
            logger_service_1.LoggerService.error("Missing required fields");
            return res.status(400).send("Name, price and categoryId are required");
        }
        const createdProduct = (0, products_service_1.insertProduct)({
            ...newProduct,
            status: 'AVAILABLE'
        });
        logger_service_1.LoggerService.info("Product created successfully");
        res.status(201).json(createdProduct);
    }
    catch (error) {
        logger_service_1.LoggerService.error("Database error: " + error);
        res.status(500).json({ error: "Error while creating product." });
    }
});
// Update product (admin only)
exports.productsController.put("/admin/:id", (req, res) => {
    const id = parseInt(req.params.id);
    logger_service_1.LoggerService.info(`[PUT] /products/admin/${id}`);
    if (!(0, guards_1.isNumber)(id)) {
        logger_service_1.LoggerService.error("ID must be a number");
        return res.status(400).send("ID must be a number");
    }
    try {
        const productUpdate = req.body;
        if (!(0, guards_1.isProduct)(productUpdate)) {
            logger_service_1.LoggerService.error("Invalid product data");
            return res.status(400).send("Invalid product data");
        }
        if (id !== productUpdate.id) {
            logger_service_1.LoggerService.error("ID mismatch");
            return res.status(400).send("ID in path doesn't match product ID");
        }
        const updatedProduct = (0, products_service_1.updateProduct)(productUpdate);
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        logger_service_1.LoggerService.error("Database error: " + error);
        res.status(500).json({ error: "Error while updating product." });
    }
});
// Set product as unavailable (admin only)
exports.productsController.delete("/admin/:id", (req, res) => {
    const id = parseInt(req.params.id);
    logger_service_1.LoggerService.info(`[DELETE] /products/admin/${id}`);
    if (!(0, guards_1.isNumber)(id)) {
        logger_service_1.LoggerService.error("Invalid or missing id");
        return res.status(400).send("Invalid or missing id");
    }
    try {
        const success = (0, products_service_1.setProductUnavailable)(id);
        res.status(200).json({ success });
    }
    catch (error) {
        logger_service_1.LoggerService.error("Database error: " + error);
        res.status(500).json({ error: "Error while setting product unavailable." });
    }
});
