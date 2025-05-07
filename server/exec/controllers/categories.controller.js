"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesController = void 0;
const express_1 = require("express");
const guards_1 = require("../utils/guards");
const logger_service_1 = require("../services/logger.service");
const products_service_1 = require("../services/products.service");
exports.categoriesController = (0, express_1.Router)();
// Mock data
let categories = [
    { id: 1, name: "Furniture", description: "Various furniture items", status: 'AVAILABLE' },
    { id: 2, name: "Lighting", description: "Lamps and light fixtures", status: 'AVAILABLE' },
    { id: 3, name: "Decor", description: "Home decoration items", status: 'AVAILABLE' }
];
// Get all categories (for any user)
exports.categoriesController.get("/", (req, res) => {
    logger_service_1.LoggerService.info("[GET] /categories/");
    try {
        const categoryDTOs = categories
            .filter(c => c.status === 'AVAILABLE')
            .map(c => ({ id: c.id, name: c.name }));
        res.status(200).json(categoryDTOs);
    }
    catch (error) {
        logger_service_1.LoggerService.error("Error fetching categories: " + error);
        res.status(500).json({ error: 'Error while fetching categories.' });
    }
});
// Get basic category info (for any user)
exports.categoriesController.get("/basic/:id", (req, res) => {
    const id = parseInt(req.params.id);
    logger_service_1.LoggerService.info(`[GET] /categories/basic/${id}`);
    if (!(0, guards_1.isNumber)(id)) {
        logger_service_1.LoggerService.error("ID must be a number");
        return res.status(400).send("ID must be a number");
    }
    try {
        const category = categories.find(c => c.id === id);
        if (!category || category.status !== 'AVAILABLE') {
            logger_service_1.LoggerService.error(`Category with id ${id} not found or unavailable`);
            return res.status(404).send("Category not found");
        }
        const categoryDTO = {
            id: category.id,
            name: category.name
        };
        res.status(200).json(categoryDTO);
    }
    catch (error) {
        logger_service_1.LoggerService.error(`Error fetching category with id ${id}: ` + error);
        res.status(500).json({ error: "Error while fetching category." });
    }
});
// ADMIN ROUTES
// Get all categories (including unavailable - admin only)
exports.categoriesController.get("/admin", (req, res) => {
    logger_service_1.LoggerService.info("[GET] /categories/admin");
    try {
        res.status(200).json(categories);
    }
    catch (error) {
        logger_service_1.LoggerService.error("Error fetching all categories: " + error);
        res.status(500).json({ error: 'Error while fetching all categories.' });
    }
});
// Add new category (admin only)
exports.categoriesController.post("/admin", (req, res) => {
    logger_service_1.LoggerService.info("[POST] /categories/admin");
    try {
        const category = req.body;
        if (!(0, guards_1.isCategory)(category)) {
            logger_service_1.LoggerService.error("Invalid category data");
            return res.status(400).send("Invalid category data");
        }
        category.id = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        category.status = 'AVAILABLE';
        categories.push(category);
        logger_service_1.LoggerService.info(`Category created with id ${category.id}`);
        res.status(201).json(category);
    }
    catch (error) {
        logger_service_1.LoggerService.error("Error creating category: " + error);
        res.status(500).json({ error: "Error while creating category." });
    }
});
// Update category (admin only)
exports.categoriesController.put("/admin/:id", (req, res) => {
    const id = parseInt(req.params.id);
    logger_service_1.LoggerService.info(`[PUT] /categories/admin/${id}`);
    try {
        const updatedCategory = req.body;
        if (!(0, guards_1.isNumber)(id) || !(0, guards_1.isCategory)(updatedCategory) || id !== updatedCategory.id) {
            logger_service_1.LoggerService.error("Invalid data for category update");
            return res.status(400).send("Invalid data");
        }
        const index = categories.findIndex(c => c.id === id);
        if (index === -1) {
            logger_service_1.LoggerService.error(`Category with id ${id} not found for update`);
            return res.status(404).send("Category not found");
        }
        categories[index] = updatedCategory;
        logger_service_1.LoggerService.info(`Category with id ${id} updated`);
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        logger_service_1.LoggerService.error(`Error updating category with id ${id}: ` + error);
        res.status(500).json({ error: "Error while updating category." });
    }
});
// Set category as unavailable (admin only)
exports.categoriesController.delete("/admin/:id", (req, res) => {
    const id = parseInt(req.params.id);
    logger_service_1.LoggerService.info(`[DELETE] /categories/admin/${id}`);
    try {
        if (!(0, guards_1.isNumber)(id)) {
            logger_service_1.LoggerService.error("Invalid category ID");
            return res.status(400).send("ID must be a number");
        }
        const category = categories.find(c => c.id === id);
        if (!category) {
            logger_service_1.LoggerService.error(`Category with id ${id} not found`);
            return res.status(404).send("Category not found");
        }
        // Set category as unavailable
        category.status = 'UNAVAILABLE';
        // Set all products in this category as unavailable via service
        (0, products_service_1.setProductsUnavailableByCategory)(id);
        logger_service_1.LoggerService.info(`Category with id ${id} and its products set to unavailable`);
        res.status(200).json(category);
    }
    catch (error) {
        logger_service_1.LoggerService.error(`Error setting category with id ${id} as unavailable: ` + error);
        res.status(500).json({ error: "Error while setting category unavailable." });
    }
});
