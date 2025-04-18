"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesController = void 0;
const express_1 = require("express");
const guards_1 = require("../utils/guards");
const products_controller_1 = require("./products.controller");
exports.categoriesController = (0, express_1.Router)();
// Mock data
let categories = [
    { id: 1, name: "Furniture", description: "Various furniture items", status: 'AVAILABLE' },
    { id: 2, name: "Lighting", description: "Lamps and light fixtures", status: 'AVAILABLE' },
    { id: 3, name: "Decor", description: "Home decoration items", status: 'AVAILABLE' }
];
// Get all categories (for any user)
exports.categoriesController.get("/", (req, res) => {
    console.log("[GET] /categories/");
    const categoryDTOs = categories
        .filter(c => c.status === 'AVAILABLE')
        .map(c => ({ id: c.id, name: c.name }));
    res.json(categoryDTOs).status(200);
});
// Get basic category info (for any user)
exports.categoriesController.get("/basic/:id", (req, res) => {
    console.log("[GET] /categories/basic/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        return res.status(400).send("ID must be a number");
    }
    const category = categories.find(c => c.id === id);
    if (!category || category.status !== 'AVAILABLE') {
        return res.status(404).send("Category not found");
    }
    const categoryDTO = {
        id: category.id,
        name: category.name
    };
    res.status(200).json(categoryDTO);
});
// ADMIN ROUTES
// Get all categories (including unavailable - admin only)
exports.categoriesController.get("/admin", (req, res) => {
    console.log("[GET] /categories/admin");
    res.json(categories).status(200);
});
// Get basic category info (admin only)
exports.categoriesController.get("/admin/basic/:id", (req, res) => {
    console.log("[GET] /categories/admin/basic/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        return res.status(400).send("ID must be a number");
    }
    const category = categories.find(c => c.id === id);
    if (!category) {
        return res.status(404).send("Category not found");
    }
    const categoryDTO = {
        id: category.id,
        name: category.name
    };
    res.status(200).json(categoryDTO);
});
// Get detailed category info (admin only)
exports.categoriesController.get("/admin/detail/:id", (req, res) => {
    console.log("[GET] /categories/admin/detail/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        return res.status(400).send("ID must be a number");
    }
    const category = categories.find(c => c.id === id);
    if (!category) {
        return res.status(404).send("Category not found");
    }
    const fullCategoryDTO = {
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status
    };
    res.status(200).json(fullCategoryDTO);
});
// Add new category (admin only)
exports.categoriesController.post("/admin", (req, res) => {
    console.log("[POST] /categories/admin");
    const category = req.body;
    if (!(0, guards_1.isCategory)(category)) {
        return res.status(400).send("Invalid category data");
    }
    category.id = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    category.status = 'AVAILABLE';
    categories.push(category);
    res.status(201).json(category);
});
// Update category (admin only)
exports.categoriesController.put("/admin/:id", (req, res) => {
    console.log("[PUT] /categories/admin/:id");
    const id = parseInt(req.params.id);
    const updatedCategory = req.body;
    if (!(0, guards_1.isNumber)(id) || !(0, guards_1.isCategory)(updatedCategory) || id !== updatedCategory.id) {
        return res.status(400).send("Invalid data");
    }
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).send("Category not found");
    }
    categories[index] = updatedCategory;
    res.status(200).json(updatedCategory);
});
// Set category as unavailable (admin only)
exports.categoriesController.delete("/admin/:id", (req, res) => {
    console.log("[DELETE] /categories/admin/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        return res.status(400).send("ID must be a number");
    }
    const category = categories.find(c => c.id === id);
    if (!category) {
        return res.status(404).send("Category not found");
    }
    // Set category as unavailable
    category.status = 'UNAVAILABLE';
    // Set all products in this category as unavailable
    products_controller_1.products.forEach(p => {
        if (p.categoryId === id) {
            p.status = 'UNAVAILABLE';
        }
    });
    res.status(200).json(category);
});
